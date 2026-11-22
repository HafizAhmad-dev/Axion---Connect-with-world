
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import express, { Request, Response, Application } from "express";
import cors from "cors";
import http from "http";

import conversationRouter from "./src/routes/conversation.routes.js";
import messagesRouter from "./src/routes/messages.routes.js";
import usersRouter from "./src/routes/users.routes.js";
import authRouter from "./src/routes/auth.routes.js";
import requestsRouter from "./src/routes/requests.route.js";
import highlightsRouter from "./src/routes/highlights.routes.js";
import { authMiddleware } from "./src/middlewares/auth.middleware.js";
import imageKitRouter from "./src/routes/imagekit.routes.js";
import friendsRouter from "./src/routes/friends.routes.js";
import profileRouter from "./src/routes/profileUpdate.routes.js";
import pool from "./database/db.conn.js";
import { initializeSocket } from "./src/socket/socket.js";

const app: Application = express();
const server = http.createServer(app);

initializeSocket(server);

const baseURL = "/api/v1";

// CORS configuration
const allowedOrigins = [
  "https://axion-live.netlify.app",
    "http://localhost:5173",
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
].filter((origin): origin is string => Boolean(origin));

const corsOptions: cors.CorsOptions = {
  origin(origin, callback) {
    // Allow requests without Origin (Postman, curl, etc.)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.warn(`Blocked CORS origin: ${origin}`);
    return callback(new Error("Not allowed by CORS"));
  },

  credentials: true,

  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
  ],

  optionsSuccessStatus: 204,
};

// IMPORTANT: CORS must run before routes and body parsers.
app.use(cors(corsOptions));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(`${baseURL}/conversations`, conversationRouter);
app.use(`${baseURL}/messages`, messagesRouter);
app.use(`${baseURL}/users`, usersRouter);
app.use(`${baseURL}/auth`, authRouter);

app.use(`${baseURL}/requests`, authMiddleware, requestsRouter);
app.use(`${baseURL}/friends`, authMiddleware, friendsRouter);
app.use(`${baseURL}/highlights`, authMiddleware, highlightsRouter);
app.use(`${baseURL}/profile`, authMiddleware, profileRouter);
app.use(`${baseURL}/imagekit`, authMiddleware, imageKitRouter);

// Health check
app.get("/health", async (_req: Request, res: Response) => {
  const health = {
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {
      server: "running",
      database: "unknown",
    },
  };

  try {
    await pool.query("SELECT 1");

    health.services.database = "connected";
    res.status(200).json(health);
  } catch (error) {
    console.error("Database health check failed:", error);

    health.services.database = "disconnected";
    health.status = "degraded";

    res.status(503).json(health);
  }
});

// Sentry test endpoint
app.get("/debug-sentry", (_req, _res, next) => {
  next(new Error("My first Sentry error!"));
});

// Me endpoint
app.get(`${baseURL}/me`, authMiddleware, (req: Request, res: Response) => {
  res.json({
    msg: "Hello",
    user: (req as any).user,
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: "Resource not found",
    path: req.originalUrl,
  });
});

// Start server
const PORT = Number(process.env.PORT) || 5000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
