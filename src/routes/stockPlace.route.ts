import { Router } from 'express';
import { validateBody } from '../middleware/bodyValidation.middleware';
import { StockPlaceSchema } from '../schema/stockPlace.schema';
import StockPlaceController from '../controllers/stockPlace.controller';

const router = Router();
const _stockPlaceController = new StockPlaceController();

router.post(
  '/stock-place',
  validateBody(StockPlaceSchema),
  _stockPlaceController.createStockPlace
);
router.get('/stock-place', _stockPlaceController.getStockPlaces);
router.delete('/stock-place/:id', _stockPlaceController.deleteStockPlace);
router.put(
  '/stock-place/:id',
  validateBody(StockPlaceSchema),
  _stockPlaceController.updateStockPlace
);

export default router;
