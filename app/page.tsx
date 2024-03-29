"use client";

import "@/app/globals.css";
import { CreateImage } from "@/components/CreateImage";
import { ZeroCreditsAlert } from "@/components/ZeroCreditsAlert";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { useUserCreditsStore } from "@/lib/store";
import { fetchNumQuestionsOptions } from "@/utils/fetchNumQuestionsOptions";
import { fetchQuestions } from "@/utils/fetchQuestions";
import { nextQuestion } from "@/utils/next-question";
import { usePrivy } from "@privy-io/react-auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const { login, ready, authenticated } = usePrivy();
  const [mode, setMode] = useState("");
  const [numQuestions, setNumQuestions] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<any[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [responses, setResponses] = useState({});
  const [finalPrompt, setFinalPrompt] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { userImageCredits } = useUserCreditsStore();

  useEffect(() => {
    console.log("userImageCredits", userImageCredits && userImageCredits <= 0);
  }, [userImageCredits]);

  // if (!ready || userImageCredits === undefined) {
  //   return (
  //     <div className="flex items-center gap-2">
  //       <Loader />
  //       Loading...
  //     </div>
  //   );
  // }

  // if (!authenticated) {
  //   return (
  //     <div className="flex flex-col items-center gap-4">
  //       <img
  //         src={"/logo.png"}
  //         alt="Logo"
  //         style={{ maxWidth: "200px", marginBottom: "20px" }}
  //       />

  //       <div className="flex flex-col gap-4">
  //         <Button size="lg" variant="outline" onClick={login}>
  //           Sign In to Select Modes
  //         </Button>
  //         <Button size="lg" asChild>
  //           <Link href="https://eu.jotform.com/form/240594613118051">
  //             Sign Up (Waitlist)
  //           </Link>
  //         </Button>
  //       </div>
  //     </div>
  //   );
  // }

  // if (userImageCredits <= 0) {
  //   return <ZeroCreditsAlert />;
  // }

  const selectMode = async (selectedMode: string) => {
    try {
      const fetchedOptions = await fetchNumQuestionsOptions(selectedMode);
      setMode(selectedMode);
      setOptions(fetchedOptions);
      setNumQuestions(0);
      setQuestions([]);
      setResponses({});
      setFinalPrompt(null);
      console.log("Mode selected:", selectedMode);
    } catch (error) {
      console.error("Error fetching options for mode:", selectedMode, error);
    }
  };

  const selectNumQuestions = async (selectedNumQuestions: number) => {
    try {
      const data = await fetchQuestions(mode, selectedNumQuestions);
      setNumQuestions(selectedNumQuestions);
      setQuestions([data]); // Assuming data is { question, options }
      setCurrentQuestionIndex(0);
      console.log("Questions data:", data);
    } catch (error) {
      console.error("Error fetching questions for mode:", mode, error);
    }
  };

  const handleOptionSelect = async (option: string) => {
    const newResponses = {
      ...responses,
      [questions[currentQuestionIndex].question]: option,
    };
    setResponses(newResponses);

    if (currentQuestionIndex < numQuestions - 1) {
      try {
        const nextQuestionData = await nextQuestion(
          newResponses,
          mode,
          numQuestions
        );
        if (nextQuestionData.question) {
          setQuestions((questions) => [...questions, nextQuestionData]);
          setCurrentQuestionIndex((index) => index + 1);
        } else {
          console.error(
            "Expected to receive the next question, but did not:",
            nextQuestionData
          );
        }
      } catch (error) {
        console.error("Error fetching next question:", error);
      }
    } else {
      try {
        const finalPromptData = await nextQuestion(
          newResponses,
          mode,
          numQuestions
        );
        if (finalPromptData.finalPrompt) {
          setFinalPrompt(finalPromptData.finalPrompt);
        } else {
          console.error(
            "Expected to receive the final prompt, but did not:",
            finalPromptData
          );
        }
      } catch (error) {
        console.error("Error fetching final prompt:", error);
      }
    }
  };

  return (
    <>
      <div>
        {!mode ? (
          <div className="flex flex-col flex-wrap items-center w-full">
            <h1 className="text-lg text-center">Select a Mode</h1>
            <div className="flex flex-wrap gap-3 mt-4 md:flex-nowrap">
              {/* Example static options for mode selection */}
              <Button
                size="lg"
                className="w-full md:w-auto"
                onClick={() => selectMode("Music")}
              >
                Music1
              </Button>
              <Button
                size="lg"
                className="w-full mode-button md:w-auto"
                onClick={() => selectMode("Design")}
              >
                Design
              </Button>
              <Button
                size="lg"
                className="w-full mode-button md:w-auto"
                onClick={() => selectMode("Film")}
              >
                Film
              </Button>
            </div>
          </div>
        ) : !numQuestions ? (
          <div className="flex flex-col flex-wrap items-center w-full">
            <h1 className="text-lg text-center">Select Number of Questions</h1>
            <div className="flex flex-wrap gap-3 mt-4 md:flex-nowrap">
              {options.map((option, index) => (
                <Button
                  key={index}
                  size="lg"
                  className="w-full md:w-auto"
                  onClick={() => selectNumQuestions(parseInt(option))}
                >
                  {`${option} Questions`}
                </Button>
              ))}
            </div>
          </div>
        ) : finalPrompt ? (
          <CreateImage
            finalPrompt={finalPrompt}
            setImageUrl={setImageUrl}
            imageUrl={imageUrl}
          />
        ) : (
          questions.length > 0 && (
            <div className="flex flex-col flex-wrap items-center w-full max-w-[500px]">
              <h1 className="text-lg text-center">
                {questions[currentQuestionIndex].question}
              </h1>
              <div className="flex flex-wrap gap-3 mt-4 ">
                {questions[currentQuestionIndex].options.map(
                  (option: any, index: number) => (
                    <Button
                      key={index}
                      size="lg"
                      className="w-full lg:w-auto"
                      onClick={() => handleOptionSelect(option)}
                    >
                      {option}
                    </Button>
                  )
                )}
              </div>
            </div>
          )
        )}
      </div>
    </>
  );
}
