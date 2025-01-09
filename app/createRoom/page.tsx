"use client";
import React, { useState } from "react";
import Center from "../components/Center";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";

const page = () => {
  const formSchema = z.object({
    roomname: z.string().min(1, "Room name is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      // Get the JWT token from localStorage
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("User is not authenticated");
      }

      // Set the Authorization header with the JWT token
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/room/new`,
        { roomname: data.roomname },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Room created successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // You can redirect to the created room page or home after success
      // router.push(`/room/${response.data.roomId}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create room", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Center className="relative z-10 min-h-[80vh]">
      <div className="flex flex-col gap-4 items-center text-white w-[60%]">
        <h1 className="textGradient text-5xl">Sync Space</h1>
        <p className="text-white">Create Room</p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-xl mx-auto p-8 space-y-4 border rounded-lg shadow w-full"
        >
          {/* Room Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Room Name</label>
            <Input
              type="text"
              {...register("roomname")}
              placeholder="Enter room name"
            />
            {errors?.roomname?.message && (
              <p className="text-red-500 text-sm">{errors.roomname.message}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-around gap-4">
            <Button
              type="submit"
              className="BGGradient opacity-40 hover:opacity-100"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create"}
            </Button>
            <Button type="button" variant={"outline"} className="bg-transparent text-white">
              <Link href={"/joinRoom"}>Join Room</Link>
            </Button>
          </div>
        </form>
      </div>
    </Center>
  );
};

export default page;
