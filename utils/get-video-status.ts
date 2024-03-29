// "use server";

import axios from "axios";

export const getVideoStatus = async (videoId: any): Promise<any> => {
  try {
    console.log("videoId getVideoStatus:", videoId);
    // const response = await axios(
    //   // `https://vpm-express-server.vercel.app/video-status/${videoId}`
    //   `https://vpm-express-server-b18804665478.herokuapp.com/video-status/${videoId}`
    // );
    const response = await axios(
      // `https://vpm-express-server.vercel.app/video-status/${videoId}`
      `http://localhost:3000/api/get-video-status/${videoId}`
    );

    console.log("API Response getVideoStatus:", response.data);

    // if (!response.ok) {
    //   throw new Error(`HTTP error! Status: ${response.status}`);
    // }
    // console.log("server res", response.json());
    return response.data;
  } catch (error) {
    console.error("Error getting video status:", error);
    throw error; // Re-throw the error to handle it in the component if needed
  }
};
