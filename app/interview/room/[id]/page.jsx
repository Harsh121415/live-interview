"use client";
import { Mic, PhoneOff } from "lucide-react";
import Vapi from "@vapi-ai/web";
import { useRef, useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Alert from "@/app/(main)/_component/Alert";
import { useInterview } from "@/context/useInterview";
import Countdown from "react-countdown";
import { toast } from "sonner";

// Add Modal for time up
function TimeUpModal({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white p-8 rounded shadow text-center">
        <h2 className="text-xl font-bold mb-2 text-primary">Time's up!</h2>
        <p className="mb-4 text-gray-700">The interview has ended.</p>
        <button
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80"
          onClick={onClose}
        >
          OK
        </button>
      </div>
    </div>
  );
}

export default function InterviewRoom() {
  const vapiRef = useRef(null);
  const containerRef = useRef(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userName, setUserName] = useState("John Doe");
  const [jobPosition, setJobPosition] = useState("React Developer");
  const [questionList, setQuestionList] = useState();
  const [interviewDetail, setInterviewDetail] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [showTimeUpModal, setShowTimeUpModal] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [userSpeaking, setUserSpeaking] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [candidateId, setCandidateId] = useState(null);
  const [attemptId, setAttemptId] = useState(null);
  const [callId, setCallId] = useState(null);
  const { name } = useInterview((state) => state);
  const { id } = useParams();
  const getAllInterviews = () => {
    try {
      axios({
        method: "GET",
        url: `/api/interview/${id}`,
      }).then((resp) => {
        //console.log("resp: ", resp.data);
        setQuestionList(resp?.data.data?.questions);
        setJobPosition(resp?.data?.data?.jobPosition);
        setInterviewDetail(resp.data?.data);
      });
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const createAttempt = async (data) => {
    if (!candidateId) return;

    try {
      const response = await axios.post('/api/user-attempts', {
        ...data,
        candidateId,
        interviewId: id,
      });
      setAttemptId(response.data.data.id);
    } catch (error) {
      console.error('Error creating attempt:', error);
    }
  };

  const getAttempt = async () => {
    if (!candidateId) return null;
    try {
      const response = await axios.get(`/api/user-attempts?candidateId=${candidateId}&interviewId=${id}`);
      const attempts = response?.data?.data;
      const existingId = Array.isArray(attempts) && attempts.length > 0 ? attempts[0]?.id : null;
      if (existingId) {
        setAttemptId(existingId);
      }
      return existingId || null;
    } catch (error) {
      return null;
    }
  };

  const updateAttempt = async (data) => {
    if (!attemptId) return;

    try {
      await axios.put(`/api/user-attempts/${attemptId}`, data);
    } catch (error) {
      console.error('Error updating attempt:', error);
    }
  };
  useEffect(() => {
    if (!vapiRef.current) {
      vapiRef.current = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY);
    }
    // Add Vapi event listeners for speaking state
    const vapi = vapiRef.current;
    if (vapi) {
      vapi.on("transcription", (data) => {
        // User is speaking when transcription is active
        setUserSpeaking(!!data?.transcript);
      });
      vapi.on("message", (data) => {
        // AI is speaking when message is sent
        setAiSpeaking(true);
        setTimeout(() => setAiSpeaking(false), 2000); // Reset after 2s (approximate)
      });
      vapi.on("end", () => {
        setAiSpeaking(false);
        setUserSpeaking(false);
      });
    }
    return () => {
      if (vapi) {
        // vapi.off("transcription");
        // vapi.off("message");
        // vapi.off("end");
      }
    };
  }, []);
  useEffect(() => {
    // Get candidate ID from URL parameters
    const candidate = searchParams.get('candidate');
    if (candidate) {
      setCandidateId(candidate);
    }

    id && getAllInterviews();
  }, [id, searchParams]);
  useEffect(() => {
    const checkAttemptAndMaybeStart = async () => {
      if (!questionList || !candidateId) return;
      const existing = await getAttempt();
      if (existing) {
        toast.message("Already attempted", { description: "You have already completed this interview." });
        router.push("/dashboard");
        return;
      }
      await startCall();
    };
    checkAttemptAndMaybeStart();
  }, [questionList, candidateId]);

  const startCall = async () => {
    let interviewQuestion = "";
    questionList.forEach((question, index) => {
      interviewQuestion = question + ", " + interviewQuestion;
    });
    const assistantOptions = {
      name: "AI Recruiter",
      firstMessage:
        "Hi " +
        name +
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

    const call = await vapiRef.current?.start(assistantOptions);
    console.log("call: ", call);
    setCallId(call.id);

  };

  const handleEndCall = async () => {
    if (!callId) return;
    // Stop the call immediately
    vapiRef.current?.stop();
    setOpenModal(true);
    setAiSpeaking(false);
    setUserSpeaking(false);

    // Inform user and wait for transcript generation window
    toast.message("Finalizing transcript", { description: "Please wait ~5s while we prepare your transcript." });

    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    // Initial wait to let Vapi finish processing
    await wait(5000);

    // Retry fetching the call details until transcript arrives (max ~10s extra)
    const fetchCallWithRetry = async (retries = 5, delayMs = 2000) => {
      for (let attempt = 0; attempt <= retries; attempt++) {
        try {
          const resp = await axios.get(`https://api.vapi.ai/call/${callId}`, {
            headers: {
              'Authorization': `Bearer ${process.env.NEXT_PRIVATE_VAPI_API_KEY}`,
            }
          });
          const hasTranscript = !!resp?.data?.transcript && resp?.data?.transcript.length > 0;
          if (hasTranscript || attempt === retries) {
            return resp;
          }
        } catch (e) {
          if (attempt === retries) throw e;
        }
        await wait(delayMs);
      }
    };

    let response;
    try {
      response = await fetchCallWithRetry();
    } catch (error) {
      // proceed but warn
      toast.error("Could not fetch final call details. Saving without transcript.");
    }
    console.log("response: ", response);

    await createAttempt({
      completed: true,
      completedAt: new Date().toISOString(),
      response: response?.data ?? {},
      transcript: response?.data?.transcript ?? '',
      callId: callId,
    });
    // Redirect after save
    router.push("/dashboard");
  };

  // Fullscreen logic
  const handleFullScreen = () => {
    if (!isFullScreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen();
      } else if (containerRef.current.msRequestFullscreen) {
        containerRef.current.msRequestFullscreen();
      }
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullScreen(false);
    }
  };

  // Handle time up
  const handleTimeUp = () => {
    setShowTimeUpModal(true);
    vapiRef.current?.stop();
    setAiSpeaking(false);
    setUserSpeaking(false);

    // Update attempt with time up data
    if (attemptId) {
      updateAttempt({
        completed: true,
        completedAt: new Date().toISOString(),
        timeUp: true,
      });
    }

    setTimeout(() => {
      setShowTimeUpModal(false);
      router.push("/dashboard");
    }, 2000);
  };

  return (
    <div
      ref={containerRef}
      className="bg-white text-white flex flex-col justify-center items-center min-h-screen relative"
    >
      {/* Fullscreen Button */}
      <button
        onClick={handleFullScreen}
        className="absolute top-4 right-4 z-20 px-3 py-1 bg-primary text-white rounded shadow hover:bg-primary/80"
      >
        {isFullScreen ? "Exit Full Screen" : "Full Screen"}
      </button>
      {/* Time Up Modal */}
      <TimeUpModal open={showTimeUpModal} onClose={() => router.push("/dashboard")} />
      {/* Header */}
      <div className="flex justify-between items-center p-4 w-full max-w-4xl">
        <h2 className="text-lg font-semibold text-primary">AI Interview Session</h2>
        {interviewDetail && (
          <div className="text-sm font-mono text-primary">
            ⏱
            {
              <Countdown
                onComplete={handleTimeUp}
                key={interviewDetail?.duration}
                date={Date.now() + Number(interviewDetail?.duration) * 1000 * 60}
              />
            }
          </div>
        )}
      </div>

      {/* Video Section */}
      <div className="flex-1 flex justify-center items-center gap-6 px-4 w-full max-w-4xl">
        {/* AI Interviewer */}
        <div
          className={`flex-col border shadow h-[300px] flex items-center justify-center w-[400px] rounded-md transition-all duration-300 ${aiSpeaking ? "ring-4 ring-green-400 scale-105" : ""}`}
        >
          <div className={`size-10 flex justify-center items-center bg-primary text-white uppercase rounded-full ${aiSpeaking ? "animate-pulse" : ""}`}>
            <p className="text-xl">AI</p>
          </div>
          <span className="mt-2 text-sm text-primary">Ai Assistant</span>
          {aiSpeaking && <span className="mt-2 text-xs text-green-500">Speaking...</span>}
        </div>

        {/* You */}
        <div
          className={`flex-col border shadow h-[300px] flex items-center justify-center w-[400px] rounded-md transition-all duration-300 ${userSpeaking ? "ring-4 ring-blue-400 scale-105" : ""}`}
        >
          <div className={`size-10 flex justify-center items-center bg-primary text-white uppercase rounded-full ${userSpeaking ? "animate-pulse" : ""}`}>
            <p className="text-xl">{name?.split("")?.[0]}</p>
          </div>
          <span className="mt-2 text-sm text-primary">You</span>
          {userSpeaking && <span className="mt-2 text-xs text-blue-500">Speaking...</span>}
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col items-center mt-4 pb-8">
        <div className="flex gap-6 mb-4">
          <span className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600">
            <Mic size={20} />
          </span>
          <Alert handleEndCall={() => handleEndCall()}>
            <span className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center hover:bg-red-700 cursor-pointer">
              <PhoneOff size={20} />
            </span>
          </Alert>

          <button
            onClick={async () => {
              await startCall();
            }}
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
