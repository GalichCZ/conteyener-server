import { Router } from 'express';
import { validateBody } from '../middleware/bodyValidation.middleware';
import { DeliveryMethodSchema } from '../schema/deliveryMethod.schema';
import DeliveryMethodController from '../controllers/deliveryMethod.controller';

const router = Router();
const _deliveryMethodController = new DeliveryMethodController();

router.post(
  '/delivery-method',
  validateBody(DeliveryMethodSchema),
  _deliveryMethodController.createDeliveryMethod
);
router.get('/delivery-method', _deliveryMethodController.getDeliveryMethods);
router.delete(
  '/delivery-method/:id',
  _deliveryMethodController.deleteDeliveryMethod
);
router.put(
  '/delivery-method/:id',
  validateBody(DeliveryMethodSchema),
  _deliveryMethodController.updateDeliveryMethod
);

export default router;
