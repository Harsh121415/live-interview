"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Copy, Clock, ListOrdered, Calendar } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function InterviewSuccess({ interview }) {
  if (!interview || !interview.id) {
    return <div>Loading...</div>;
  }

  // Construct the public URL
  const publicUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/interview/${interview.id}`
      : `/interview/${interview.id}`;

  // WhatsApp and Email share links
  const whatsappLink = `https://wa.me/?text=${encodeURIComponent(
    `Check out this interview: ${publicUrl}`
  )}`;
  const emailLink = `mailto:?subject=Interview Link&body=${encodeURIComponent(
    `Check out this interview: ${publicUrl}`
  )}`;

  // Copy to clipboard functionality
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto p-6 space-y-6 text-center">
      <div className="flex justify-center">
        <CheckCircle2 className="h-12 w-12 text-green-500" />
      </div>
      <h2 className="text-xl font-semibold">Your AI Interview is Ready!</h2>
      <p className="text-gray-500">
        Share this link with your candidates to start the interview process
      </p>

      {/* Link Box */}
      <div className="border rounded-xl p-4 space-y-3 text-left bg-gray-50">
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium">Interview Link</p>
          <span className="text-xs text-gray-500">Valid for 30 days</span>
        </div>

        <div className="flex items-center gap-2">
          <Input readOnly value={publicUrl} className="flex-1 text-sm" />
          <Button onClick={handleCopy} size="sm">
            <Copy className="w-4 h-4 mr-1" />
            {copied ? "Copied!" : "Copy Link"}
          </Button>
        </div>

        <div className="flex gap-4 text-sm text-gray-600 pt-2 border-t mt-2">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {interview.duration || "-"} Minutes
          </div>
          <div className="flex items-center gap-1">
            <ListOrdered className="w-4 h-4" />
            {interview.questions ? interview.questions.length : "-"} Questions
          </div>
          {/* You can add expiry date logic if available in interview */}
        </div>
      </div>

      {/* Share Options */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-left">Share via</p>
        <div className="flex gap-4 justify-center">
          <a href={emailLink} target="_blank" rel="noopener noreferrer">
            <Button variant="outline">📧 Email</Button>
          </a>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
            <Button variant="outline">🟢 WhatsApp</Button>
          </a>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-between pt-4 border-t">
        <Link href={"/dashboard"}><Button variant="outline">← Back to Dashboard</Button></Link>
        <Link href={"/create-interview"}>  <Button>Create New Interview</Button></Link>
      
      </div>
    </div>
  );
}
