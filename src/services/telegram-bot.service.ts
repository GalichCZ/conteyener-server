import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
dotenv.config();

class TelegramBotService {
  private _botKey = process.env.BOT_KEY;
  private _chatId = process.env.BOT_CHAT_ID;
  private _bot = new Telegraf(this._botKey || '');

  async sendMessage(message: string) {
    try {
      if (!this._chatId) return;
      await this._bot.telegram.sendMessage(this._chatId, message);
    } catch (error) {
      console.log(error);
    }
  }
}

export default TelegramBotService;
