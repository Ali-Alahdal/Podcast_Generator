import React, { useState } from 'react';
import OpenAI from 'openai';
import axios from 'axios';

import Intro from "../../assets/audios/Intro.wav"
import Outro from "../../assets/audios/Outro.wav"

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
  const prompt = `Generate a creative and simple image prompt for a podcast cover about "${topic}". Visually striking imagery suitable for a podcast cover.`;
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

// ----------------- Main Component -----------------

function PodcastGenerator() {
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

  // Generate transcript and select voices
  const handleGenerateTranscript = async (e) => {
    e.preventDefault();
    setLoadingTranscript(true);
    setCombinedAudioUrl(null);
    setJsonUrl(null);

    
    try {
      const generatedTranscript = await generatePodcastTranscript(topic, category);
      setTranscript(generatedTranscript);
     
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
    } catch (error) {
      console.error('Error generating transcript:', error);
      alert('Failed to generate transcript.');
    }
    setLoadingTranscript(false);
    
  };

  // Handle file upload for transcript JSON
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonData = JSON.parse(event.target.result);
        if (jsonData.transcript) {
          setTranscript(jsonData.transcript);
          if (jsonData.topic) {
            setTopic(jsonData.topic);
          }
          setHostVoice(getVoiceForRole('host'));
          setGuestVoice(getVoiceForRole('guest'));
          if (jsonData.topic) {
            setTimeout(() => {
              handleGenerateImage();
            }, 100);
          }
        } else {
          console.error('Uploaded JSON does not contain a transcript property.');
          alert('JSON file must contain a "transcript" field.');
        }
      } catch (error) {
        console.error('Error parsing JSON file:', error);
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  // Generate audio from transcript
  const handleGenerateAudio = async () => {
    if (!transcript) return;
    setLoadingAudio(true);
    try {
      const lines = transcript.split('\n').filter(line => line.trim() !== '');
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
    }
    setLoadingAudio(false);
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
      const imgPrompt = await generateImagePrompt(topic);
      console.log("Generated image prompt:", imgPrompt);
      const imgUrl = await generatePodcastImage(imgPrompt);
      setImageUrl(imgUrl);
    } catch (error) {
      console.error("Error generating podcast image:", error);
      alert('Failed to generate image.');
    }
    setLoadingImage(false);
  };

  // Send podcast data to the backend
  const handleSendToBackend = async () => {
    try {
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
      
      // Send image URL as text (not as a file)
      if (imageUrl) {
        formData.append('Image', imageUrl);  // Send image URL as text
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
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Podcast Generator</h1>
      <form onSubmit={handleGenerateTranscript} style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Enter a topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          style={{ padding: '0.5rem', width: '300px', marginRight: '1rem' }}
          required
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ padding: '0.5rem', marginRight: '1rem' }}
        >
          <option value="short">Short (300-400 words)</option>
          <option value="medium">Medium (500-600 words)</option>
          <option value="large">Large (700-800 words)</option>
        </select>
        <button type="submit" style={{ padding: '0.5rem' }} disabled={loadingTranscript}>
          {loadingTranscript ? 'Generating Transcript...' : 'Generate Transcript'}
        </button>
      </form>

      <div style={{ marginBottom: '1rem' }}>
        <label>
          Upload Transcript JSON:{' '}
          <input type="file" accept=".json" onChange={handleFileUpload} />
        </label>
      </div>

      {transcript && (
        <div>
          <h2>Transcript</h2>
          <pre style={{ whiteSpace: 'pre-wrap', backgroundColor: '#f4f4f4', padding: '1rem' }}>
            {transcript}
          </pre>
          {jsonUrl && (
            <a href={jsonUrl} download="transcript.json" style={{ marginRight: '1rem' }}>
              Download Transcript JSON
            </a>
          )}
          <p>Host Voice: {hostVoice}</p>
          <p>Guest Voice: {guestVoice}</p>
          <button onClick={handleGenerateAudio} style={{ padding: '0.5rem' }} disabled={loadingAudio}>
            {loadingAudio ? 'Generating Audio...' : 'Generate Audio'}
          </button>
        </div>
      )}

      {combinedAudioUrl && (
        <div style={{ marginTop: '1rem' }}>
          <audio controls src={combinedAudioUrl}></audio>
          <a
            href={combinedAudioUrl}
            download="podcast.wav"
            style={{ marginLeft: '1rem', padding: '0.5rem', border: '1px solid #000', textDecoration: 'none' }}
          >
            Download Audio
          </a>
        </div>
      )}

      <div style={{ marginTop: '2rem' }}>
        <button onClick={handleGenerateImage} style={{ padding: '0.5rem' }} disabled={loadingImage}>
          {loadingImage ? 'Generating Image...' : 'Generate Podcast Cover Image'}
        </button>
        {imageUrl && (
          <div style={{ marginTop: '1rem' }}>
            <img src={imageUrl} alt="Podcast Cover" style={{ maxWidth: '100%', height: 'auto' }} />
            <a
              href={imageUrl}
              download="podcast_cover.jpg"
              style={{ display: 'block', marginTop: '0.5rem' }}
            >
              Download Podcast Cover Image
            </a>
          </div>
        )}
      </div>

      <div style={{ marginTop: '2rem' }}>
        <button onClick={handleSendToBackend} style={{ padding: '0.5rem' }}>
          Send to Backend
        </button>
      </div>
    </div>
  );
}

export default PodcastGenerator;
