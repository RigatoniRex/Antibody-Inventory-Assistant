import * as functions from 'firebase-functions';
// import * as express from 'express';
// import { type Express } from 'express';

//const app: Express = express();

// // Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const hey = functions.https.onRequest((_, response) => {
    response.send('Hi there');
});
