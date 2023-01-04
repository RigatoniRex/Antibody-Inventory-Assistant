import * as crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';
import { firestore } from 'firebase-admin';
import { db } from '.';
import { sessionsCollection } from '../config/database';
import { LabHandler } from './labHandler';

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
    let labHandler: LabHandler | null = null;
    if (req.cookies?.session) {
        labHandler = await CookieHandler.checkSession(req.cookies.session);
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
    } else {
        if (verifyHeader(req, res)) {
            labHandler = await LabHandler.create(req.body.lab as string);
            if (labHandler.exists) {
                if (req.headers.authorization) {
                    const validPassword = await labHandler.checkPassword(
                        req.headers.authorization
                    );
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
                        CookieHandler.createCookie(res, sessionDoc.id, expires);
                        next();
                    }
                } else {
                    res.status(401).json({
                        msg: 'Unauthorized',
                        rsn: 'Password Missing'
                    });
                }
            } else {
                //lab doesn't exist
                res.status(404).json({ msg: 'Lab not found' });
            }
        }
    }
}

export function verifyHeader(req: Request, res: Response): boolean {
    if (!req.body.lab) {
        res.status(400).send({
            msg: 'Bad Request',
            rsn: 'Lab Missing'
        });
        return false; //skip the call to next();
    }
    return true;
}

class CookieHandler {
    public static createCookie(
        res: Response,
        sessionId: string,
        expires: Date
    ) {
        res.cookie('session', sessionId, { expires: expires });
    }
    public static async checkSession(
        sessionId: string
    ): Promise<LabHandler | null> {
        const sessionSnapshot = await db
            .collection(sessionsCollection)
            .doc(sessionId)
            .get();
        const exists: boolean = sessionSnapshot.exists;

        const expiresDt: Date = new Date(sessionSnapshot.get('expires'));
        if (exists && expiresDt > new Date()) {
            const lab = sessionSnapshot.get('lab');
            if (lab) {
                const labHandler = await LabHandler.create(lab);
                if (labHandler.exists) {
                    return labHandler;
                }
            }
        }
        return null;
    }
    public static createExpiresDate(): Date {
        const expires = new Date(); //gets the current date time
        expires.setDate(expires.getDate() + 30); //add 30 days.
        return expires;
    }
    public static async createSession(
        labHandler: LabHandler,
        expires: Date
    ): Promise<firestore.DocumentReference<firestore.DocumentData>> {
        return await db.collection(sessionsCollection).add({
            lab: labHandler.lab,
            expires: expires.toUTCString()
        });
    }
}
