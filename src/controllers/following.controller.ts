import { Response, Request, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import FollowingService from '../services/following/following.service';
import FollowingUpdateService from '../services/following/following-update.service';
import FollowingCreateService from '../services/following/following-create.service';
import FollowingDeleteService from '../services/following/following-delete.service';

class FollowingController {
  private _followingService = new FollowingService();
  private _followingUpdateService = new FollowingUpdateService();
  private _followingCreateService = new FollowingCreateService();
  private _followingDeleteService = new FollowingDeleteService();

  createFollowing = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const following = await this._followingCreateService.createFollowing(
        req.body
      );
      res.status(StatusCodes.CREATED).json(following);
    } catch (error) {
      next(error);
    }
  };

  deleteFollowing = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this._followingDeleteService.deleteFollowing(req.params.id);
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

  updateFollowing = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const following = await this._followingUpdateService.updateFollowing(
        req.params.id,
        req.body
      );
      res.status(StatusCodes.OK).json(following);
    } catch (error) {
      next(error);
    }
  };

  getFilterKeys = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { entity_name, entity_column } = req.params;
      const filters = await this._followingService.getFilterKeys({
        entity_name,
        entity_column,
      });
      res.status(StatusCodes.OK).json(filters);
    } catch (error) {
      next(error);
    }
  };
}

export default FollowingController;
