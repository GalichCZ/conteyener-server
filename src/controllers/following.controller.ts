import FollowingRepository from '../db/repositories/following.repository';
import { Response, Request, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { FollowingOutput } from '../db/models/Following.model';
import FollowingService from '../services/following.service';

class FollowingController {
  private _followingService = new FollowingService();

  createFollowing = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const following = await this._followingService.createFollowing(req.body);
      res.status(StatusCodes.CREATED).json(following);
    } catch (error) {
      next(error);
    }
  };

  deleteFollowing = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this._followingService.deleteFollowing(req.params.id);
      res.sendStatus(StatusCodes.OK);
    } catch (error) {
      next(error);
    }
  };

  getFollowings = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const followings = await this._followingService.getFollowings();
      res.status(StatusCodes.OK).json(followings);
    } catch (error) {
      next(error);
    }
  };
}

export default FollowingController;
