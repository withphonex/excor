import { Router } from 'express';

import twilio from '../controllers/twilio';
import user from '../controllers/user';

const router = Router();

/* Twilio Routes */
router.post('/receive-message', twilio.receiveWebhook);

/* User routes */
router.post('/user', user.create);
router.get('/user/:phoneNumber', user.read);
router.post('/user/:phoneNumber/send', user.sendTransaction);
 
export { router };