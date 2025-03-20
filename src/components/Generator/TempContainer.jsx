import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import Footer from "../Footer";
import React, { useEffect, useState } from 'react';
import OpenAI from 'openai';
import axios from 'axios';

import Intro from "../../assets/audios/Intro.wav"
import Outro from "../../assets/audios/Outro.wav"
import Podcast from "../Podcast";
import GeneratedPodcast from "../GeneratedPodcast";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_API_KEY,
  dangerouslyAllowBrowser: true,
});

// ----------------- Audio Helpers -----------------

function audioBufferToWav(buffer, opt = {}) {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = opt.float32 ? 3 : 1;
  const bitDepth = format === 3 ? 32 : 16;
  let result;
  if (numChannels === 2) {
    result = interleave(buffer.getChannelData(0), buffer.getChannelData(1));
  } else {
    result = buffer.getChannelData(0);
  }
  return encodeWAV(result, numChannels, sampleRate, bitDepth);
}

function interleave(inputL, inputR) {
  const length = inputL.length + inputR.length;
  const result = new Float32Array(length);
  let index = 0, inputIndex = 0;
  while (index < length) {
    result[index++] = inputL[inputIndex];
    result[index++] = inputR[inputIndex];
    inputIndex++;
  }
  return result;
}

function encodeWAV(samples, numChannels, sampleRate, bitDepth) {
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  const buffer = new ArrayBuffer(44 + samples.length * bytesPerSample);
  const view = new DataView(buffer);
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + samples.length * bytesPerSample, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(view, 36, 'data');
  view.setUint32(40, samples.length * bytesPerSample, true);
  if (bitDepth === 16) {
    floatTo16BitPCM(view, 44, samples);
  }
  return new Blob([view], { type: 'audio/wav' });
}

function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

function floatTo16BitPCM(output, offset, input) {
  for (let i = 0; i < input.length; i++, offset += 2) {
    let s = Math.max(-1, Math.min(1, input[i]));
    output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }
}

async function combineAudioBuffers(buffers) {
  const totalDuration = buffers.reduce((acc, buffer) => acc + buffer.duration, 0);
  const sampleRate = buffers[0].sampleRate;
  const numChannels = buffers[0].numberOfChannels;
  const offlineCtx = new OfflineAudioContext(numChannels, sampleRate * totalDuration, sampleRate);
  let offset = 0;
  buffers.forEach(buffer => {
    const source = offlineCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(offlineCtx.destination);
    source.start(offset);
    offset += buffer.duration;
  });
  const renderedBuffer = await offlineCtx.startRendering();
  return renderedBuffer;
}

// ----------------- Voice & Transcript Helpers -----------------

// Define male and female voices
const voices = {
  male: ["alloy", "fable", "nova"],
  female: ["coral", "echo", "sage", "shimmer"]
};

// Helper to get voice based on role (host, guest)
function getVoiceForRole(role) {
  if (role === "host") {
    return voices.male[Math.floor(Math.random() * voices.male.length)];  // Male voice for host
  } else {
    return voices.female[Math.floor(Math.random() * voices.female.length)];  // Female voice for guest
  }
}

async function generateLineAudio(lineText, voice) {
  const response = await openai.audio.speech.create({
    model: "tts-1",
    voice: voice,
    input: lineText,
  });
  return response.arrayBuffer();
}

async function generatePodcastTranscript(topic, category) {
  const wordRanges = {
    short: { min: 300, max: 400 },
    medium: { min: 500, max: 600 },
    large: { min: 700, max: 800 },
  };
  const range = wordRanges[category] || wordRanges.short;
  const prompt = `Generate a podcast transcript discussing the topic "${topic}". The transcript should be a natural conversation between a host and a guest, labeled with "Host:" and "Guest:" at the start of their lines. It must include an engaging introduction, a dynamic discussion with questions and answers, and a clear ending that refers to our website "mypodcast". The entire transcript should be between ${range.min} and ${range.max} words. Do not include any stage directions or texts in square brackets.`;
  const messages = [
    { role: 'system', content: 'You are a creative podcast script generator.' },
    { role: 'user', content: prompt },
  ];
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages,
    max_tokens: 1200,
    temperature: 0.7,
  });
  return response.choices[0].message.content;
}

