"use client";
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Center from "../components/Center";
import Link from "next/link";
import Image from "next/image";
import movieImge from "@/public/movie.png";
import { Button } from "@/components/ui/button";
import { useLogin } from "../contexts/LoginProvider";
import { useRouter } from "next/navigation";
import axios from "axios";
import * as signalR from "@microsoft/signalr";

const HomePage = () => {
  const { logedin } = useLogin(); // Check authentication status
  const router = useRouter();
  const [rooms, setRooms] = useState([]); // Store rooms
  const [loading, setLoading] = useState(true); // Manage loading state

  useEffect(() => {
    if (!logedin) {
      router.push("/login");
    } else {
      fetchRooms(); // Fetch the rooms when the user is logged in
    }
  }, [logedin, router]);

  // Fetch rooms from the API
  const fetchRooms = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User is not authenticated");

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API}/Room/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRooms(response.data.result || []);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle room selection
  const handleJoinRoom = async (roomId: string) => {
    try {
      const connection = new signalR.HubConnectionBuilder()
        .withUrl(`${process.env.NEXT_PUBLIC_SIGNALR_URL}/streamingHub`, {
          accessTokenFactory: () => localStorage.getItem("token"),
        })
        .withAutomaticReconnect()
        .build();

      await connection.start();
      await connection.invoke("JoinRoom", roomId);
      
      // Redirect to the room page
      router.push(`/rooms/${roomId}`);
    } catch (error) {
      console.error("Error joining room:", error);
    }
  };

  return (
    <Center className="px-[10vw] w-full min-h-[80vh]">
      <div className="grid grid-cols-12 gap-8">
        {/* Left Section */}
        <div className="col-span-6 text-white flex flex-col gap-6">
          <h1 className="text-4xl font-bold">
            {logedin ? "Welcome Back!" : "Watch And Get New"}
            <br />
            {logedin ? "Enjoy Your Time, " : "Friends With,"}
          </h1>
          <h2 className="textGradient text-4xl text-nowrap w-[50%]">Sync Space</h2>
          <p className="w-[60%]">
            {logedin
              ? "You're now logged in! Start exploring rooms and connect with others."
              : "Make friends while watching! Host or join virtual watch parties, connect with like-minded individuals, and enjoy the shared experience of watching your favorite shows, movies, or sports."}
          </p>

          <div className="flex gap-12 items-center">
            <Button className="BGGradient">
              <Link href={"/createRoom"}>Create Room</Link>
            </Button>

            <Button className="bg-transparent border">
              <Link href={"/joinRoom"}>Join Room</Link>
            </Button>
          </div>
        </div>

        {/* Right Section */}
        <div className="col-span-6">
          {loading ? (
            <p>Loading rooms...</p>
          ) : rooms.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {rooms.map((room) => (
                <div
                  key={room.roomId}
                  className="bg-gray-800 p-4 rounded-lg shadow cursor-pointer"
                  onClick={() => handleJoinRoom(room.roomId)}
                >
                  <h3 className="text-lg font-bold text-white">{room.roomName}</h3>
                  <p className="text-sm text-gray-400">
                    Host: {room.hostUserId} | Participants: {room.roomParticipants.length}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p>No rooms joined yet. Create or join a room to get started!</p>
          )}
        </div>
      </div>
    </Center>
  );
};

export default HomePage;
