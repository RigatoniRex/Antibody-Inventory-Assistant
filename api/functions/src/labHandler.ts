import { firestore } from 'firebase-admin';
import {
    antibodiesCollection,
    labsCollection,
    sessionsCollection
} from '../config/database';
import Crypto from './auth';
import { db } from './index';

export class LabHandler {
    private _exists: boolean = false;
    public get exists(): boolean {
        return this._exists;
    }

    private _lab: string = '';
    public get lab() {
        return this._lab;
    }

    private _labRef: firestore.DocumentReference | null = null;
    public get labRef(): firestore.DocumentReference {
        if (this._labRef) return this._labRef;
        else throw new Error('Lab Reference not set');
    }
    private _antibodyCollectionRef: firestore.CollectionReference | null = null;
    public get antibodyCollectionRef(): firestore.CollectionReference {
        if (this._antibodyCollectionRef) return this._antibodyCollectionRef;
        else throw new Error('Antibody Reference not set');
    }
    private _sessionCollectionRef: firestore.CollectionReference | null = null;
    public get sessionCollectionRef(): firestore.CollectionReference {
        if (this._sessionCollectionRef) return this._sessionCollectionRef;
        else throw new Error('Session Reference not set');
    }

    public constructor(labName: string);
    public constructor(labName: string, labRef: firestore.DocumentReference);
    public constructor(labName: string, labRef?: firestore.DocumentReference) {
        this._lab = labName;
        if (labRef) {
            this._labRef = labRef ?? null;
        }
    }
    public async setReferences() {
        await this.setLabReference();
        this.setAntibodiesReference();
        this.setSessionReference();
    }
    public static async addLab(
        labName: string,
        password: string
    ): Promise<LabHandler> {
        const check = await LabHandler.checkExists(labName);
        if (check.exists) {
            throw new Error('Lab Exists');
        }
        const labRef = await db.collection(labsCollection).add({
            name: labName,
            password: Crypto.createHash(password)
        });
        return new LabHandler(labName, labRef);
    }
    public static async checkExists(labName: string): Promise<{
        exists: boolean;
        snapshot: firestore.QuerySnapshot<firestore.DocumentData>;
    }> {
        const snapshot = await LabHandler.getLabSnapshot(labName);
        return {
            exists: snapshot.docs.length === 1,
            snapshot: snapshot
        };
    }
    public static async getLabSnapshot(
        labName: string
    ): Promise<firestore.QuerySnapshot<firestore.DocumentData>> {
        const query = db
            .collection(labsCollection)
            .where('name', '==', labName);
        return await query.get();
    }
    public async changeLabName(newLabName: String) {
        if (this.exists) {
            this.labRef.update({
                name: newLabName
            });
        } else {
            throw new Error('Lab does not exist');
        }
    }
    public async changePassword(newPassword: string) {
        if (this.exists) {
            this.labRef.update({
                password: Crypto.createHash(newPassword)
            });
        } else {
            throw new Error('Lab does not exist');
        }
    }
    private async setLabReference() {
        if (this._labRef) {
            const validLabRef = await this.verifyLabReference();
            this._exists = validLabRef;
            if (validLabRef) return;
        }
        const check = await LabHandler.checkExists(this.lab);
        this._exists = check.exists;
        if (check.exists) {
            this._labRef = check.snapshot.docs[0].ref;
        }
    }
    private async verifyLabReference(): Promise<boolean> {
        const labSnapshot = await this.labRef.get();
        const exists = labSnapshot.exists;
        let labName = '';
        if (exists) {
            labName = labSnapshot.get('name');
        }
        return exists && labName === this.lab;
    }
    private setAntibodiesReference() {
        if (this.exists) {
            this._antibodyCollectionRef =
                this.labRef.collection(antibodiesCollection);
        } else {
            this._antibodyCollectionRef = null;
        }
    }
    private setSessionReference() {
        if (this.exists) {
            this._sessionCollectionRef =
                this.labRef.collection(sessionsCollection);
        } else {
            this._sessionCollectionRef = null;
        }
    }
    public async checkPassword(password: string) {
        if (this.exists) {
            const labData: firestore.DocumentData = await this.labRef.get();
            const validPassword: string = labData.get('password');
            return validPassword === Crypto.createHash(password);
        }
        return false;
    }

    // authenticate(password: string) {}

    // hashPassword(password: string) {}

    // getHashedPassword(lab: string) {}
}
