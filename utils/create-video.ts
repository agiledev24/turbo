import axios from "axios";

export const createVideo = async (dataUrl: string, userId: string): Promise<string> => {
  try {
    const response = await axios.post(
      "https://vpm-express-server-b18804665478.herokuapp.com/create-video",
      { dataUrl, userId } // Pass both dataUrl and userId in the request body
    );
    // Assuming the server returns the processed video URL in the response
    return response.data.processedVideoUrl;
  } catch (error: any) {
    console.error("Error creating video", error.response?.statusText || error.message);
    throw error;
  }
};