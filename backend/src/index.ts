import { Prisma, PrismaClient } from "@prisma/client";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express";
export const client = new PrismaClient();
import authRoutes from "./routes/auth.route";
import postRoutes from "./routes/post.route"
import fileRoutes from "./routes/file.route"

const port = process.env.PORT;
const app = express();

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

app.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
});
