import { Router } from 'express';

import twilio from '../controllers/twilio';
import user from '../controllers/user';

const router = Router();

/* Twilio Routes */
router.post('/receive-message', twilio.receiveWebhook);

/* User routes */
router.post('/user', user.create);
router.get('/user/:phone', user.read);
router.post('/user/:phone/send', user.transferFunds);

router.post('/user/:phone/transfer', user.transferFunds)
router.post('/user/:phone/spend', user.expense)
 
export { router };