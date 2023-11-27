import { LabHandler } from '../helpers/LabHandler';
import * as express from 'express';
import { Authenticate } from '../auth';
import asyncHandler from 'express-async-handler';

const AntibodyRouter = express.Router();

//Check for common message body
// AntibodyRouter.use('*', (req, res, next) => {
//     next();
// });

//Authenticate
AntibodyRouter.use(asyncHandler(Authenticate));

//get all antibodies as a condensed response.
AntibodyRouter.get(
    '/',
    asyncHandler(async (req, res) => {
        try {
            const labHandler = res.locals.labHandler as LabHandler;
            const antibodyDocs =
                await labHandler.antibodyHelper.collectionRef.get();
            const antibodies: any[] = [];
            antibodyDocs.forEach((antibodyDoc) => {
                interface ReturnAntibody {
                    id: string;
                    [key: string]: any;
                } //This interface allows for new properties to be added dynamically
                let returnAntibody: ReturnAntibody = {
                    id: antibodyDoc.id
                };
                if (req.query.fields && req.query.fields === '*') {
                    //All fields
                    const antibody = antibodyDoc.data();
                    returnAntibody = {
                        ...returnAntibody,
                        ...antibody
                    };
                } else if (
                    req.query.fields &&
                    Array.isArray(req.query.fields) &&
                    req.query.fields.length
                ) {
                    //If fields are specified
                    req.query.fields.forEach((field) => {
                        if (typeof field === 'string')
                            returnAntibody[field] = antibodyDoc.get(field);
                    });
                } else {
                    // No fields, return the key fields
                    returnAntibody.marker = antibodyDoc.get('marker');
                    returnAntibody.reactivity = antibodyDoc.get('reactivity');
                    returnAntibody.color = antibodyDoc.get('color');
                    returnAntibody.company = antibodyDoc.get('company');
                    returnAntibody.catalog = antibodyDoc.get('catalog');
                }
                antibodies.push(returnAntibody);
            });
            res.status(200).json(antibodies);
        } catch (error) {
            res.status(500).send(error);
        }
    })
);

//Get antibody by id
AntibodyRouter.get(
    '/:id',
    asyncHandler(async (req, res) => {
        try {
            const labHandler = res.locals.labHandler as LabHandler;
            const doc = await labHandler.antibodyHelper.collectionRef
                .doc(req.params.id)
                .get();
            if (doc.exists) {
                res.status(200).json(doc.data());
            } else {
                res.sendStatus(404);
            }
        } catch (error) {
            res.status(500).send(error);
        }
    })
);

AntibodyRouter.post(
    '/',
    asyncHandler(async (req, res) => {
        try {
            const labHandler = res.locals.labHandler as LabHandler;
            const tryDocAdd = await labHandler.antibodyHelper.addAntibody(
                req.body.antibody
            );
            if (tryDocAdd.didAdd) {
                res.status(tryDocAdd.status).send({
                    msg: 'document created',
                    doc: tryDocAdd.doc.id
                });
            } else {
                res.status(tryDocAdd.status).json({
                    reasons: tryDocAdd.reasons
                });
            }
        } catch (error) {
            res.status(500).send(error);
        }
    })
);

AntibodyRouter.delete(
    '/:id',
    asyncHandler(async (req, res) => {
        try {
            const labHandler = res.locals.labHandler as LabHandler;
            const doc = labHandler.antibodyHelper.collectionRef.doc(
                req.params.id
            );
            const antibody = await doc.get();
            if (antibody.exists) {
                await doc.delete();
                res.status(200).send({
                    msg: 'document deleted',
                    doc: req.params.id
                });
            } else {
                res.status(404).json({
                    msg: 'antibody not found'
                });
            }
        } catch (error) {
            res.status(500).send(error);
        }
    })
);

//update antibody
AntibodyRouter.put(
    '/:id',
    asyncHandler(async (req, res) => {
        try {
            const labHandler = res.locals.labHandler as LabHandler;
            const doc = labHandler.antibodyHelper.collectionRef.doc(
                req.params.id
            );
            const antibody = await doc.get();
            if (antibody.exists) {
                await doc.update(req.body.antibody);
                res.status(200).send({
                    msg: 'document updated',
                    doc: req.params.id
                });
            } else {
                res.status(404).json({
                    msg: 'antibody not found'
                });
            }
        } catch (error) {
            res.status(500).send(error);
        }
    })
);

export default AntibodyRouter;
