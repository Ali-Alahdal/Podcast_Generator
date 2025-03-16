import React, { useState } from 'react';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_API_KEY,
  dangerouslyAllowBrowser: true,
});


function generatePodcastTranscript(topic, category) {
  const wordRanges = {
    short: { min: 300, max: 400 },
    medium: { min: 500, max: 600 },
    large: { min: 700, max: 800 },
  };
  const range = wordRanges[category] || wordRanges.short;

  const prompt = `Generate a podcast transcript discussing the topic "${topic}". The transcript should be a natural conversation between a host and a guest, each with a random name. It must include an engaging introduction, a dynamic discussion with questions and answers, and a clear ending that refers to our website "mypodcast". The entire transcript should be between ${range.min} and ${range.max} words. Do not include any stage directions or texts in square brackets (e.g. [Podcast Intro Music]).`;

  const messages = [
    { role: 'system', content: 'You are a creative podcast script generator.' },
    { role: 'user', content: prompt },
  ];

  return openai.chat.completions
    .create({
      model: 'gpt-4',
      messages,
      max_tokens: 1200,
      temperature: 0.7,
    })
    .then((response) => response.choices[0].message.content);
}

// Processes the transcript for TTS by removing any host/guest labels
// and appending a custom ending.
function processTranscriptForTTS(transcript) {
  const processed = transcript
    .split('\n')
    .map((line) => line.replace(/^[A-Za-z]+\s*:\s*/, ''))
    .join('\n');
  return processed + "\nThank you for listening to mypodcast.";
}

// Generates audio using OpenAI's TTS API.
async function generateAudioFromText(text) {
  // The TTS API call returns a response containing an ArrayBuffer.
  const mp3Response = await openai.audio.speech.create({
    model: 'tts-1',
    voice: 'alloy', // Change the voice as desired.
    input: text,
  });
  const arrayBuffer = await mp3Response.arrayBuffer();
  return new Blob([arrayBuffer], { type: 'audio/mp3' });
}

function PodcastGenerator() {
  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState('short');
  const [transcript, setTranscript] = useState('');
  const [loadingTranscript, setLoadingTranscript] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [jsonUrl, setJsonUrl] = useState(null);

  const handleGenerateTranscript = async (e) => {
    e.preventDefault();
    setLoadingTranscript(true);
    setAudioUrl(null);
    setJsonUrl(null);
    try {
      const generatedTranscript = await generatePodcastTranscript(topic, category);
      setTranscript(generatedTranscript);
      // Create JSON metadata for download.
      const metadata = {
        topic,
        category,
        transcript: generatedTranscript,
        generatedAt: new Date().toISOString(),
      };
      const jsonBlob = new Blob([JSON.stringify(metadata, null, 2)], { type: 'application/json' });
      setJsonUrl(URL.createObjectURL(jsonBlob));
    } catch (error) {
      console.error('Error generating transcript:', error);
    }
    setLoadingTranscript(false);
  };

  const handleGenerateAudio = async () => {
    if (!transcript) return;
    setLoadingAudio(true);
    try {
      const processedText = processTranscriptForTTS(transcript);
      const audioBlob = await generateAudioFromText(processedText);
      setAudioUrl(URL.createObjectURL(audioBlob));
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
          <button onClick={handleGenerateAudio} style={{ padding: '0.5rem' }} disabled={loadingAudio}>
            {loadingAudio ? 'Generating Audio...' : 'Generate Audio'}
          </button>
        </div>
      )}

      {audioUrl && (
        <div style={{ marginTop: '1rem' }}>
          <audio controls src={audioUrl}></audio>
          <a
            href={audioUrl}
            download="podcast.mp3"
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
