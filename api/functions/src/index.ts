import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import express, {
    NextFunction,
    Request,
    Response,
    type Express
} from 'express';
import cookieParser from 'cookie-parser';
import AntibodyRouter from './routes/antibody';
import LabRouter from './routes/lab';
import { Authenticate } from './auth';
import asyncHandler from 'express-async-handler';
import CookieHandler from './auth/CookieHandler';

export const app: Express = express();

admin.initializeApp();
app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Method', 'GET, HEAD, OPTIONS, POST, PUT');
    res.header('Access-Control-Expose-Headers', 'Set-Cookie');
    res.header(
        'Access-Control-Allow-Headers',
        'content-type, Set-Cookie, Authorization'
    );
    next();
});
app.use(cookieParser());
//Handle preflight request
app.options('*', (_, res: Response) => {
    res.sendStatus(200);
});
app.post('/login', asyncHandler(Authenticate), (_, res: Response) => {
    res.status(200).json('Logged In');
});
app.post('/logout', (_, res: Response) => {
    CookieHandler.createCookie(res, 'session', '', new Date(0));
    res.status(200).json('Logged Out');
});
app.use('/antibody', AntibodyRouter);
app.use('/lab', LabRouter);

export const db = admin.firestore();
export const api = functions.https.onRequest(app);
