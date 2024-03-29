"use server";
import axios from "axios";
import { ImageRatio } from "./types";

export const createImageSdxl = async (
  finalPrompt: any,
  imageRatio: ImageRatio
): Promise<any> => {
  // if any error then square ratio
  const ratio =
    imageRatio === "horizontal"
      ? {
          width: 1216,
          height: 832,
        }
      : imageRatio === "square"
      ? {
          width: 1024,
          height: 1024,
        }
      : imageRatio === "vertical"
      ? {
          width: 832,
          height: 1216,
        }
      : {
          width: 1024,
          height: 1024,
        };

  try {
    const response = await axios.post(
      "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image",
      JSON.stringify({
        text_prompts: [
          {
            text: finalPrompt,
          },
        ],
        cfg_scale: 7,
        height: ratio.height,
        width: ratio.width,
        steps: 30,
        samples: 1,
      }),
      {
        headers: {
          Authorization: `Bearer ${process.env.STABLE_API_KEY}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    // Log the response for debugging
    console.log("API Response:", response.data);

    // Return the base64 image data
    return { base64Image: response.data.artifacts[0].base64 };
  } catch (error: any) {
    console.error("Error creating image sdxl:", error.response.data);
    throw error; // Re-throw the error to handle it in the component if needed
  }
};