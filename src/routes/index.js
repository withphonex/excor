import { Router } from 'express';

import user from '../controllers/user';
import twilio from '../services/twilio';

const router = Router();

router.post('/receive-message', (req, res) => {
  const {body} = req.body;
  console.log(req.body);
  const message = twilio.receiveIncomingMessage();
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(message.toString());
});

/* Example user routes */
router.post('/user', user.create);
router.get('/user', user.read);
router.post('/user/:phoneNumber/send', user.sendTransaction);
 
export { router };