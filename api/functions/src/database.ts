import { firestore } from 'firebase-admin';

export const db = firestore();
export const labsCollection = 'labs';
export const antibodiesCollection = 'antibodies';
