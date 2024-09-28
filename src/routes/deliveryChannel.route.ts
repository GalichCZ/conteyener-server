import { Router } from 'express';
import { validateBody } from '../middleware/bodyValidation.middleware';
import { DeliveryChannelSchema } from '../schema/deliveryChannel.schema';
import DeliveryChannelController from '../controllers/deliveryChannel.controller';

const router = Router();
const _deliveryChannelController = new DeliveryChannelController();

router.post(
  '/delivery-channel',
  validateBody(DeliveryChannelSchema),
  _deliveryChannelController.createDeliveryChannel
);
router.get('/delivery-channel', _deliveryChannelController.getDeliveryChannels);
router.delete(
  '/delivery-channel/:id',
  _deliveryChannelController.deleteDeliveryChannel
);
router.put(
  '/delivery-channel/:id',
  validateBody(DeliveryChannelSchema),
  _deliveryChannelController.updateDeliveryChannel
);

export default router;
