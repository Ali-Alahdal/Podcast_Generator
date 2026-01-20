import React, { useState } from 'react';
import { uploadFile } from '../services/storage';
import { addDocument } from '../services/db';

const UploadPodcast = () => {
    const [title, setTitle] = useState('');
    const [audioFile, setAudioFile] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleUpload = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!audioFile || !title) {
                alert("Title and Audio are required");
                setLoading(false);
                return;
            }

            console.log("Uploading Audio...");
            const audioUrl = await uploadFile(audioFile, `${Date.now()}_${audioFile.name}`);

            let imageUrl = null;
            if (imageFile) {
                console.log("Uploading Image...");
                imageUrl = await uploadFile(imageFile, `${Date.now()}_${imageFile.name}`);
            }

            console.log("Saving to Firestore...");
            await addDocument("podcasts", {
                topic: title,
                audioUrl: audioUrl,
                imageUrl: imageUrl,
                transcript: "Manual Upload",
                category: "Manual",
                isPublic: true
            });

            alert("Podcast Uploaded Successfully!");
            setTitle('');
            setAudioFile(null);
            setImageFile(null);

        } catch (error) {
            console.error(error);
            alert("Error: " + error.message);
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--bg-color)] text-[var(--text-color)] p-10">
            <h1 className="text-3xl mb-10">Manual Podcast Upload</h1>
            <form onSubmit={handleUpload} className="flex flex-col gap-5 w-full max-w-md">
                <input
                    className="p-3 rounded text-black font-bold"
                    type="text"
                    placeholder="Podcast Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <button
                    type="button"
                    onClick={async () => {
                        try {
                            console.log("Testing connection...");
                            const res = await fetch("http://localhost:3001/auth");
                            const text = await res.text();
                            console.log("Server response:", text);
                            alert("Server Connection Success!\nResponse: " + text);
                        } catch (e) {
                            console.error("Test failed", e);
                            alert("Server Connection Failed!\nError: " + e.message);
                        }
                    }}
                    className="bg-blue-500 p-2 text-white rounded"
                >
                    Test Server Connection
                </button>

                <label>Audio File:</label>
                <input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => setAudioFile(e.target.files[0])}
                />

                <label>Cover Image:</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                />

                <button
                    disabled={loading}
                    type="submit"
                    className="bg-purple-600 p-3 rounded text-white font-bold hover:bg-purple-700 disabled:opacity-50"
                >
                    {loading ? "Uploading..." : "Save Podcast"}
                </button>
            </form>
        </div>
    );
};

export default UploadPodcast;
