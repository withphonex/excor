import twilio from '../services/twilio';

const receiveWebhook = (req, res) => {
  const {Body, From} = req.body;
  const parsedBody = Body.split(" ");
  const message = twilio.receiveIncomingMessage(parsedBody, From);

  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(message.toString());
}

export default {receiveWebhook};