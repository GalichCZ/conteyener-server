import { Router } from 'express';
import MailController from '../controller/mail.controller';

const router = Router();

const _mailController = new MailController();

router.get('/test', _mailController.testEmail);
router.post('/activation', _mailController.activationEmail);
router.post('/password-change', _mailController.passwordChangeEmail);
router.post('/docs-notification', _mailController.docsNotification);
router.post('/date-notification', _mailController.dateNotification);
router.post('/out-date-notification', _mailController.outDateNotification);

export default router;
