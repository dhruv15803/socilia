"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSocketId = exports.io = exports.client = void 0;
const client_1 = require("@prisma/client");
require("dotenv/config");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
exports.client = new client_1.PrismaClient();
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const post_route_1 = __importDefault(require("./routes/post.route"));
const file_route_1 = __importDefault(require("./routes/file.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const comment_route_1 = __importDefault(require("./routes/comment.route"));
const message_route_1 = __importDefault(require("./routes/message.route"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const port = process.env.PORT;
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
exports.io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true,
    }
});
//  middlewares
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));
app.get("/test", (req, res) => {
    res.json({ success: true, message: "Hello world" });
});
app.use("/api/auth", auth_route_1.default);
app.use("/api/post", post_route_1.default);
app.use("/api/file", file_route_1.default);
app.use("/api/user", user_route_1.default);
app.use("/api/comment", comment_route_1.default);
app.use("/api/message", message_route_1.default);
// io stuff here 
const userSocketMap = new Map();
const getSocketId = (userId) => {
    return userSocketMap.get(userId);
};
exports.getSocketId = getSocketId;
exports.io.on("connection", (socket) => {
    console.log(`User connected with id ${socket.id}`);
    const userId = socket.handshake.query.userId;
    if (userId != undefined) {
        userSocketMap.set(userId, socket.id);
    }
    console.log(userSocketMap);
    console.log(Array.from(userSocketMap.keys()));
    exports.io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
    socket.on("disconnect", () => {
        console.log('user disconnected with id ', socket.id);
        userSocketMap.delete(userId);
        exports.io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
    });
});
server.listen(port, () => {
    console.log(`server running at http://localhost:${port}`);
});
