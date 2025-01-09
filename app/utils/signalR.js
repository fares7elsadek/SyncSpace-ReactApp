import * as signalR from "@microsoft/signalr";

export const connectToSignalR = async (url, roomId, connectionId) => {
  const connection = new signalR.HubConnectionBuilder()
    .withUrl(url, { accessTokenFactory: () => localStorage.getItem("token") })
    .withAutomaticReconnect()
    .build();

  connection.on("UserJoined", (message) => {
    console.log("User Joined:", message);
  });

  connection.on("StreamStarted", (videoUrl) => {
    console.log("Stream Started:", videoUrl);
  });

  try {
    await connection.start();
    console.log("SignalR Connected");
    await connection.invoke("JoinGroup", roomId, connectionId);
  } catch (err) {
    console.error("SignalR Connection Failed:", err);
  }

  return connection;
};
