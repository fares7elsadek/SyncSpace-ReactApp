"use client";

import Center from "@/app/components/Center";
import { Send } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import * as signalR from "@microsoft/signalr";

const PAGE_API_URL = process.env.NEXT_PUBLIC_API;
const SIGNALR_URL = process.env.NEXT_PUBLIC_SIGNALR_URL;

const ChatPage = () => {
  const { room } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [hubConnection, setHubConnection] = useState<signalR.HubConnection | null>(null);
  const [videoUrl, setVideoUrl] = useState("https://www.youtube.com/embed/xH0ZYQvaswo?enablejsapi=1");
  const [isPlaying, setIsPlaying] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!room) return;
  
    const fetchRoomDetails = async () => {
      try {
        const res = await fetch(`${PAGE_API_URL}/room/${room}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });
  
        if (!res.ok) {
          throw new Error("Failed to fetch room details.");
        }
        const data = await res.json();
        console.log(data.result.videoUrl)
        if (data.result.videoUrl) {
          var videoUrl = data.result.videoUrl
          setVideoUrl(videoUrl.includes("enablejsapi=1") ? videoUrl : `${videoUrl}?enablejsapi=1`);
        } else {
          setVideoUrl(""); // Keep stream empty if no video URL is provided
        }
      } catch (err) {
        console.error("Error fetching room details:", err);
        setVideoUrl(""); // Default to empty stream in case of error
      }
    };
  
    const fetchMessages = async () => {
      try {
        const res = await fetch(`${PAGE_API_URL}/Chat/${room}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });
        const data = await res.json();
        setMessages(data.result || []);
      } catch (err) {
        console.error("Failed to load messages:", err);
      }
    };
  
    fetchRoomDetails(); // Fetch the video URL and other room details
    fetchMessages();
  
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${SIGNALR_URL}/streaminghub`, {
        accessTokenFactory: () => localStorage.getItem("token") || "",
      })
      .configureLogging(signalR.LogLevel.Information)
      .build();
  
    connection.on("ReceiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
  
    connection.on("StreamStarted", (url) => {
      setVideoUrl(url.includes("enablejsapi=1") ? url : `${url}?enablejsapi=1`);
      playVideo();
    });
  
    connection.on("StreamPaused", () => {
      pauseVideo();
    });
  
    connection.on("StreamResumed", () => {
      playVideo();
    });
  
    
  
    connection.on("StreamTimeUpdated", (videoUrl, currentTime) => {
      setVideoUrl(videoUrl.includes("enablejsapi=1") ? videoUrl : `${videoUrl}?enablejsapi=1`);
      
      // Seek to the specified time
      handleSeekTo(currentTime);
    
      // Only play the video if it's not already playing
      if (!isPlaying) {
        playVideo();
      }
    });
  
    connection
      .start()
      .then(() => {
        console.log("Connected to SignalR hub");
        connection.invoke("JoinRoom", room);
      })
      .catch((err) => console.error("SignalR connection error:", err));
  
    setHubConnection(connection);
  
    return () => {
      if (connection) {
        connection.stop();
      }
    };
  }, [room]);
  

  useEffect(() => {
    const interval = setInterval(() => {
      if (hubConnection && iframeRef.current) {
        const iframe = iframeRef.current;
        iframe.contentWindow?.postMessage('{"event":"listening","id":""}', '*');

        const handleMessage = (event: MessageEvent) => {
          if (event.origin !== "https://www.youtube.com") return;

          const data = JSON.parse(event.data);
          if (data.event === "onStateChange") {
            const isPlaying = data.info === 1;
            setIsPlaying(isPlaying);
          } else if (data.event === "onReady") {
            iframe.contentWindow?.postMessage('{"event":"getCurrentTime","id":""}', '*');
          } else if (data.event === "infoDelivery" && data.info && data.info.currentTime) {
            const currentTime = data.info.currentTime;
            hubConnection.invoke("UpdatePlaybackTime", room, currentTime, isPlaying);
          }
        };

        window.addEventListener("message", handleMessage);

        return () => {
          window.removeEventListener("message", handleMessage);
        };
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [hubConnection, room, isPlaying]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const messagePayload = {
      content: newMessage,
      roomId: room,
    };

    try {
      const res = await fetch(`${PAGE_API_URL}/Chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify(messagePayload),
      });

      if (!res.ok) {
        throw new Error("Failed to send message.");
      }

      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handleStartStream = async (url: string) => {
    const apiEnabledUrl = url.includes("enablejsapi=1") ? url : `${url}?enablejsapi=1`;
  
    try {
      const res = await fetch(`${PAGE_API_URL}/rooms/${room}/Stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({ VideoUrl: apiEnabledUrl }),
      });
  
      if (!res.ok) {
        throw new Error("Failed to start stream.");
      }
      setVideoUrl(apiEnabledUrl);
      handlePlayStream();
    } catch (err) {
      console.error("Error starting stream:", err);
    }
  };

  const pauseVideo = () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage(
        JSON.stringify({ event: "command", func: "pauseVideo", args: [] }),
        "*"
      );
      setIsPlaying(false);
    }
  };

  const handleSeekTo = (time: number) => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage(
        JSON.stringify({
          event: "command",
          func: "seekTo",
          args: [time, true], 
        }),
        "*"
      );
    }
  };

  const playVideo = () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage(
        JSON.stringify({ event: "command", func: "playVideo", args: [] }),
        "*"
      );
      setIsPlaying(true);
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      handlePauseStream();
    } else {
      handlePlayStream();
    }
  };

  const handlePauseStream = async () => {
    try {
      await fetch(`${PAGE_API_URL}/rooms/${room}/Stream/pause`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });
      pauseVideo();
    } catch (err) {
      console.error("Error pausing stream:", err);
    }
  };

  const handlePlayStream = async () => {
    try {
      await fetch(`${PAGE_API_URL}/rooms/${room}/Stream/play`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });
      console.log("in the play stream")
      playVideo();
    } catch (err) {
      console.error("Error playing stream:", err);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVideoUrl(e.target.value);
  };

  const handleStartVideo = () => {
    handleStartStream(videoUrl);
  };

  return (
    <Center className="md:h-[85vh] px-4 py-8 flex flex-col md:flex-row items-center gap-4 justify-around" col={false}>
      {/* Video Container */}
      <div className="w-[100%] h-[30vh] md:w-[60%] md:h-full bg-green-700 rounded-lg relative">
            {videoUrl ? (
          <iframe
            ref={iframeRef}
            width="100%"
            height="100%"
            src={videoUrl}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="flex items-center justify-center h-full text-white">
            No video is currently streaming.
          </div>
        )}
        {/* Overlay to prevent interaction */}
        <div className="absolute top-0 left-0 w-full h-full bg-transparent z-10"></div>
        <div className="mt-2">
          <input
            type="text"
            value={videoUrl}
            onChange={handleVideoChange}
            placeholder="Enter YouTube URL"
            className="px-2 py-1 border rounded"
          />
          <button onClick={handleStartVideo} className="ml-2 px-4 py-1 bg-blue-500 text-white rounded">
            Start Stream
          </button>
          <button onClick={togglePlayPause} className="ml-2 px-4 py-1 bg-yellow-500 text-white rounded">
            {isPlaying ? "Pause Video" : "Play Video"}
          </button>
        </div>
      </div>

      {/* Chat Container */}
      <div className="h-[50vh] md:w-[35%] py-2 md:h-full bg-black/50 rounded-lg">
        <div className="w-full px-2 space-y-2 h-[90%] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-300">
          {messages.map((msg) => {
            const src = `${SIGNALR_URL}/favatars/${msg.user.avatar.split("\\").pop()}`;
            return (
              <div key={msg.messageId} className="relative flex items-center gap-2">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    loader={() => src}
                    src={src}
                    alt={`User avatar`}
                    width={120}
                    height={120}
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-white font-semibold">{msg.user.userName}</p>
                  <p className="text-white">{msg.content}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="w-full h-[10%] flex text-white items-center justify-center">
          <input
            type="text"
            className="px-1 bg-transparent border w-[85%] rounded-l-xl outline-none"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <button
            className="border border-gray-600 rounded-r-xl w-[10%] flex justify-center bg-gray-600"
            onClick={handleSendMessage}
          >
            <Send className="w-5" />
          </button>
        </div>
      </div>
    </Center>
  );
};

export default ChatPage;