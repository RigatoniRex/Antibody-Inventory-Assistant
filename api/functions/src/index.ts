import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import express from 'express';
import cookieParser from 'cookie-parser';
import { type Express } from 'express';
import AntibodyRouter from './routes/antibody';
import LabRouter from './routes/lab';

export const app: Express = express();

admin.initializeApp(functions.config().firebase);
app.use(cookieParser());
app.use('/antibody', AntibodyRouter);
app.use('/lab', LabRouter);

export const api = functions.https.onRequest(app);
