"use client";
import React from "react";
import Image from "next/image";
import signupBG from "@/public/signup.avif";
import Center from "@/app/components/Center";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "react-toastify";

export default function Page() {
  const formSchema = z.object({
    username: z.string().min(1, "Username is required"),
    email: z.string().email("Enter a valid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters and include special characters, uppercase, and lowercase letters"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: any) => {
    console.log(data);

    const dataToBeSent = {
      userName: data.username,
      email: data.email,
      password: data.password,
    };

    await axios
      .post(`${process.env.NEXT_PUBLIC_API}/auth/register`, dataToBeSent)
      .then((response) => {
        toast.success("Account created! Check your email.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      })
      .catch((error) => {
        toast.error("There is a problem now, try again later.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      });
  };

  return (
    <div
      style={{
        backgroundImage: `url(${signupBG.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
        width: "100%",
        position: "relative",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      ></div>

      <Center className="relative z-10 min-h-screen">
        <div className="flex flex-col gap-4 items-center text-white w-[60%]">
          <h1 className="textGradient text-5xl">Sync Space</h1>
          <p className="text-white">Register Now</p>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-lg mx-auto p-8 space-y-4 border rounded-lg shadow"
          >
            {/* Username */}
            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <Input
                type="text"
                {...register("username")}
                placeholder="Enter username"
              />
              {errors?.username?.message && (
                <p className="text-red-500 text-sm">{errors.username.message as string}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                type="email"
                {...register("email")}
                placeholder="Enter email"
              />
              {errors?.email?.message && (
                <p className="text-red-500 text-sm">{errors.email.message as string}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <Input
                type="password"
                {...register("password")}
                placeholder="Enter password"
              />
              {errors?.password?.message && (
                <p className="text-red-500 text-sm">{errors.password.message as string}</p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-around gap-4">
              <Button
                type="submit"
                className="BGGradient opacity-40 hover:opacity-100"
              >
                Register
              </Button>
              <Button
                type="button"
                variant={"outline"}
                className="bg-transparent text-white"
              >
                <Link href={"/login"}>Login</Link>
              </Button>
            </div>
          </form>
        </div>
      </Center>
    </div>
  );
}
