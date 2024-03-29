"use server";
import axios from "axios";

export const fetchQuestions = async (
  selectedMode: any,
  selectedNumQuestions: any
): Promise<any> => {
  try {
    const response = await axios.post(
      "https://vpm-flask-backend-038ee8546c50.herokuapp.com/start",
      {
        mode: selectedMode,
        numQuestions: selectedNumQuestions,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching questions:", error);
    // Debugging: Log the error
    console.log("Error in fetchQuestions:", error);
    throw error; // Re-throw the error to handle it in the component if needed
  }
};
