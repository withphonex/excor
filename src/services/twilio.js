import twilio from 'twilio';
import User from '../models/user';

const { TWILIO_AUTH_TOKEN, TWILIO_ACCOUNT_SID, TWILIO_PHONE_NUMBER } = process.env;

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

const MessageResponse = twilio.twiml.MessagingResponse;


const textResolver = {
  PHONEX: {
    resolver: (_amount, _phoneNumber) => {
      return `
      WELCOME TO PHONEX, HERE ARE YOUR COMMANDS \n
      TRANSFER - use the command 'TRANSFER X' where x
      is the amount of airtime you're trying to transfer. \n
      BALANCE - use the command 'BALANCE' to determine your total
      airtime balance. 
      `
    }
  },
  TRANSFER: {
    resolver: (amount) => {
      if(typeof amount !== "undefined" && typeof amount !== "" && typeof parseFloat(amount) === "number" ) {
        return `Transferred ${amount} to your bank account!`;
      } else {
        return 'There was an error transferring to your account';
      }
    }
  },
  BALANCE: {
    resolver: async (_amount, phoneNumber) => {
      // const user = await User.findOne({phoneNumber});
      if(true) {
        console.log("Why would this fail?")
        return `Your balance is `;
      } else {
        return "Sorry, There's no user that belongs to this number..."
      }
    }
  },
}


const receiveIncomingMessage = (message, phoneNumber) => {
  const twiml = new MessageResponse();
  console.log(message, phoneNumber);
  let response;
  Object.keys(textResolver).map(async (keyName) => {
    if(keyName === message[0]) {
      console.log("TEEEXT", textResolver[keyName]);
      response = await textResolver[keyName].resolver(message[1], phoneNumber); 
    }
  });
  return twiml.message(response);
}

export default {receiveIncomingMessage};