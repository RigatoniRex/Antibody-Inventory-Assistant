import * as crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';
import { LabHandler } from './helpers/LabHandler';
import CookieHandler from './auth/CookieHandler';

export default class Crypto {
    public static createHash(secret: string): string {
        return crypto.createHash('sha256').update(secret).digest('base64');
    }
}

export async function Authenticate(
    req: Request,
    res: Response,
    next: NextFunction
) {
    // Prioritize auth over session cookie
    const passwordHandled =
        req.headers.authorization && (await handlePassword(req, res, next));
    if (!passwordHandled) {
        if (req.cookies?.session) {
            await handleCookie(req, res, next);
        } else {
            res.status(401).json({
                msg: 'Unauthorized',
                rsn: 'Neither Auth nor Session Cookie available'
            });
        }
    }
}

async function handlePassword(req: Request, res: Response, next: NextFunction) {
    if (verifyHeader(req, res)) {
        const labHandler = await LabHandler.create(req.body.lab as string);
        if (labHandler.exists) {
            if (req.headers.authorization) {
                handleAuthorization(
                    req.headers.authorization,
                    labHandler,
                    req,
                    res,
                    next
                );
                return true;
            } else {
                res.status(401).json({
                    msg: 'Unauthorized',
                    rsn: 'Password Missing'
                });
                return false;
            }
        } else {
            //lab doesn't exist
            res.status(404).json({ msg: 'Lab not found' });
            return false;
        }
    } else {
        return false;
    }
}
async function handleCookie(req: Request, res: Response, next: NextFunction) {
    const labHandler = await CookieHandler.checkSession(req.cookies.session);
    if (labHandler) {
        //set labHandler
        res.locals.labHandler = labHandler;
        // Session cookie verified
        next();
    } else {
        res.status(401).json({
            msg: 'Unauthorized',
            rsn: 'Invalid session, likely expired'
        });
    }
}
async function handleAuthorization(
    password: string,
    labHandler: LabHandler,
    req: Request,
    res: Response,
    next: NextFunction
) {
    const validPassword = await labHandler.checkPassword(password);
    if (!validPassword) {
        res.status(401).json({
            msg: 'Unauthorized',
            rsn: 'Invalid Password'
        });
    } else {
        res.locals.labHandler = labHandler;
        //User logged in, create session for them and add cookie to response.
        const expires = CookieHandler.createExpiresDate();
        const sessionDoc = await CookieHandler.createSession(
            labHandler,
            expires
        );
        CookieHandler.createCookie(res, 'session', sessionDoc.id, expires);
        next();
    }
}
export function verifyHeader(req: Request, res: Response): boolean {
    if (!req.body.lab && !req.cookies?.session) {
        res.status(400).send({
            msg: 'Bad Request',
            rsn: 'Lab Missing'
        });
        return false; //skip the call to next();
    }
    return true;
}
