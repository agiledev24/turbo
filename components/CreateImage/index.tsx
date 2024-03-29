import { useUserCreditsStore } from "@/lib/store";
import { createImageDalle } from "@/utils/create-image-dalle";
import { createImageSdxl } from "@/utils/create-image-sdxl";
import { ImageRatio, ImageStyle } from "@/utils/types";
import { usePrivy } from "@privy-io/react-auth";
import axios from "axios";
import { useState } from "react";
import { SaveModal } from "../SaveModa";
import { VideoResult } from "../VideoResult";
import { Button } from "../ui/button";
import { ImageRatioSelector } from "./ImageRatioSelector";
import { ImageStyleSelector } from "./ImageStyleSelector";

type Props = {
  finalPrompt: any;
  setImageUrl: any;
  imageUrl: any;
};

export const CreateImage = ({ finalPrompt, setImageUrl, imageUrl }: Props) => {
  const [videoId, setVideoId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [creatingVideo, setCreatingVideo] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = usePrivy();
  const [progress, setProgress] = useState(0); // Progress of the timer
  const [openSaveModal, setOpenSaveModal] = useState(false);
  const [itemsLimitReached, setItemsLimitReached] = useState(false);
  const { userImageCredits, userVideoCredits, setUserImageCredits } =
    useUserCreditsStore();
  const [imageRatio, setImageRatio] = useState<null | ImageRatio>(null);
  const [imageStyle, setImageStyle] = useState<null | ImageStyle>(null);

  const base64ToImageUrl = (base64Image: any) => {
    return `data:image/png;base64,${base64Image}`;
  };

  const handleCreateImage = async (
    imageRatio: ImageRatio,
    imageStyle: ImageStyle
  ) => {
    setLoadingImage(true);
    setProgress(0); // Initialize progress
    setErrorMessage(""); // Reset error message

    try {
      // Simulate a delay to show progress bar for demonstration
      const simulateDelay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));
      for (let i = 1; i <= 10; i++) {
        await simulateDelay(1500); // Simulate a 1.5 second delay for each 10% progress
        setProgress(i * 10); // Update progress
      }

      let response;
      if (imageStyle === "animated") {
        response = await createImageDalle(finalPrompt, imageRatio);
      } else if (imageStyle === "realistic") {
        response = await createImageSdxl(finalPrompt, imageRatio);
      }

      if (response) {
        if (imageStyle === "realistic" && response.base64Image) {
          setImageUrl(base64ToImageUrl(response.base64Image));
        } else if (imageStyle === "animated" && response.url) {
          setImageUrl(response.url);
        } else {
          setErrorMessage("No image data received");
        }
      } else {
        setErrorMessage("Invalid response data from the server");
      }
    } catch (error) {
      console.error("Error creating image:", error);
      setErrorMessage("Error creating image");
    } finally {
      setLoadingImage(false); // Ensure loading state is reset
      setProgress(100); // Ensure progress is completed
    }
  };

  const handleCreateVideo = async () => {
    try {
      setCreatingVideo(true);
      // const response = await createVideo(imageUrl);
      const response = await axios.post(
        "https://vpm-express-server-b18804665478.herokuapp.com/create-video",
        { imageUrl, imageRatio }
      );
      setVideoId(response.data.videoId);
    } catch (error: any) {
      console.error("Error creating video:", error.statusMessage);
      setErrorMessage("Error creating video");
    } finally {
      setCreatingVideo(false);
    }
  };

  const handleSaveToGallery = async () => {
    if (!imageUrl) {
      alert("Please select an image or video to save.");
      return;
    }

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
          imageUrl,
          isVideo: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      await setUserImageCredits(data.jpgCount);

      if (data.jpgCount <= 0) {
        setItemsLimitReached(true);
      }
      setOpenSaveModal(true);
      // alert("Saved to your gallery!");
    } catch (error) {
      console.error("Error saving to gallery:", error);
      alert("Oops! Something went wrong.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-row flex-wrap justify-center gap-8">
      <div className="flex flex-col">
        {!imageUrl && (
          <div className="flex flex-wrap gap-3 mt-2 md:flex-nowrap">
            <div>
              <ImageStyleSelector
                onClick={setImageStyle}
                selectedStyle={imageStyle}
              />
              <ImageRatioSelector
                onClick={setImageRatio}
                selectedRatio={imageRatio}
              />
              <Button
                className="w-full mt-10"
                disabled={
                  !imageStyle ||
                  !imageRatio ||
                  loadingImage ||
                  (typeof userImageCredits === "number" &&
                    userImageCredits <= 0)
                }
                onClick={() => {
                  handleCreateImage(imageRatio!, imageStyle!);
                }}
              >
                {loadingImage ? "Generating Image..." : "Generate Image"}
              </Button>
            </div>
          </div>
        )}

        {loadingImage && (
          <div className="w-full my-4 bg-gray-700 rounded-lg">
            <div
              className="p-1 text-xs font-medium leading-none text-center text-white rounded-full bg-primary"
              style={{ width: `${progress}%` }}
            >
              {Math.round(progress)}%
            </div>
          </div>
        )}

        {imageUrl && (
          <div>
            <img
              className="rounded-lg w-[500px]"
              src={imageUrl}
              alt="Generated Image"
            />
            <div className="flex gap-4">
              <Button
                disabled={isSaving}
                size="lg"
                className="flex items-center w-full mt-4"
                onClick={handleSaveToGallery}
              >
                {isSaving ? "Saving..." : "Save to Gallery"}
              </Button>
              <Button
                disabled={
                  videoId.length > 0 ||
                  creatingVideo ||
                  (typeof userVideoCredits === "number" &&
                    userVideoCredits <= 0)
                }
                size="lg"
                className="flex items-center w-full mt-4"
                onClick={handleCreateVideo}
              >
                {typeof userVideoCredits === "number" && userVideoCredits <= 0
                  ? "You've reached video generation limit"
                  : creatingVideo
                  ? "Video creating..."
                  : "Create Video"}
              </Button>
            </div>
          </div>
        )}
      </div>
      {videoId && <VideoResult videoId={videoId} />}{" "}
      {/* Ensure VideoResult is properly defined */}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <SaveModal
        open={openSaveModal}
        limitReached={itemsLimitReached}
        onOpenChange={setOpenSaveModal}
      />
    </div>
  );
};
