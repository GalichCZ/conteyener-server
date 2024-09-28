import { Router } from 'express';
import { validateBody } from '../middleware/bodyValidation.middleware';
import { ProviderSchema } from '../schema/provider.schema';
import ProviderController from '../controllers/provider.controller';

const router = Router();
const _providerController = new ProviderController();

router.get('/provider', _providerController.getProviders);
router.post(
  '/provider',
  validateBody(ProviderSchema),
  _providerController.createProvider
);
router.put(
  '/provider/:id',
  validateBody(ProviderSchema),
  _providerController.updateProvider
);
router.delete('/provider/:id', _providerController.deleteProvider);

export default router;
