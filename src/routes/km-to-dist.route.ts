import { Router } from 'express';
import { validateBody } from '../middleware/bodyValidation.middleware';
import KmToDistController from '../controllers/km-to-dist.controller';

//TODO: add validation for body

const router = Router();
const _kmToDistController = new KmToDistController();

router.put('/km-to-dist', _kmToDistController.updateKmToDist);

export default router;
