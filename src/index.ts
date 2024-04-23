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
  postsRouter,
  thirdPartyRouter,
  socialAuthRouter,
  adminAuthRouter,
  adminRouter,
  cmsRouter
} from "./routes";
import swaggerSpec from "./docs";
import passport from "passport";
import session from 'express-session'
import { constructResponse } from "./services";
import { AppConfig } from "./utilities/config";
import { default as pkg } from "../package.json"

dotenv.config();

const app: Express = express();
// Connect to MongoDB
connectDB();

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",");
const port = process.env.PORT || 3001;
// Parse JSON request body
app.use(json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(cookieParser())

app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: `${process.env.SESSION_SECRET}`,
  // store: MongoStore.create({
  //     mongoUrl: process.env.MONGODB_URI,
  //     ttl: 12 * 60 * 60,
  // })
}))



app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.setHeader('X-Powered-By', 'TheGridManagement');
  next();
});

// app.use((err, req, res,) => {
//   console.error(`Error in file ${__filename}: ${err.message}`);
//   next()
// });

// Define authentication routes
app.use('/api/v1/auth', authRouter);

// Define admin authentication routes
app.use('/api/v1/admin/auth', adminAuthRouter);

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

// Define Admin routes
app.use('/api/v1/admin', adminRouter);

// Define CMS routes
app.use('/api/v1/cms', cmsRouter);

// Define thirdParty routes
app.use('/api/v1', thirdPartyRouter);




// Define thirdparty routes
app.use('/api/v1/socialauth', socialAuthRouter);

// Swagger Docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (_, res) => constructResponse({
  res,
  code: 200,
  message: 'Welcome to Nodes API',
  apiObject: AppConfig.API_OBJECTS.Base,
  data: {
    version: pkg.version,
    environment:process.env.NODE_ENV
  }

}));


app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});