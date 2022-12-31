import { firestore } from 'firebase-admin';
import { db, antibodiesCollection, labsCollection } from './database';

export class LabHandler {
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

    public constructor(lab: string) {
        this._lab = lab;
        this._labRef = this.getLabReference(lab);
        this._antibodyCollectionRef = this.getAntibodiesReference(lab);
    }

    private getLabReference(lab: string): firestore.DocumentReference {
        return db.collection(labsCollection).doc(lab);
    }

    private getAntibodiesReference(lab: string): firestore.CollectionReference {
        return this.getLabReference(lab).collection(antibodiesCollection);
    }

    //TODO: REMOVE THIS AND MODIFY TO HASHING
    async checkPassword(password: string) {
        const labData: firestore.DocumentData = await this.labRef.get();
        const validPassword: string = labData.get('password');
        return validPassword === password;
    }

    // authenticate(password: string) {}

    // hashPassword(password: string) {}

    // getHashedPassword(lab: string) {}
}
