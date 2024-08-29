"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
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
const port = process.env.PORT;
const app = (0, express_1.default)();
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
app.listen(port, () => {
    console.log(`server running at http://localhost:${port}`);
});
