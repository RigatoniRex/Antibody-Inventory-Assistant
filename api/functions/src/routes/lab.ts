import * as express from 'express';

const LabRouter = express.Router();

//TODO: add lab
LabRouter.post('/', (req, resp) => {
    resp.status(200).send('Test, no action taken - POST lab');
});

//TODO: delete lab
LabRouter.delete('/', (req, resp) => {
    resp.status(200).send('Test, no action taken - POST lab');
});

//TODO: edit labname
LabRouter.put('/', (req, resp) => {
    resp.status(200).send('Test, no action taken - PUT lab');
});

export default LabRouter;
