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
import { toast } from "react-toastify";
import { useLogin } from "../contexts/LoginProvider";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { useRouter } from "next/navigation";

// ✅ Form Validation Schema
const formSchema = z.object({
  Email: z.string().email("Enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters with special, capital, and lowercase letters"),
});

export default function LoginPage() {
  const { setLogedin } = useLogin();
  const { setToken } = useAuth(); // For storing JWT token
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: any) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API}/auth/login`, {
        email: data.Email,
        password: data.password,
      });
      
      const  token  = response.data.result.token; // Assuming token is returned from backend

      if (token) {
        setToken(token); // Store token in context or localStorage
        setLogedin(true);
        localStorage.setItem("token", token); // Persist token for future requests

        toast.success("Successfully logged in!", {
          position: "top-right",
          autoClose: 3000,
        });

        router.push("/home"); // Navigate to protected route
      }
    } catch (error: any) {
      console.log(error.message)
      toast.error(
        error.response?.data?.message || "Invalid email or password",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
      setLogedin(false);
    }
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
          <p className="text-white">Login Now</p>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-xl mx-auto p-8 space-y-4 border rounded-lg shadow w-full"
          >
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                type="email"
                {...register("Email")}
                placeholder="Enter Email"
              />
              {errors?.Email?.message && (
                <p className="text-red-500 text-sm">
                  {errors.Email.message as string}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <Input
                type="password"
                {...register("password")}
                placeholder="Enter password"
              />
              {errors?.password?.message && (
                <p className="text-red-500 text-sm">
                  {errors.password.message as string}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-around gap-4">
              <Button
                type="submit"
                className="BGGradient opacity-40 hover:opacity-100"
              >
                Login
              </Button>
              <Button
                type="button"
                variant="outline"
                className="bg-transparent text-white"
              >
                <Link href="/signup">Register</Link>
              </Button>
            </div>
          </form>
        </div>
      </Center>
    </div>
  );
}
