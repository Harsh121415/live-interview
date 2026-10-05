"use client";
import { Mic, PhoneOff } from "lucide-react";
import Vapi from "@vapi-ai/web";
import { useEffect, useState } from "react";
import Alert from "./Alert";
export default function Interview() {
  const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY);
  const [userName, setUserName] = useState("John Doe");
  const [jobPosition, setJobPosition] = useState("React Developer");
  const [questionList, setQuestionList] = useState([
    "What is React?",
    "Explain the Virtual DOM.",
    "How do you manage state in React?",
    "What are React hooks?",
    "Explain the concept of lifting state up.",
  ]);
  const [openModal, setOpenModal] = useState(false);
  useEffect(() => {
    questionList && startCall();
  }, []);

  const startCall = () => {
    let interviewQuestion="";
    questionList.forEach((question, index) => {
      interviewQuestion = question + ", " + interviewQuestion;
    });
    const assistantOptions = {
      name: "AI Recruiter",
      firstMessage:
        "Hi " +
        userName +
        " , how are you? Ready for your interview on " +
        jobPosition +
        "?",
      transcriber: {
        provider: "deepgram",
        model: "nova-3",
        language: "en-US",
      },
      voice: {
        provider: "vapi",
        voiceId: "Elliot",
        
      },
      model: {
        provider: "openai",
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              `You are an AI voice assistant conducting interviews.
    Your job is to ask candidates provided interview questions, assess their responses.
    Begin the conversation with a friendly introduction, setting a relaxed yet professional tone. Example:
    "Hey there! Welcome to your ` +
              jobPosition +
              ` interview. Let’s get started with a few questions!"
     Ask one question at a time and wait for the candidate’s response before proceeding. Keep the questions clear and concise. Below Are the questions ask one by one:
    Questions: ` +
              interviewQuestion +
              `If the candidate struggles, offer hints or rephrase the question without giving away the answer. Example:
    "Need a hint? Think about how React tracks component updates!" Provide brief, encouraging feedback after each answer. Example: "Nice! That’s a solid answer."
    "Hmm, not quite! Want to try again?"Keep the conversation natural and engaging—use casual phrases like "Alright, next up..." or "Let’s tackle a tricky one!"
    After 5-7 questions, wrap up the interview smoothly by summarizing their performance. Example:
    "That was great! You handled some tough questions well. Keep sharpening your skills!"
    End on a positive note:
    "Thanks for chatting! Hope to see you crushing projects soon!"
    Key Guidelines:
    ✅ Be friendly, engaging, and witty ✍️
    ✅ Keep responses short and natural, like a real conversation
    ✅ Adapt based on the candidate’s confidence level
    ✅ Ensure the interview remains focused on React
            `.trim(),
          },
        ],
      },
    };

    vapi.start(assistantOptions);
  };

  const handleEndCall = () => {
    //console.log('vapi: ', vapi);
    setOpenModal(true);
    vapi.stop();
  };
  return (
    <div className="bg-white text-white flex flex-col  justify-center items-center ">
      {/* Header */}
      <div className="flex justify-between items-center p-4">
        <h2 className="text-lg font-semibold text-primary">
          AI Interview Session
        </h2>
        <div className="text-sm font-mono text-primary">⏱ 00:05:23</div>
      </div>

      {/* Video Section */}
      <div className="flex-1 flex justify-center items-center gap-6 px-4 ">
        {/* AI Interviewer */}
        <div className=" flex-col border shadow  h-[300px] flex items-center justify-center w-[400px] rounded-md ">
          <div className=" size-10 flex justify-center items-center bg-primary text-white uppercase rounded-full">
            <p className=" text-xl">AI</p>
          </div>
          <span className="mt-2 text-sm text-primary">You</span>
        </div>

        {/* You */}
        <div className=" flex-col border shadow  h-[300px] flex items-center justify-center w-[400px] rounded-md ">
          <div className=" size-10 flex justify-center items-center bg-primary text-white uppercase rounded-full">
            <p className=" text-xl">P</p>
          </div>
          <span className="mt-2 text-sm text-primary">You</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col items-center pb-8">
        <div className="flex gap-6 mb-4">
          <button className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600">
            <Mic size={20} />
          </button>
          <Alert handleEndCall={() => handleEndCall()}>
            <button className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center hover:bg-red-700 cursor-pointer">
              <PhoneOff size={20} />
            </button>
          </Alert>

          <button
            onClick={startCall}
            className="w-12 h-12 rounded-full flex items-center justify-center bg-green-500 hover:opacity-50 cursor-pointer "
          >
            <PhoneOff size={20} />
          </button>
        </div>
        <p className="text-sm text-gray-400">Interview in progress...</p>
      </div>
    </div>
  );
}
