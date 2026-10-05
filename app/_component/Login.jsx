"use client";
import * as React from "react";
import { ImSpinner2 } from "react-icons/im";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";

export function Login() {
  const [payload, setPayload] = React.useState({
    email: "",
    password: "",
  });
  const router = useRouter()
  const [loading, setLoading] = React.useState(false);
  const register = (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      axios({
        url: "/api/login",
        method: "POST",
        data: payload,
      })
        .then((res) => {
          setLoading(false);
          toast.error("Successfully logged in",{classNames:{
            content:" text-green-500 ",
            icon:" text-green-500 ",
            cancelButton:" hover:text-white "
          }});
          router.push("/dashboard")
          localStorage.setItem("token",res.data.token)
        })
        .catch((error) => {
          toast.error(error?.response?.data?.message,{closeButton:true, classNames:{
            content:" text-red-500 ",
            icon:" text-red-500 ",
            cancelButton:" hover:text-white ",
            toast:" bg-red-500 "
          }});

          setLoading(false);
        });
    } catch (error) {
      toast.error(error?.response?.data?.message);
      setLoading(false);
    }
  };
  return (
    <Card className="w-[350px]">
      <CardContent>
        <div>
          <Image
            src={"/image/Login.png"}
            height={400}
            width={400}
            className=" size-[200px] mx-auto "
          />
        </div>
        <form onSubmit={register}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Email</Label>
              <Input
                value={payload.email}
                onChange={(e) => {
                  setPayload({ ...payload, email: e.target.value });
                }}
                id="email"
                type="email"
                placeholder="Name of your project"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Password</Label>
              <Input
                value={payload.password}
                onChange={(e) => {
                  setPayload({ ...payload, password: e.target.value });
                }}
                id="password"
                type={"password"}
                placeholder="Name of your project"
              />
            </div>
          </div>
          <Button disabled={loading} type="submit" className={" cursor-pointer px-4 mt-4 w-full flex items-center justify-center "}>
            Login {loading&&<ImSpinner2 className=" spin mt-1 text-white  " />}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
