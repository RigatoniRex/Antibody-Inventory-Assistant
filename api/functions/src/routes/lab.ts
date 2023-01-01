import * as express from 'express';
import { Authenticate } from '../auth';
import { LabHandler } from '../labHandler';

const LabRouter = express.Router();

//TODO: add lab
LabRouter.post('/', async (req, res) => {
    try {
        const labHandler = await LabHandler.addLab(
            req.body.lab,
            req.body.password
        );
        res.status(200).send({
            msg: 'Lab added',
            id: labHandler.labRef.id
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

LabRouter.use(Authenticate);
LabRouter.delete('/', async (req, res) => {
    try {
        const labHandler = res.locals.labHandler as LabHandler;
        labHandler.labRef.delete();
        labHandler.setReferences(); //reset references since it no longer exists.
        res.status(200).send({
            msg: 'Lab successfully deleted'
        });
    } catch (error) {
        res.status(500).send(error);
    }
});
LabRouter.put('/', async (req, res) => {
    try {
        const labHandler = res.locals.labHandler as LabHandler;
        await labHandler.labRef.update(req.body.new);
        res.status(200).send({
            msg: 'Fields changed successfully'
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

export default LabRouter;