// ----------------- Image Generation Helpers (DALL·E 3) -----------------

async function generateImagePrompt(topic) {
  const prompt = `Generate a creative and appealing image prompt for a podcast cover about "${topic}". The prompt should evoke modern, artistic, and visually striking imagery suitable for a podcast cover. Include stylistic details such as color scheme, mood, and art style.`;
  const messages = [
    { role: 'system', content: 'You are a creative image prompt generator.' },
    { role: 'user', content: prompt },
  ];
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages,
    max_tokens: 100,
    temperature: 0.8,
  });
  return response.choices[0].message.content;
}

async function generatePodcastImage(imagePrompt) {
  const response = await openai.images.generate({
    model: "dall-e-3", // DALL·E 3 model
    prompt: imagePrompt,
  });
  return response.data[0].url;  // Return the image URL
}

function TempContainer() {
  const [selectedOption, setSelectedOption] = useState("خيارات");

  // Function to handle the change in selected option
  const handleDropdownSelection = (event) => {
    setSelectedOption(event.target.value);
  };


  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState('short');
  const [transcript, setTranscript] = useState('');
  const [loadingTranscript, setLoadingTranscript] = useState(false);
  const [combinedAudioUrl, setCombinedAudioUrl] = useState(null);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [jsonUrl, setJsonUrl] = useState(null);
  const [hostVoice, setHostVoice] = useState(null);
  const [guestVoice, setGuestVoice] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const [loading , setLoading] = useState(false);
  const [transscriptFininshed , setTranscriptFinished] = useState(false);
  const [audioFinished , setAudioFinished] = useState(false);
  const [imageFinished , setImageFinished] = useState(false);

  const [loadingMsg , setLoadingMsg] = useState("")

  // Generate transcript and select voices
  const handleGenerateTranscript = async (e) => {
    e.preventDefault();
    setLoadingTranscript(true);
    setCombinedAudioUrl(null);
    setJsonUrl(null);
    setLoading(true);
    setLoadingMsg("... جاري توليد المحتوى ");
    try {
      console.log("Started Transscript");
      
      const generatedTranscript = await generatePodcastTranscript(topic, category);
      setTranscript(generatedTranscript);
      handleGenerateAudio(generatedTranscript , getVoiceForRole('host') ,getVoiceForRole('guest') );
     
      const metadata = {
        topic,
        category,
        transcript: generatedTranscript,
        generatedAt: new Date().toISOString(),
      };
      const jsonBlob = new Blob([JSON.stringify(metadata, null, 2)], { type: 'application/json' });
      setJsonUrl(URL.createObjectURL(jsonBlob));
      setHostVoice(getVoiceForRole('host'));  // Assign voice based on role
      setGuestVoice(getVoiceForRole('guest'));  // Assign voice based on role
      if(jsonBlob){
       
      }
    } catch (error) {
      console.error('Error generating transcript:', error);
      alert('Failed to generate transcript.');
      setLoading(false);
    }
    setLoadingTranscript(false);
    setTranscriptFinished(true);
   
  };

  
  // Generate audio from transcript
  const handleGenerateAudio = async (generatedTranscript , hostVoice , guestVoice) => {
    if (!generatedTranscript) {
      console.log("Recjected");
      return;
    }
    setLoadingAudio(true);
    setLoading(true);
    setLoadingMsg("... جاري توليد الصوتيات ");
    try {
      console.log("Started Audio");
      
      const lines = generatedTranscript.split('\n').filter(line => line.trim() !== '');
      const audioBuffers = [];
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
      // Load Intro and Outro Audio
      const introBuffer = await loadAudioFile(Intro, audioContext);
      const outroBuffer = await loadAudioFile(Outro, audioContext);
  
      // Add Intro to the audioBuffers array
      audioBuffers.push(introBuffer);
  
      // Process each line of the transcript
      for (const line of lines) {
        let speaker = 'host';
        let text = line;
        if (/^Host\s*:\s*/i.test(line)) {
          speaker = 'host';
          text = line.replace(/^Host\s*:\s*/i, '');
        } else if (/^Guest\s*:\s*/i.test(line)) {
          speaker = 'guest';
          text = line.replace(/^Guest\s*:\s*/i, '');
        }
        text = text.trim();
        if (!/[.!?]$/.test(text)) text += '.';
        const chosenVoice = (speaker === 'host') ? hostVoice : guestVoice;
        console.log(`Generating audio for ${speaker} (voice: ${chosenVoice}): "${text}"`);
  
        const arrayBuffer = await generateLineAudio(text, chosenVoice);
        const decodedBuffer = await audioContext.decodeAudioData(arrayBuffer.slice(0));
  
        // Add a small "breathing" pause (e.g., 500ms of silence)
        const silenceDuration = 1;  // 1500ms pause
        const silenceBuffer = audioContext.createBuffer(decodedBuffer.numberOfChannels, silenceDuration * decodedBuffer.sampleRate, decodedBuffer.sampleRate);
  
        // Combine the speech and silence (breath)
        audioBuffers.push(decodedBuffer, silenceBuffer);
      }
  
      // Add Outro to the audioBuffers array
      audioBuffers.push(outroBuffer);
  
      // Combine all audio buffers (Intro + Transcript + Outro)
      const combinedBuffer = await combineAudioBuffers(audioBuffers);
      const wavBlob = audioBufferToWav(combinedBuffer);
      setCombinedAudioUrl(URL.createObjectURL(wavBlob));
    } catch (error) {
      console.error('Error generating audio:', error);
      alert('Failed to generate audio.');
      setLoading(false);
    
    }
    setLoadingAudio(false);
    setAudioFinished(true);
    handleGenerateImage();
  };
    // Helper function to load audio file and decode it
  const loadAudioFile = async (filePath, audioContext) => {
    const response = await fetch(filePath);
    const arrayBuffer = await response.arrayBuffer();
    return audioContext.decodeAudioData(arrayBuffer);
  };
  // Generate podcast image using DALL·E 3
  const handleGenerateImage = async () => {
    if (!topic) return;
    setLoadingImage(true);
    

    try {
      setLoading(true);
      setLoadingMsg("...جاري اضافة اللمسات الاخيرة ");

      const imgPrompt = await generateImagePrompt(topic);
      console.log("Generated image prompt:", imgPrompt);
      const imgUrl = await generatePodcastImage(imgPrompt);
      setImageUrl(imgUrl);
    } catch (error) {
      console.error("Error generating podcast image:", error);
      alert('Failed to generate image.');
      setLoading(false);
    }
    setLoadingImage(false);
    setImageFinished(true);
   
  };

  const handleSendToBackend = async () => {
    try {
      setLoading(true);
      setLoadingMsg("...جاري حفظ البودكاست");

      const formData = new FormData();
      formData.append('Subject', topic);
      formData.append('Size', category);
      formData.append('Content', transcript);
      formData.append('IsPublic', 'true');
      
      // For audio file, fetch the blob from the URL
      if (combinedAudioUrl) {
        const audioResp = await fetch(combinedAudioUrl);
        const audioBlob = await audioResp.blob();
        formData.append('Audio', audioBlob, 'podcast.wav');
      }
      
      if (imageUrl) {
        
        formData.append('Image', imageUrl); 

      }
  
      const response = await axios.post(
        'https://podcastai.somee.com/api/podcast',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log('Podcast submitted successfully!', response.data);
      alert('Podcast submitted successfully!');
    } catch (error) {
      console.error('Error submitting podcast:', error);
      alert('Failed to submit podcast.');

    }
    setLoading(false);

  };


  useEffect(() =>{
    if(audioFinished === true && transscriptFininshed === true && imageFinished === true){
        if(combinedAudioUrl != null && imageUrl != null && transcript != ""){
          handleSendToBackend();
        }
    }
  }, [audioFinished , transscriptFininshed , imageFinished])
  return (
    <>
      <nav dir="rtl">
        <div className="flex items-center p-0 m-0 justify-around">
          <div className="flex items-center justify-center">
            <Link to={"/"}>
              <img className="w-auto h-28" src={logo} alt="Logo" />
            </Link>
          </div>

          <div className="flex items-center justify-center text-gray-600 capitalize">
            <Link
              to={"/"}
              className="mx-2 text-[var(--text-color)] border-b-2 border-purple-600"
            >
              الرئيسية
            </Link>
            <Link
              to={"/"}
              className="mx-2 text-[var(--text-color)] border-b-2 border-transparent hover:text-gray-100 hover:border-purple-600 sm:mx-6"
            >
              بودكاستات منشئة
            </Link>
            <Link
              to={"/"}
              className="mx-2 text-[var(--text-color)] border-b-2 border-transparent hover:text-gray-100 hover:border-purple-600 sm:mx-6"
            >
              فريق العمل
            </Link>
            <Link
              to={"/"}
              className="mx-2 text-[var(--text-color)] border-b-2 border-transparent hover:text-gray-100 hover:border-purple-600 sm:mx-6"
            >
              معلومات التواصل
            </Link>
          </div>
        </div>
      </nav>
      
      <div className="text-[#999] flex flex-col items-center">
        <div className="container mx-auto h-96 flex flex-col md:flex-row  mt-10 ">
        
          <div className="w-full h-full ms-32">
            <GeneratedPodcast topic={topic} audio={combinedAudioUrl} image={imageUrl} loading={loading} loadingMsg={loadingMsg} />

          </div>
          
          {/* Left Panel - Controls */}
          <div className=" md:py-24 me-32 rounded-lg w-full md:w-3/3 text-left transition duration-200 ">
            <div className="flex items-center gap-3 justify-end">
              {/* Podcast Length Selector (Dropdown replaced with select) */}
              <div className="relative inline-block">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="block w-full  bg-[var(--bg-color)] text-[var(--text-color)] border-2 border-gray-500 rounded-md px-3 py-2 focus:outline-none"
                >
                  
                  <option value="short">قصير</option>
                  <option value="medium">متوسط</option>
                  <option value="large">طويل</option>
                </select>
              </div>

              <input
                dir="rtl"
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="bg-[#555] p-2 w-full rounded-xl border-2 border-gray-500 transition duration-200 focus:border-white focus:outline-none bg-[var(--bg-color)] text-gray-300"
                placeholder="اكتب الموضوع هنا. . . . ."
              />
            </div>
            <div className="flex flex-col gap-3 mt-10">
              <button disabled={loading} onClick={handleGenerateTranscript} className="bg-[var(--primary-color)] font-bold text-[var(--text-color)] px-12 transition duration-300 py-3 rounded-xl mb-5 mx-12 ">
                أنشئ بودكاست
              </button>
              <div className="flex gap-6 justify-center items-center">
                <a  href={jsonUrl} download="transcript.json" >
                  <button disabled={loading} className="bg-[var(--bg-color)] flex border-2 px-10 py-2 transition duration-200 rounded-2xl text-[var(--text-color)] border-[#444] hover:bg-[#222]">
                  تنزيل النص
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                  </svg>

                  </button>

                </a>

                 <a  href={combinedAudioUrl} download="podcast.wav " className="flex ">
                  <button disabled={loading} className="bg-[var(--bg-color)] border-2 px-10 py-2 flex items-center transition duration-200 rounded-2xl text-[var(--text-color)] border-[#444] hover:bg-[#222]">
                  تنزيل الصوت  
                  
                  <svg className="size-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
                  </svg>
                  </button>
                </a>

              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default TempContainer;
