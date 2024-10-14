import { Router } from 'express';
import { validateBody } from '../middleware/bodyValidation.middleware';
import { StoreSchema } from '../schema/store.schema';
import StoreController from '../controllers/store.controller';

const router = Router();
const _storeController = new StoreController();

router.post('/store', validateBody(StoreSchema), _storeController.createStore);
router.get('/store', _storeController.getStores);
router.delete('/store/:id', _storeController.deleteStore);
router.put(
  '/store/:id',
  validateBody(StoreSchema),
  _storeController.updateStore
);

export default router;
