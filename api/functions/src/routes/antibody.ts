import { LabHandler } from '../labHandler';
import * as express from 'express';

const AntibodyRouter = express.Router();

//Check for common message body
AntibodyRouter.use('*', (req, res, next) => {
    if (!req.body.lab) {
        res.status(400).send({
            msg: 'Bad Request',
            rsn: 'Lab Missing'
        });
        return; //skip the call to next();
    }
    if (!req.body.password) {
        res.status(401).send({
            msg: 'Unauthorized',
            rsn: 'Password Missing'
        });
        return; //skip the call to next();
    }
    next();
});

//Authenticate
AntibodyRouter.use('*', async (req, res, next) => {
    const labHandler = new LabHandler(req.body.lab);
    const validPassword = await labHandler.checkPassword(req.body.password);
    if (!validPassword) {
        res.status(401).send({
            msg: 'Unauthorized',
            rsn: 'Invalid Password'
        });
    } else {
        res.locals.labHandler = labHandler;
        next();
    }
});

//get all antibodies as a condensed response.
AntibodyRouter.get('/search', async (req, res) => {
    try {
        const labHandler = res.locals.labHandler as LabHandler;
        const antibodyDocs = await labHandler.antibodyCollectionRef.get();
        const antibodies: any[] = [];
        antibodyDocs.forEach((antibodyDoc) => {
            interface ReturnAntibody {
                id: string;
                [key: string]: any;
            }
            const returnAntibody: ReturnAntibody = {
                id: antibodyDoc.id
            };
            if (req.body.fields && req.body.fields.count) {
                req.body.fields.forEach((field: string) => {
                    returnAntibody[field] = antibodyDoc.get(field);
                });
            } else {
                returnAntibody.marker = antibodyDoc.get('marker');
            }
            antibodies.push(returnAntibody);
        });
        res.status(200).json(antibodies);
    } catch (error) {
        res.status(500).send(error);
    }
});

//Get antibody by id
AntibodyRouter.get('/:id', async (req, res) => {
    try {
        const labHandler = res.locals.labHandler as LabHandler;
        const doc = await labHandler.antibodyCollectionRef
            .doc(req.params.id)
            .get();
        res.status(200).json(doc.data());
    } catch (error) {
        res.status(500).send(error);
    }
});

//TODO: add antibody
AntibodyRouter.post('/', async (req, res) => {
    try {
        const labHandler = res.locals.labHandler as LabHandler;
        const doc = await labHandler.antibodyCollectionRef.add(
            req.body.antibody
        );
        res.status(200).send({
            msg: 'document added',
            doc: doc.id
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

//TODO: delete antibody
AntibodyRouter.delete('/:id', async (req, res) => {
    try {
        const labHandler = res.locals.labHandler as LabHandler;
        const doc = labHandler.antibodyCollectionRef.doc(req.params.id);
        await doc.delete();
        res.status(200).send({
            msg: 'document deleted',
            doc: req.params.id
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

//update antibody
AntibodyRouter.put('/:id', async (req, res) => {
    try {
        const labHandler = res.locals.labHandler as LabHandler;
        const doc = labHandler.antibodyCollectionRef.doc(req.params.id);
        await doc.update(req.body.antibody);
        res.status(200).send({
            msg: 'document updated',
            doc: req.params.id
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

export default AntibodyRouter;
