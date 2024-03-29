"use server";

import axios from "axios";

export const fetchNumQuestionsOptions = async (mode: any) => {
  try {
    const response = await axios(
      `https://vpm-flask-backend-038ee8546c50.herokuapp.com/available-questions/${mode}`
    );
    console.log(
      "response.data.numQuestionsOptions",
      response.data.numQuestionsOptions
    );
    return response.data.numQuestionsOptions;
  } catch (error) {
    console.error("Error fetching num questions options:", error);
  }
};
