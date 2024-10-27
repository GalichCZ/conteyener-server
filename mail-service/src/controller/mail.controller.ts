import MailService from '../services/mail.service';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

class MailController {
  private _mailService = new MailService();

  testEmail = async (req: Request, res: Response) => {
    try {
      await this._mailService.testEmail();
      res.status(StatusCodes.OK).send();
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
    }
  };

  activationEmail = async (req: Request, res: Response) => {
    try {
      await this._mailService.activationEmail(req.body);
      res.status(StatusCodes.OK).send();
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
    }
  };

  passwordChangeEmail = async (req: Request, res: Response) => {
    try {
      await this._mailService.passwordChangeEmail(req.body);
      res.status(StatusCodes.OK).send();
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
    }
  };

  docsNotification = async (req: Request, res: Response) => {
    try {
      await this._mailService.docsNotification(req.body);
      res.status(StatusCodes.OK).send();
    } catch (error) {
      console.log(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
    }
  };

  dateNotification = async (req: Request, res: Response) => {
    try {
      await this._mailService.dateNotification(req.body);
      res.status(StatusCodes.OK).send();
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
    }
  };

  outDateNotification = async (req: Request, res: Response) => {
    try {
      await this._mailService.outDateNotification(req.body);
      res.status(StatusCodes.OK).send();
    } catch (error) {
      console.log(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
    }
  };

  notifyDs = async (req: Request, res: Response) => {
    try {
      await this._mailService.notifyDs(req.body);
      res.status(StatusCodes.OK).send();
    } catch (error) {
      console.log(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
    }
  };

  notifyBl = async (req: Request, res: Response) => {
    try {
      await this._mailService.notifyBl(req.body);
      res.status(StatusCodes.OK).send();
    } catch (error) {
      console.log(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
    }
  };
}

export default MailController;
