import { firestore } from 'firebase-admin';
import { Antibody, verifyAntibody } from 'antibody-library/antibody';

export default class AntibodyHelper {
    public readonly collectionRef: firestore.CollectionReference;

    constructor(antibodiesCollection: firestore.CollectionReference) {
        this.collectionRef = antibodiesCollection;
    }

    async checkExists(antibody: Antibody) {
        const query = this.collectionRef
            .where('marker', '==', antibody.marker)
            .where('reactivity', '==', antibody.reactivity)
            .where('color', '==', antibody.color)
            .where('company', '==', antibody.company);
        const results = await query.get();
        return !results.empty;
    }

    async addAntibody(antibodyRequestData: any): Promise<
        | {
              didAdd: true;
              doc: firestore.DocumentData;
          }
        | {
              didAdd: false;
              reasons: string[];
          }
    > {
        const verification = verifyAntibody(antibodyRequestData);
        if (verification.check) {
            const antibody = antibodyRequestData as Antibody;
            const exists = await this.checkExists(antibody);
            if (exists) {
                return { didAdd: false, reasons: ['Antibody already exists'] };
            } else {
                const docRef = await this.collectionRef.add(antibody);
                return { didAdd: true, doc: docRef };
            }
        } else {
            return { didAdd: false, reasons: verification.reasons };
        }
    }
}
