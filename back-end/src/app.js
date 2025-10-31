import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import adminRoutes from './routes/admin.routes.js';
import { generalLimiter } from './middlewares/rateLimiter.js';
import { errorHandler } from './middlewares/error.middleware.js';

dotenv.config();

const app = express();


app.set("trust proxy", 1);

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(generalLimiter);

app.use('/api/admin', adminRoutes);
app.use(errorHandler);

export default app;
