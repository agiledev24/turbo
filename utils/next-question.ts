"use server";
import axios from "axios";

export const nextQuestion = async (
  newResponses: any,
  mode: any,
  numQuestions: any
): Promise<any> => {
  try {
    const response = await axios.post(
      "https://vpm-flask-backend-038ee8546c50.herokuapp.com/next-question",
      {
        responses: newResponses,
        mode: mode,
        numQuestions: numQuestions,
      }
    );

    console.log("API Response:", response.data); // Debugging line
    return response.data;
  } catch (error) {
    console.error("Error fetching next question:", error);
    throw error; // Re-throw the error to handle it in the component if needed
  }
};
