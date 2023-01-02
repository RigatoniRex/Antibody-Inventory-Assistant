import * as express from 'express';
import Crypto, { Authenticate } from '../auth';
import { LabHandler } from '../labHandler';

const LabRouter = express.Router();

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
LabRouter.put('/change-name', async (req, res) => {
    try {
        const labHandler = res.locals.labHandler as LabHandler;
        const check = await LabHandler.checkExists(req.body.new.name);
        if (!check.exists) {
            await labHandler.labRef.update({ name: req.body.new.name });
            res.status(200).send({
                msg: 'Fields changed successfully'
            });
        } else {
            res.status(500).send({
                msg: 'lab name already exists'
            });
        }
    } catch (error) {
        res.status(500).send(error);
    }
});
LabRouter.put('/change-pass', async (req, res) => {
    try {
        const labHandler = res.locals.labHandler as LabHandler;
        await labHandler.labRef.update({
            password: Crypto.createHash(req.body.new.password)
        });
        res.status(200).send({
            msg: 'Password changed successfully'
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

export default LabRouter;
