"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Users,
  Upload,
  Mail,
  Plus,
  Trash2,
  UserPlus,
  FileText,
  Send,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import Link from "next/link";
import { useUserStore } from "@/context/useUser";
import Loader from "@/components/myComponents/Loader";
import { fetchUserProfile } from "@/lib/utils";

export default function CandidatesPage({ params }) {
  const { interviewId } = params;
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(null);
  const { user, setUser } = useUserStore((state) => state);
  const [showAddForm, setShowAddForm] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [newCandidate, setNewCandidate] = useState({
    name: "",
    email: "",
    profile: "",
  });

  useEffect(() => {
    fetchUserProfile(setUser, setLoading).catch((error) => {
      console.error("Error fetching user profile:", error);
      toast.error("Failed to load user profile");
    });
  }, []);

  useEffect(() => {
    if (user?.id) {
      fetchCandidates();
    }
  }, [user?.id, interviewId]);

  const fetchCandidates = async () => {
    try {
      const response = await axios.get(`/api/candidates`);
      setCandidates(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      toast.error("Failed to fetch candidates");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCandidate = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/candidates", {
        ...newCandidate,
        interviewId,
      });
      toast.success("Candidate added successfully");
      setNewCandidate({ name: "", email: "", profile: "" });
      setShowAddForm(false);
      fetchCandidates();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add candidate");
    }
  };

  const handleCsvUpload = async (e) => {
    e.preventDefault();
    if (!csvFile) {
      toast.error("Please select a CSV file");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", csvFile);
    formData.append("interviewId", interviewId);

    try {
      await axios.post("/api/candidates/import", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Candidates imported successfully");
      setCsvFile(null);
      fetchCandidates();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to import candidates");
    } finally {
      setUploading(false);
    }
  };

  const handleSendInterviewLink = async (candidateId, candidateEmail) => {
    setSending(candidateId);
    try {
      await axios.post("/api/candidates/send-link", {
        candidateId,
        interviewId,
        email: candidateEmail,
      });
      toast.success("Interview link sent successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send link");
    } finally {
      setSending(null);
    }
  };

  const handleDeleteCandidate = async (candidateId) => {
    try {
      await axios.delete(`/api/candidates/${candidateId}`);
      toast.success("Candidate deleted successfully");
      fetchCandidates();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete candidate");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Candidate Management</h1>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              className="gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Add Candidate
            </Button>
          </div>
        </div>

        {/* Add Candidate Form */}
        {showAddForm && (
          <Card>
            <CardHeader>
              <CardTitle>Add New Candidate</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddCandidate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={newCandidate.name}
                      onChange={(e) =>
                        setNewCandidate({ ...newCandidate, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newCandidate.email}
                      onChange={(e) =>
                        setNewCandidate({ ...newCandidate, email: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="profile">Profile/Resume Link (Optional)</Label>
                  <Input
                    id="profile"
                    value={newCandidate.profile}
                    onChange={(e) =>
                      setNewCandidate({ ...newCandidate, profile: e.target.value })
                    }
                    placeholder="https://linkedin.com/in/username or resume URL"
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Add Candidate</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* CSV Import */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Import Candidates from CSV
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCsvUpload} className="space-y-4">
              <div>
                <Label htmlFor="csvFile">CSV File</Label>
                <Input
                  id="csvFile"
                  type="file"
                  accept=".csv"
                  onChange={(e) => setCsvFile(e.target.files[0])}
                  required
                />
                <p className="text-sm text-muted-foreground mt-1">
                  CSV should have columns: name, email, profile (optional)
                </p>
              </div>
              <Button type="submit" disabled={uploading} className="gap-2">
                {uploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                Import Candidates
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Candidates List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Candidates ({candidates.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {candidates.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No candidates added yet. Add candidates manually or import from CSV.
              </div>
            ) : (
              <div className="space-y-4">
                {candidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium">{candidate.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {candidate.email}
                      </p>
                      {candidate.profile && (
                        <a
                          href={candidate.profile}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          View Profile
                        </a>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() =>
                          handleSendInterviewLink(candidate.id, candidate.email)
                        }
                        disabled={sending === candidate.id}
                        className="gap-2"
                      >
                        {sending === candidate.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                        Send Link
                      </Button>
                      <Link href={`/attempts/${candidate.id}?interviewId=${interviewId}`}>
                        <Button variant="secondary" size="sm" className="gap-2">
                          <FileText className="w-4 h-4" />
                          View Attempt
                        </Button>
                      </Link>
                      <Button
                        onClick={() => handleDeleteCandidate(candidate.id)}
                        variant="destructive"
                        size="sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
