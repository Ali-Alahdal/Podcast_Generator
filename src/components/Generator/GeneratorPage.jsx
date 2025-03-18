import React, { useState } from 'react';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_API_KEY,
  dangerouslyAllowBrowser: true,
});

// Helper: Convert an AudioBuffer into a WAV Blob.
function audioBufferToWav(buffer, opt) {
  opt = opt || {};
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
  let index = 0,
    inputIndex = 0;
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

// Combine an array of AudioBuffers sequentially.
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

// Randomly select two distinct voices (all in lowercase).
function selectRandomVoices() {
  const voices = ["alloy", "ash", "coral", "echo", "fable", "onyx", "nova", "sage", "shimmer"];
  const hostVoice = voices[Math.floor(Math.random() * voices.length)];
  let guestVoice = voices[Math.floor(Math.random() * voices.length)];
  while (guestVoice === hostVoice) {
    guestVoice = voices[Math.floor(Math.random() * voices.length)];
  }
  return { hostVoice, guestVoice };
}

// Generate audio for one line using OpenAI's TTS API.
async function generateLineAudio(lineText, voice) {
  const response = await openai.audio.speech.create({
    model: "tts-1",
    voice: voice,
    input: lineText,
  });
  return response.arrayBuffer();
}

// Generate a podcast transcript using GPT‑4.
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

  // Generate transcript and select voices.
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

      // Randomly select voices for host and guest.
      const voices = selectRandomVoices();
      setHostVoice(voices.hostVoice);
      setGuestVoice(voices.guestVoice);
    } catch (error) {
      console.error('Error generating transcript:', error);
    }
    setLoadingTranscript(false);
  };

  // Handle file upload of transcript JSON.
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonData = JSON.parse(event.target.result);
        if (jsonData.transcript) {
          setTranscript(jsonData.transcript);
          const voices = selectRandomVoices();
          setHostVoice(voices.hostVoice);
          setGuestVoice(voices.guestVoice);
        } else {
          console.error('Uploaded JSON does not contain a transcript property.');
        }
      } catch (error) {
        console.error('Error parsing JSON file:', error);
      }
    };
    reader.readAsText(file);
  };

  // Generate audio for each transcript line using the chosen voices.
  const handleGenerateAudio = async () => {
    if (!transcript) return;
    setLoadingAudio(true);
    try {
      const lines = transcript.split('\n').filter(line => line.trim() !== '');
      const audioBuffers = [];
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();

      for (const line of lines) {
        let speaker = null;
        let text = line;
        if (/^Host\s*:\s*/i.test(line)) {
          speaker = 'host';
          text = line.replace(/^Host\s*:\s*/i, '');
        } else if (/^Guest\s*:\s*/i.test(line)) {
          speaker = 'guest';
          text = line.replace(/^Guest\s*:\s*/i, '');
        } else {
          speaker = 'host'; // default to host
        }
        text = text.trim();
        if (!/[.!?]$/.test(text)) text += '.';

        const chosenVoice = speaker === 'host' ? hostVoice : guestVoice;
        console.log(`Generating audio for speaker: ${speaker}, voice: ${chosenVoice}, text: "${text}"`);
        const arrayBuffer = await generateLineAudio(text, chosenVoice);
        const decodedBuffer = await audioContext.decodeAudioData(arrayBuffer.slice(0));
        audioBuffers.push(decodedBuffer);
      }

      const combinedBuffer = await combineAudioBuffers(audioBuffers);
      const wavBlob = audioBufferToWav(combinedBuffer);
      setCombinedAudioUrl(URL.createObjectURL(wavBlob));
    } catch (error) {
      console.error('Error generating audio:', error);
    }
    setLoadingAudio(false);
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
    </div>
  );
}

export default PodcastGenerator;
