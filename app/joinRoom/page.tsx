"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Correct import for app directory
import Center from "../components/Center";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";
import * as signalR from "@microsoft/signalr";

const JoinRoomPage = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Use next/navigation here

  const formSchema = z.object({
    roomId: z.string().min(1, "Room ID is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const connection = new signalR.HubConnectionBuilder()
        .withUrl(`${process.env.NEXT_PUBLIC_SIGNALR_URL}/streamingHub`, {
          accessTokenFactory: () => localStorage.getItem("token"),
        })
        .withAutomaticReconnect()
        .build();

      await connection.start();
      const connectionId = connection.connectionId;
      console.log("connectionId: ",connectionId)
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User is not authenticated");

      await axios.post(
        `${process.env.NEXT_PUBLIC_API}/room/${data.roomId}/join`,
        { connectionId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Successfully joined the room!");
      router.push(`/rooms/${data.roomId}`);
    } catch (error) {
      toast.error(error.response.data.errors[0] || "Failed to join room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Center className="relative z-10 min-h-[80vh]">
      <div className="flex flex-col gap-4 items-center text-white w-[60%]">
        <h1 className="textGradient text-5xl">Sync Space</h1>
        <p className="text-white">Join Existing Room</p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-xl mx-auto p-8 space-y-4 border rounded-lg shadow w-full"
        >
          <div>
            <label className="block text-sm font-medium mb-2">Room ID</label>
            <Input
              type="text"
              {...register("roomId")}
              placeholder="Enter Room ID"
            />
            {errors?.roomId?.message && (
              <p className="text-red-500 text-sm">{errors.roomId.message}</p>
            )}
          </div>
          <div className="flex justify-around gap-4">
            <Button
              type="submit"
              className="BGGradient opacity-40 hover:opacity-100"
              disabled={loading}
            >
              {loading ? "Joining..." : "Join Now!"}
            </Button>
            <Button
              type="button"
              variant={"outline"}
              className="bg-transparent text-white"
            >
              <Link href={"/createRoom"}>Create Room</Link>
            </Button>
          </div>
        </form>
      </div>
    </Center>
  );
};

export default JoinRoomPage;
