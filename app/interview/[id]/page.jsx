"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Calendar, Video, Info } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useInterview } from "@/context/useInterview";
import { toast } from "sonner";

export default function InterviewJoin() {
  const [interview, setInterview] = useState();

  const { id } = useParams();
  const setNameFun = useInterview((state) => state.setNameFun);

  const [name, setName] = useState("");
  const [showTestModal, setShowTestModal] = useState(false);
  const [mediaError, setMediaError] = useState("");
  const videoRef = useRef(null);
  const [micActive, setMicActive] = useState(false);

  const router = useRouter();
  const getAllInterviews = () => {
    try {
      axios({
        method: "GET",
        url: `/api/interview/${id}`,
      }).then((resp) => {
        setInterview(resp.data?.data);
      });
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    id && getAllInterviews();
  }, [id]);

  // Start webcam and mic when modal opens
  useEffect(() => {
    let stream;
    if (showTestModal) {
      setMediaError("");
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setMicActive(true);
        })
        .catch((err) => {
          setMediaError(err.message || "Could not access media devices");
          setMicActive(false);
        });
    }
    // Cleanup
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      setMicActive(false);
    };
  }, [showTestModal]);

  return (
    <div className="max-w-md mx-auto p-6 space-y-6 bg-white shadow-lg rounded-2xl text-center">
      {/* Logo */}
      <h1 className="text-2xl font-bold text-blue-600">Alcruiter</h1>
      <p className="text-sm text-gray-500">AI-Powered Interview Platform</p>

      {/* Image */}
      <div className="flex justify-center">
        <Image
          src="/image/interview-illustration.png" // Replace with your actual path
          alt="Interview Illustration"
          width={240}
          height={240}
        />
      </div>

      {/* Interview Info */}
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">
          {interview?.jobPosition} Interview
        </h2>
        <div className="flex justify-center gap-4 text-gray-500 text-sm">
          {/* <span>🏢 Google Inc.</span> */}
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {interview?.duration} Minutes
          </span>
        </div>
      </div>
      <input
        value={name}
        placeholder="e.g., John Smith"
        className=" px-2 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] w-full rounded-md border outline-none min-h-[40px] "
        type="text"
        onChange={(e) => {
          setName(e.target.value);
        }}
      />

      {/* Notes */}
      <Card className="bg-blue-50 p-4 text-left space-y-2">
        <div className="flex items-center gap-2 font-medium text-blue-600">
          <Info className="w-4 h-4" />
          Before you begin
        </div>
        <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
          <li>Ensure you have a stable internet connection</li>
          <li>Test your camera and microphone</li>
          <li>Find a quiet place for the interview</li>
        </ul>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-2">
        <Button
          onClick={() => {
            if (!interview) toast.warning("please wait we are loading");
            if (name?.length > 0) {
              setNameFun({ name: name });
              router.push(`/interview/room/${interview?.id}`);
            }
          }}
          className="w-full cursor-pointer"
        >
          <Video className="w-4 h-4 mr-2" />
          Join Interview
        </Button>
        <Button
          variant="outline"
          className="w-full text-sm cursor-pointer "
          onClick={() => setShowTestModal(true)}
        >
          Test Audio & Video
        </Button>
      </div>
      {/* Modal for Test Audio & Video */}
      {showTestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowTestModal(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h3 className="text-lg font-semibold mb-2">Test Audio & Video</h3>
            {mediaError ? (
              <div className="text-red-600 text-sm mb-2">{mediaError}</div>
            ) : (
              <>
                <div className="mb-4">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-48 bg-black rounded-md"
                  />
                </div>
                <div className="mb-2 flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${micActive ? "bg-green-500" : "bg-red-500"}`}></span>
                  <span className="text-sm">{micActive ? "Microphone active" : "Microphone not detected"}</span>
                </div>
              </>
            )}
            <Button className="w-full mt-4" onClick={() => setShowTestModal(false)}>
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
