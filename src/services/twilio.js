import twilio from 'twilio';

const { TWILIO_AUTH_TOKEN, TWILIO_ACCOUNT_SID, TWILIO_PHONE_NUMBER } = process.env;

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

const MessageResponse = twilio.twiml.MessagingResponse;

const receiveIncomingMessage = () => {
  const twiml = new MessageResponse();
  return twiml.message("");
}

export default {receiveIncomingMessage};