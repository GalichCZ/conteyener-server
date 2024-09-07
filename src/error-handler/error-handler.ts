import GError from './GError';
import { NextFunction, Request, Response } from 'express';
import TelegramBotService from '../services/telegram-bot.service';

export const errorHandler = async (
  err: GError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const telegramBotService = new TelegramBotService();

  const status = err.status || 500;

  console.log(err);

  await telegramBotService.sendMessage(
    `[${new Date().toISOString()}]: Service name: ${err.serviceName}\nMethod name: ${err.methodName}\nStatus: ${status}\nError: ${err.message}`
  );

  res.status(status).json({
    serviceName: err.serviceName,
    methodName: err.methodName,
    message: err.message,
    status,
  });
};
