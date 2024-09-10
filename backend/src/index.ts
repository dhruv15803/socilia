import { Prisma, PrismaClient } from "@prisma/client";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express";
export const client = new PrismaClient();
import authRoutes from "./routes/auth.route";
import postRoutes from "./routes/post.route"
import fileRoutes from "./routes/file.route"
import userRoutes from "./routes/user.route";
import commentRoutes from "./routes/comment.route";
import messageRoutes from "./routes/message.route";
import { Server, Socket } from "socket.io";
import http from "http"


const port = process.env.PORT;
const app = express();
const server = http.createServer(app);

export const io = new Server(server , {
  cors:{
    origin:process.env.CLIENT_URL,
    credentials:true,
  }
});

//  middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.get("/test", (req: Request, res: Response) => {
  res.json({ success: true, message: "Hello world" });
});

app.use("/api/auth", authRoutes);
app.use("/api/post",postRoutes);
app.use("/api/file",fileRoutes);
app.use("/api/user",userRoutes);
app.use("/api/comment",commentRoutes);
app.use("/api/message",messageRoutes);

// io stuff here 

const userSocketMap = new Map<string,string>();

export const getSocketId = (userId:string) => {
  return userSocketMap.get(userId);
}

io.on("connection" , (socket) => {
  console.log(`User connected with id ${socket.id}`);
  const userId = socket.handshake.query.userId as string;
  if(userId!=undefined) {
    userSocketMap.set(userId , socket.id);
  }
  console.log(userSocketMap);
  console.log(Array.from(userSocketMap.keys()));
  io.emit("getOnlineUsers",Array.from(userSocketMap.keys()));
  socket.on("disconnect",() => {
    console.log('user disconnected with id ' , socket.id);
    userSocketMap.delete(userId);
    io.emit("getOnlineUsers",Array.from(userSocketMap.keys()));
  });
})

server.listen(port,() => {
  console.log(`server running at http://localhost:${port}`);
});
