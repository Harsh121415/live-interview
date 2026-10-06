"use client";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, ArrowLeft, Clock, Mic, User2, FileAudio, Bot } from "lucide-react";
import Link from "next/link";
import Loader from "@/components/myComponents/Loader";

export default function AttemptDetailsPage({ params }){
  const { candidateId } = params;
  const searchParams = useSearchParams();
  const interviewId = searchParams.get("interviewId");

  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAttempt = async () => {
      if (!candidateId || !interviewId) return;
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`/api/user-attempts?candidateId=${candidateId}&interviewId=${interviewId}`);
        const list = res?.data?.data || [];
        setAttempt(Array.isArray(list) && list.length > 0 ? list[0] : null);
      } catch (e) {
        setError(e?.response?.data?.message || "Failed to load attempt");
      } finally {
        setLoading(false);
      }
    };
    fetchAttempt();
  }, [candidateId, interviewId]);

  const meta = useMemo(() => {
    if (!attempt) return {};
    const response = attempt.response || {};
    return {
      startedAt: response.startedAt || attempt.createdAt,
      endedAt: response.endedAt || attempt.updatedAt,
      status: response.status || attempt.completed ? "ended" : attempt.timeUp ? "time-up" : "in-progress",
      summary: response.summary || attempt.summary,
      transcript: response.transcript || attempt.transcript,
      recordingUrl: response.recordingUrl || response?.artifact?.recordingUrl || response?.artifact?.mono?.combinedUrl,
      assistant: response.assistant,
      cost: response.cost,
      costBreakdown: response.costBreakdown,
      analysis: response.analysis,
      webCallUrl: response.webCallUrl,
    };
  }, [attempt]);

  const parsedTranscript = useMemo(() => {
    const raw = meta?.transcript;
    if (!raw) return null;

    // Try JSON.parse first
    try {
      const data = typeof raw === "string" ? JSON.parse(raw) : raw;
      if (Array.isArray(data)) {
        // Expecting items like { role: 'user'|'assistant', content: string }
        return data
          .filter((m) => m && (m.role || m.speaker) && (m.content || m.text))
          .map((m, idx) => ({
            id: `${idx}`,
            role: (m.role || m.speaker || "assistant").toString().toLowerCase(),
            content: m.content ?? m.text ?? "",
          }));
      }
      if (data && typeof data === "object" && Array.isArray(data.messages)) {
        return data.messages.map((m, idx) => ({
          id: `${idx}`,
          role: (m.role || m.speaker || "assistant").toString().toLowerCase(),
          content: m.content ?? m.text ?? "",
        }));
      }
    } catch (_) {
      // not JSON; continue to heuristics
    }

    // Heuristic: lines like "User: ..." and "Assistant: ..."
    if (typeof raw === "string") {
      const lines = raw.split(/\r?\n/).filter(Boolean);
      const messages = [];
      for (const line of lines) {
        const match = line.match(/^(User|You|Candidate|Assistant|AI|System)\s*[:\-]\s*(.*)$/i);
        if (match) {
          const roleRaw = match[1].toLowerCase();
          const content = match[2];
          const role = ["user", "you", "candidate"].includes(roleRaw) ? "user" : (roleRaw === "system" ? "system" : "assistant");
          messages.push({ id: `${messages.length}`, role, content });
        } else if (messages.length > 0) {
          // Continuation of previous message
          messages[messages.length - 1].content += `\n${line}`;
        } else {
          // No role markers; bail out to fallback
          return null;
        }
      }
      if (messages.length > 0) return messages;
    }

    return null;
  }, [meta?.transcript]);

  if (loading) return <Loader />;

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="p-6 space-y-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href={`/candidates/${interviewId}`}>
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Attempt Details</h1>
          </div>
          {meta.status && <Badge variant="secondary">{meta.status}</Badge>}
        </div>

        {error && (
          <Card>
            <CardContent className="p-6 text-red-600">{error}</CardContent>
          </Card>
        )}

        {!attempt ? (
          <Card>
            <CardContent className="p-6">No attempt found for this candidate.</CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User2 className="w-5 h-5" />
                  {attempt?.candidate?.name || "Candidate"} • {attempt?.candidate?.email}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  Interview: {attempt?.interview?.title} ({attempt?.interview?.jobPosition})
                </div>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> Started: {meta.startedAt ? new Date(meta.startedAt).toLocaleString() : "-"}</div>
                  <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> Ended: {meta.endedAt ? new Date(meta.endedAt).toLocaleString() : "-"}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileAudio className="w-5 h-5" /> Recording
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {meta.recordingUrl ? (
                  <audio controls src={meta.recordingUrl} className="w-full" />
                ) : (
                  <div className="text-sm text-muted-foreground">No recording available.</div>
                )}
                {meta.webCallUrl && (
                  <Link href={meta.webCallUrl} target="_blank" className="text-blue-600 text-sm">Open call session</Link>
                )}
              </CardContent>
            </Card>

            {meta.summary && (
              <Card>
                <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap leading-7 text-sm">{meta.summary}</p>
                </CardContent>
              </Card>
            )}

            {meta.transcript && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mic className="w-5 h-5" /> Transcript
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {parsedTranscript ? (
                    <div className="space-y-4 max-h-[480px] overflow-auto pr-1">
                      {parsedTranscript.map((m) => {
                        const isUser = m.role === "user";
                        const isSystem = m.role === "system";
                        return (
                          <div key={m.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                            {!isUser && (
                              <div className="mr-2 mt-0.5 text-muted-foreground">
                                <Bot className="w-5 h-5" />
                              </div>
                            )}
                            <div
                              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${
                                isSystem
                                  ? "bg-yellow-50 text-yellow-900 border border-yellow-200"
                                  : isUser
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-foreground"
                              }`}
                            >
                              {m.content}
                            </div>
                            {isUser && (
                              <div className="ml-2 mt-0.5 text-muted-foreground">
                                <User2 className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-md overflow-auto max-h-[480px]">{meta.transcript}</pre>
                  )}
                </CardContent>
              </Card>
            )}

            {(meta.cost || meta.costBreakdown) && (
              <Card>
                <CardHeader><CardTitle>Cost</CardTitle></CardHeader>
                <CardContent className="text-sm space-y-2">
                  {typeof meta.cost === "number" && <div>Total: ${meta.cost.toFixed(4)}</div>}
                  
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  );
}


