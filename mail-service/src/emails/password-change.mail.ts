import { User } from '../types/user';

export const passwordChangeMail = (user: User, link: string) => {
  return `
            <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f9f9f9;">
                <div style="max-width: 600px; margin: auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                    <div style="background-color: #fb511e; color: #ffffff; padding: 20px;">
                        <h1 style="margin: 0;">Смена пароля на CONTEYENER</h1>
                    </div>
                    <div style="padding: 30px;">
                        <p style="font-size: 16px; color: #333333;">Здравствуйте, ${user.first_name}</p>
                        <p style="font-size: 16px; color: #333333;">Для смены пароля перейдите по следующей ссылке:</p>
                        <a href="${link}" style="display: inline-block; background-color: #fb511e; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px; margin: 20px 0;">Сбросить пароль</a>
                        <p style="font-size: 16px; color: #333333;">Если вы не запрашивали смену пароля, пожалуйста, проигнорируйте это письмо.</p>
                    </div>
                </div>
                <div style="margin-top: 20px; font-size: 12px; color: #999999;">
                    © 2024 Patriot. Все права защищены.
                </div>
            </div>
            `;
};
