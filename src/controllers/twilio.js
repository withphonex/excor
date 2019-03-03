import twilio from '../services/twilio';

const receiveWebhook = async (req, res) => {
  const {Body, From} = req.body;
  const parsedBody = Body.split(" ");
  const message = await twilio.receiveIncomingMessage(parsedBody, From);
  console.log(message.toString());

  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(message.toString());
}

export default {receiveWebhook};