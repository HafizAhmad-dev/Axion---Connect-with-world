import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import express, { Request, Response, Application } from 'express';
import cors from 'cors';
import conversationRouter from './src/routes/conversation.routes.js';
import messagesRouter from './src/routes/messages.routes.js';
import usersRouter from './src/routes/users.routes.js'
import authRouter from './src/routes/auth.routes.js'
import requestsRouter from './src/routes/requests.route.js'
import highlightsRouter from './src/routes/highlights.routes.js'
import { authMiddleware } from "./src/middlewares/auth.middleware.js";
import friendsRouter from "./src/routes/friends.routes.js";
import pool from "./database/db.conn.js";  // ← Add this import
import http from 'http';
import { Server as SocketServer } from 'socket.io';
import { initializeSocket } from "./src/socket/socket.js";

const app: Application = express();
const server = http.createServer(app);
initializeSocket(server)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Base URL
const baseURL = '/api/v1';

// CORS configuration
const allowedOrigins = ['http://localhost:5173', 'http://192.168.38:5173'];

app.use((req, res, next) => {
  const origin = req.headers.origin as string;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT,PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});


// Routes
app.use(`${baseURL}/conversations`, conversationRouter);
app.use(`${baseURL}/messages`, messagesRouter);
app.use(`${baseURL}/users`, usersRouter);
app.use(`${baseURL}/auth`, authRouter);
app.use(`${baseURL}/requests`, authMiddleware, requestsRouter);
app.use(`${baseURL}/friends`, authMiddleware, friendsRouter);
app.use(`${baseURL}/highlights`, authMiddleware, highlightsRouter);

// Health check endpoint
app.get('/health', async (req: Request, res: Response) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {
      server: 'running',
      database: 'unknown'
    }
  };

  try {
    await pool.query('SELECT 1');
    health.services.database = 'connected';
  } catch (error) {
    health.services.database = 'disconnected';
    health.status = 'degraded';
  }

  if (health.services.database !== 'connected') {
    return res.status(503).json(health);
  }

  res.status(200).json(health);
});

// Simple me endpoint
app.get(`${baseURL}/me`, authMiddleware, (req: Request, res: Response) => {
  res.json({ msg: 'Hello', user: (req as any).user });
});

// 404 handler - must be LAST
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Resource not found', path: req.originalUrl });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});

export default app;
