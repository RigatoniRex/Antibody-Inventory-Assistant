import { firestore } from 'firebase-admin';
import { db } from '..';
import { sessionsCollection } from '../../config/database';
import { LabHandler } from '../helpers/LabHandler';
import { Response } from 'express';

export default class CookieHandler {
    public static createCookie(
        res: Response,
        name: string,
        value: string,
        expires: Date
    ) {
        res.cookie(name, value, {
            expires: expires,
            sameSite: 'none',
            secure: true,
            httpOnly: true
        });
    }
    public static async checkSession(
        sessionId: string
    ): Promise<LabHandler | null> {
        const sessionReference = db
            .collection(sessionsCollection)
            .doc(sessionId);
        const sessionSnapshot = await sessionReference.get();
        const exists: boolean = sessionSnapshot.exists;

        const expiresDt: Date = new Date(sessionSnapshot.get('expires'));
        if (exists) {
            if (expiresDt > new Date()) {
                //Not expired
                const lab = sessionSnapshot.get('lab');
                if (lab) {
                    const labHandler = await LabHandler.create(lab);
                    if (labHandler.exists) {
                        return labHandler;
                    }
                }
            } else {
                // expired
                sessionReference.delete();
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
