import React, { useState } from 'react';
import axios from 'axios';

const ImageGenerator = () => {
  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Replit's API endpoint
  const replitApiUrl = 'https://api.replit.com/v0/text-to-image';

  const generateImage = async () => {
    setLoading(true);
    setError(null);

    try {
      // Make a POST request to the Replit API
      const response = await axios.post(replitApiUrl, {
        prompt: text, // The text prompt entered by the user
      });

      // Log response for debugging
      console.log(response);

      // Get the image URL from the response
      setImageUrl(response.data.url);
    } catch (err) {
      console.error(err); // Log error details for debugging
      setError('Error generating image');
    } finally {
      setLoading(false); // Turn off loading state
    }
  };

  return (
    <div>
      <h1>Text to Image Generator</h1>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter your text prompt here"
        rows="4"
        cols="50"
      />
      <br />
      <button onClick={generateImage} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Image'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {imageUrl && (
        <div>
          <h3>Generated Image:</h3>
          <img src={imageUrl} alt="Generated" style={{ width: '100%' }} />
        </div>
      )}
    </div>
  );
};

export default ImageGenerator;
