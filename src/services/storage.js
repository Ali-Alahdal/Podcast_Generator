/**
 * Uploads a file to the local server
 * @param {Blob | File} file - The file to upload
 * @param {string} fileName - Ignored by local server (it generates unique names)
 * @returns {Promise<string>} - The URL of the uploaded file
 */
export const uploadFile = async (file, fileName) => {
    console.log("Starting local upload...");

    const formData = new FormData();
    formData.append("file", file, fileName); // Helper: filename ensures Blobs get extensions

    // Upload to local server
    const response = await fetch("http://localhost:3001/upload", {
        method: "POST",
        body: formData
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Upload Failed: ${text}`);
    }

    const data = await response.json();
    console.log("Upload Success:", data);
    return data.url; // Returns e.g. "/uploads/timestamp-file.jpg"
};
