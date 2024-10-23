export const docMail = (orderNumber: string, docType: string) => {
  return `
            <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f9f9f9;">
                <div style="max-width: 600px; margin: auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                    <div style="background-color: #fb511e; color: #ffffff; padding: 20px;">
                        <h1 style="margin: 0;">Уведомление о заказе ${orderNumber}</h1>
                    </div>
                    <div style="padding: 30px;">
                        <p style="font-size: 16px; color: #333333;">Здравствуйте,</p>
                        <p style="font-size: 16px; color: #333333;">
                            Для заказа <strong>${orderNumber}</strong> был оформлен документ: <strong>${docType}</strong>.
                        </p>
                        <p style="font-size: 16px; color: #333333;">
                            Пожалуйста, ознакомьтесь с приложенными документами и свяжитесь с нами при необходимости.
                        </p>
                    </div>
                </div>
                <div style="margin-top: 20px; font-size: 12px; color: #999999;">
                    © 2024 Patriot. Все права защищены.
                </div>
            </div>
            `;
};
