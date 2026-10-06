"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Video,
  PhoneCall,
  Copy,
  Send,
  Facebook,
  Circle,
  Watch,
  Loader2,
  Users,
  DeleteIcon,
  Trash2,
} from "lucide-react";
// import SaveUser from "./_component/SaveUser";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import Link from "next/link";
import { useUserStore } from "@/context/useUser";
import Loader from "@/components/myComponents/Loader";
import { fetchUserProfile } from "@/lib/utils";

export default function Dashboard() {
  const [interviews, setInterviews] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const { user, setUser } = useUserStore((state) => state);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ensure Clerk user is in DB and get their profile
    fetchUserProfile(setUser, setLoading).catch((error) => {
      console.error("Error fetching user profile:", error);
      toast.error("Failed to load user profile");
    });
  }, []);

  const getAllInterviews = () => {
    try {
      axios({
        method: "GET",
        url: "api/interview",
      }).then((resp) => {
        setInterviews(resp.data?.data);
      });
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await axios.delete(`/api/interview/${id}`);
      toast.success("Interview deleted successfully");
      setInterviews((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };
  useEffect(() => {
    getAllInterviews();
  }, []);

  return (
    <div className="bg-gray-50">
      {loading && <Loader />}
      <main className="p-6 space-y-6">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <Video className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="font-semibold">Create New Interview</h3>
                <p className="text-sm text-muted-foreground">
                  Create AI interviews and schedule them with candidates
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <PhoneCall className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="font-semibold">Create Phone Screening Call</h3>
                <p className="text-sm text-muted-foreground">Coming Soon</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <h4 className="text-lg font-semibold mb-4">
            Previously Created Interviews
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {interviews.map((item, index) => (
              <Card key={index} className={" relative "}>
                <CardContent className="p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    {item.icon}
                    <span className="text-xs text-gray-500">{item.date}</span>
                  </div>
                  <h5 className="font-medium">{item?.jobPosition}</h5>
                  <p className="text-sm text-muted-foreground">
                    {item?.duration} Min
                  </p>
                  <div className="flex gap-2 justify-between max-w-full pt-2">
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          window.location.host + "/interview/" + item?.id
                        );
                        toast.success("Link copied successfully");
                      }}
                      variant="outline"
                      size="sm"
                      className="gap-1 cursor-pointer "
                    >
                      <Copy className="w-4 h-4" /> Copy Link
                    </Button>
                    <Link
                      className="cursor-pointer"
                      href={`/interview/${item?.id}`}
                    >
                      <Button size="sm" className="gap-1 cursor-pointer">
                        <Watch className="w-4 h-4" /> Start
                      </Button>
                    </Link>
                    <Link
                      className="cursor-pointer"
                      href={`/candidates/${item?.id}`}
                    >
                      <Button
                        size="sm"
                        variant="secondary"
                        className="gap-1 cursor-pointer"
                      >
                        <Users className="w-4 h-4" /> Candidates
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="gap-1 cursor-pointer absolute right-2 top-2 "
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
                    >
                      {deletingId === item.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <span>
                          <Trash2 />
                        </span>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
