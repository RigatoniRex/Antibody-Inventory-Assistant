import * as crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';
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
    if (!req.body.password) {
        res.status(401).send({
            msg: 'Unauthorized',
            rsn: 'Password Missing'
        });
        return; //skip the call to next();
    }
    const labHandler = new LabHandler(req.body.lab);
    labHandler.setReferences();
    const validPassword = await labHandler.checkPassword(req.body.password);
    if (!validPassword) {
        res.status(401).send({
            msg: 'Unauthorized',
            rsn: 'Invalid Password'
        });
    } else {
        res.locals.labHandler = labHandler;
        next();
    }
}
