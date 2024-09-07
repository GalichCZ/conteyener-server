import { Router } from 'express';
import { validateBody } from '../middleware/bodyValidation.middleware';
import { ContainerTypeSchema } from '../schema/containerType.schema';
import ContainerTypeController from '../controllers/containerType.controller';

const router = Router();
const _containerTypeController = new ContainerTypeController();

router.get('/container-type', _containerTypeController.getContainerTypes);
router.post(
  '/container-type',
  validateBody(ContainerTypeSchema),
  _containerTypeController.createContainerType
);
export default router;
