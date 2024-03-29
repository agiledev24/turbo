import React, { useCallback, useState } from 'react';
import { useCreateAsset } from "@livepeer/react";
import { useDropzone } from "react-dropzone";

const VideoUploadComponent = () => {
  const [video, setVideo] = useState<File | undefined>();
  const {
    mutate: createAsset,
    data: asset,
    status,
    progress,
    error,
  } = useCreateAsset(
    video
      ? {
          sources: [{ name: video.name, file: video }] as const,
        }
      : null
  );

  // Rest of your component for handling video upload

  return (
    <div>
      {/* Your JSX for handling video upload */}
    </div>
  );
};

export default VideoUploadComponent;
