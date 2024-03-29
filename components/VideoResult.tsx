import { videoBase64 } from "@/app/video";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { SaveModal } from "./SaveModa";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

type Props = {
  videoId: any;
};

export const VideoResult = ({ videoId }: Props) => {
  const [progress, setProgress] = useState(0);
  const [videoStatus, setVideoStatus] = useState("pending");
  const [base64Video, setBase64Video] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { user } = usePrivy();
  const [openSaveModal, setOpenSaveModal] = useState(false);
  const [itemsLimitReached, setItemsLimitReached] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const base64StringToBlob = (base64String: any, contentType: any) => {
    const byteCharacters = atob(base64String);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  };

  let videoBlob = base64StringToBlob(videoBase64, "video/mp4");
  const [videoUrl, setVideoUrl] = useState(URL.createObjectURL(videoBlob));

  const updateStatus = async () => {
    if (!videoId) {
      console.error("Video ID is undefined or null.");
      return;
    }
    setIsGenerating(true);
    console.log("pooling", videoId);
    try {
      // const response = await getVideoStatus(videoId);
      const response = await fetch(
        `https://vpm-express-server-b18804665478.herokuapp.com/video-status/${videoId}`
      );
      // if (!response.ok) {
      //   throw new Error(`HTTP error! Status: ${response.status}`);
      // }
      const contentType = response.headers.get("content-type");
      console.log("res", response);
      if (contentType?.includes("application/json")) {
        const data = await response.json();

        if (data.status === "complete") {
          setProgress(100);
          setBase64Video(data.video);

          const blob = base64StringToBlob(data.video, "video/mp4");
          const videoUrl = URL.createObjectURL(blob);
          setVideoUrl(videoUrl);
          setVideoStatus("complete");
        } else if (data.status === "in-progress") {
          const expectedGenerationTime = 360; // in seconds
          const progressPercent = Math.min(
            100,
            (data.elapsed_time / expectedGenerationTime) * 100
          );
          setProgress(progressPercent);
        }
      } else if (contentType === "video/mp4") {
        // Handle direct video response
        videoBlob = await response.blob();
        const url = URL.createObjectURL(videoBlob);
        setProgress(100);
        setVideoUrl(url);
        setVideoStatus("complete");
      } else {
        console.error("Unexpected response content type:", contentType);
      }
    } catch (error) {
      console.error("Error:", error);
      setVideoStatus("error");
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    let interval: any;
    if (videoStatus === "complete" && videoUrl) {
      clearInterval(interval);
    } else {
      interval = setInterval(updateStatus, 30000); // Poll every 30 seconds
    }

    return () => {
      clearInterval(interval); // Cleanup the interval when the component unmounts
    };
  }, [videoId, videoStatus, videoUrl]);

  const handleSaveToGallery = async () => {
    if (!user) {
      alert("User not authenticated. Please log in.");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch("/api/save-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          imageUrl: base64Video,
          isVideo: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (
        data.mp4Count >=
        Number(process.env.NEXT_PUBLIC_USER_VIDEOS_COUNT!) - 1
      ) {
        setItemsLimitReached(true);
      }
      setOpenSaveModal(true);
    } catch (error) {
      console.error("Error saving to gallery:", error);
      alert("Oops! Something went wrong.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      {videoStatus === "complete" && videoUrl ? (
        <>
          <video className="w-[500px] rounded-lg" controls src={videoUrl}>
            Sorry, your browser doesn't support embedded videos.
          </video>
          <Button
            disabled={isSaving}
            size="lg"
            className="flex items-center w-full mt-4"
            onClick={handleSaveToGallery} // Ensure this function is defined and manages isGenerating state
          >
            {isSaving ? "Video is saving..." : "Save Video to Gallery"}
          </Button>
          <SaveModal
            open={openSaveModal}
            limitReached={itemsLimitReached}
            onOpenChange={setOpenSaveModal}
          />
        </>
      ) : (
        <p>
          <Skeleton className="h-[500px] w-[500px] justify-center items-center flex">
            {videoStatus === "error"
              ? "Error in video processing."
              : "We're doing some AI magic now. Video is being processed..."}
          </Skeleton>
        </p>
      )}
    </div>
  );
};
