"use server";
import axios from "axios";
import { ImageRatio } from "./types";

export const createImageDalle = async (
  finalPrompt: any,
  imageRatio: ImageRatio
): Promise<any> => {
  // Define an Axios instance with a custom timeout
  const axiosInstance = axios.create({
    timeout: 60000, // 30 seconds timeout
  });

  // if any error then square ratio
  const ratio =
    imageRatio === "horizontal"
      ? "1792x1024"
      : imageRatio === "square"
      ? "1024x1024"
      : imageRatio === "vertical"
      ? "1024x1792"
      : "1024x1024";

  try {
    const response = await axiosInstance.post(
      "https://api.openai.com/v1/images/generations",
      {
        prompt: finalPrompt,
        model: "dall-e-3",
        n: 1,
        size: ratio,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const imageUrl = response.data.data[0];
    return imageUrl;
  } catch (error: any) {
    console.error(
      "Error creating image dalle:",
      error.response?.data || error.message
    );
    throw new Error("Error creating image with DALL·E");
  }
};
