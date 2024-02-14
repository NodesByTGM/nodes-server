// src/index.js
import cookieParser from "cookie-parser";
import cors from 'cors';
import dotenv from "dotenv";
import express, { Express, json } from "express";
import connectDB from "./mongodb/connect";
import { authRouter, upgradesRouter, userRouter } from "./routes";
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from "./swagger";


dotenv.config();

const app: Express = express();
// Connect to MongoDB
connectDB();

// Parse JSON request body
app.use(json());
app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true
}));
app.use(cookieParser())

const port = process.env.PORT || 3001;

// Define authentication routes
app.use('/api/v1/auth', authRouter);

// Define user routes
app.use('/api/v1/users', userRouter);

// Define upgrade routes
app.use('/api/v1/upgrades', upgradesRouter);

// Swagger Docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => res.status(200).json({ message: 'Welcome to Nodes API' }));


app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});