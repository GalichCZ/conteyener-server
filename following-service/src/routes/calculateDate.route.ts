import { Router } from 'express';
import { validateBody } from '../middleware/bodyValidation.middleware';
import CalculateDateController from '../controllers/calculateDate.controller';

const router = Router();
const _calculateDateController = new CalculateDateController();

//TODO: validateBody
router.post('/calculate-date', _calculateDateController.calculateDate);
router.put('/calculate-date', _calculateDateController.recalculateDate);
router.get(
  '/calculate-date/:following_id',
  _calculateDateController.getCalculatedDate
);

export default router;
