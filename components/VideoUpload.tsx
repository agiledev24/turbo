// components/VideoUpload.tsx
import React, { useState } from 'react';
import { createVideo } from '@/utils/create-video'; // Import the createVideo function

const VideoUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [userId, setUserId] = useState<string>(''); // Assuming you have a way to get the user's ID

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setFile(files[0]);
    }
  };

  const handleSubmit = async () => {
    if (file) {
      // Convert file to data URL or similar format that can be sent to the server
      const dataUrl = await convertFileToDataUrl(file);
      // Call createVideo with the image URL and user ID
      const processedVideoUrl = await createVideo(dataUrl, userId);
      // Handle the processed video URL (e.g., display it, save it, etc.)
    }
  };

  // Utility function to convert file to data URL
  const convertFileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} accept="video/*" />
      <button onClick={handleSubmit}>Upload Video</button>
    </div>
  );
};

export default VideoUpload;
