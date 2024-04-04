// src/index.js
import cookieParser from "cookie-parser";
import cors from 'cors';
import dotenv from "dotenv";
import express, { Express, json } from "express";
import swaggerUi from 'swagger-ui-express';
import connectDB from "./mongodb/connect";
import {
  authRouter,
  onboardingRouter,
  projectRouter,
  uploadsRouter,
  userRouter,
  eventsRouter,
  jobsRouter,
  transactionsRouter,
  communityRouter,
  spacesRouter,
  postsRouter
} from "./routes";
import swaggerSpec from "./docs";


dotenv.config();

const app: Express = express();
// Connect to MongoDB
connectDB();

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",");
// Parse JSON request body
app.use(json({limit:'10mb'}));
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(cookieParser())

const port = process.env.PORT || 3001;

app.use((req, res, next) => {
  res.setHeader('X-Powered-By', 'TheGridManagement');
  next();
});

// Define authentication routes
app.use('/api/v1/auth', authRouter);

// Define user routes
app.use('/api/v1/users', userRouter);

// Define onboarding routes
app.use('/api/v1/onboarding', onboardingRouter);

// Define upgrade routes
app.use('/api/v1/upgrades', onboardingRouter);

// Define uploads routes
app.use('/api/v1/uploads', uploadsRouter);

// Define projects routes
app.use('/api/v1/projects', projectRouter);

// Define events routes
app.use('/api/v1/events', eventsRouter);

// Define jobs routes
app.use('/api/v1/jobs', jobsRouter);

// Define jobs routes
app.use('/api/v1/transactions', transactionsRouter);

// Define community routes
app.use('/api/v1/community', communityRouter);


// Define spaces routes
app.use('/api/v1/spaces', spacesRouter);


// Define posts routes
app.use('/api/v1/posts', postsRouter);

// Swagger Docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (_, res) => res.status(200).json({ message: 'Welcome to Nodes API' }));


app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});