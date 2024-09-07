import FollowingController from '../controllers/following.controller';
import { Router } from 'express';
import { validateBody } from '../middleware/bodyValidation.middleware';
import { FollowingSchema } from '../schema/following.schema';

const router = Router();
const _followingController = new FollowingController();

router.get('/following', _followingController.getFollowings);

router.post(
  '/following',
  validateBody(FollowingSchema),
  _followingController.createFollowing
);

router.delete('/following/:id', _followingController.deleteFollowing);
export default router;
