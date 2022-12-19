import * as functions from 'firebase-functions';
import * as express from 'express';
import * as admin from 'firebase-admin';
import { type Express } from 'express';

const app: Express = express();

// // Start writing functions
// https://firebase.google.com/docs/functions/typescript

admin.initializeApp(functions.config().firebase);

export const hey = functions.https.onRequest((_, response) => {
    response.send('Hi there');
});

export const api = functions.https.onRequest(app);

const db = admin.firestore();
const labsCollection = 'labs';
const antibodiesCollection = 'antibodies';

//TODO: get all antibodies
app.get('/antibody', async (req, res) => {
    try {
        const userQuerySnapshot = await db
            .collection(labsCollection)
            .doc(req.body.lab)
            .collection(antibodiesCollection)
            .get();
        const antibodies: any[] = [];
        userQuerySnapshot.forEach((antibodyDoc) => {
            antibodies.push({
                id: antibodyDoc.id,
                antibody: antibodyDoc.data()
            });
        });
        res.status(200).json(antibodies);
    } catch (error) {
        res.status(500).send(error);
    }
});

//TODO: add antibody
app.post('/antibody', (req, resp) => {
    resp.status(200).send('Test, no action taken - POST antibody');
});

//TODO: delete antibody
app.delete('/antibody', (req, resp) => {
    resp.status(200).send('Test, no action taken - DELETE antibody');
});

//TODO: edit antibody
app.put('/antibody', (req, resp) => {
    resp.status(200).send('Test, no action taken - PUT antibody');
});

//TODO: add lab
app.post('/lab', (req, resp) => {
    resp.status(200).send('Test, no action taken - POST lab');
});

//TODO: delete lab
app.delete('/lab', (req, resp) => {
    resp.status(200).send('Test, no action taken - POST lab');
});

//TODO: edit labname
app.put('lab', (req, resp) => {
    resp.status(200).send('Test, no action taken - PUT lab');
});
