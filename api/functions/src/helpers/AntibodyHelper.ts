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
            .where('catalog', '==', antibody.catalog)
            .where('company', '==', antibody.company);
        const results = await query.get();
        return !results.empty;
    }

    async addAntibody(antibodyRequestData: any): Promise<
        | {
              didAdd: true;
              doc: firestore.DocumentData;
              status: 201;
          }
        | {
              didAdd: false;
              reasons: string[];
              status: 400 | 409;
          }
    > {
        const verification = verifyAntibody(antibodyRequestData);
        if (verification.check) {
            const antibody = antibodyRequestData as Antibody;
            const exists = await this.checkExists(antibody);
            if (exists) {
                return {
                    didAdd: false,
                    reasons: ['Conflict, antibody already exists'],
                    status: 409
                };
            } else {
                const docRef = await this.collectionRef.add(antibody);
                return { didAdd: true, doc: docRef, status: 201 };
            }
        } else {
            return {
                didAdd: false,
                reasons: verification.reasons,
                status: 400
            };
        }
    }
}
