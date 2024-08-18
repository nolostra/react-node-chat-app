import express from "express";
import cors from "cors";
import { config } from "dotenv";
import authRoutes from "./routes/auth.js";
import messageRoutes from "./routes/messages.js";
import { Server } from "socket.io";
import http from "http";
import { setOnline } from "./controllers/userController.js";

config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/ping", (_req, res) => {
  return res.json({ msg: "Ping Successful" });
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    console.log("send-msg", data);
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });

  socket.on("user-status", (data) => {
    setOnline(data.id);
  })
  socket.on("typing-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    console.log("typing-msg", data, sendUserSocket)
   if (sendUserSocket) {
    socket.to(sendUserSocket).emit("send-typing", data);
  }
  })
});

server.listen(process.env.PORT, () => {
  console.log(`Server started on ${process.env.PORT}`);
});