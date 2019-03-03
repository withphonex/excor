import twilio from 'twilio';
import User from '../models/user';
import { transfer } from './marqueta';

const { TWILIO_AUTH_TOKEN, TWILIO_ACCOUNT_SID, TWILIO_PHONE_NUMBER } = process.env;

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

const MessageResponse = twilio.twiml.MessagingResponse;


const textResolver = {
  PHONEX: {
    resolver: (_amount, _phoneNumber) => {
      console.log('hittting resolver');
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
    resolver: async (amount, phoneNumber) => {
      if(typeof amount !== "undefined" && typeof amount !== "" && typeof parseFloat(amount) === "number" ) {
        const user = await User.findOne({phoneNumber});
        if(user.airtime < amount) {
          return "Couldn't complete your transaction: Insufficient Balance"
        } else {
          return `Transferred ${amount} to your bank account!`;
        }

      } else {
        return 'There was an error transferring to your account';
      }
    }
  },
  BALANCE: {
    resolver: async (_amount, phoneNumber) => {
      const user = await User.findOne({phoneNumber});
      if(user) {
        return `Your balance is ${user.airtime} is 50 minutes`;
      } else {
        return "Sorry, There's no user that belongs to this number..."
      }
    }
  },
}


const receiveIncomingMessage = async (message, phoneNumber) => {
  const twiml = new MessageResponse();
  console.log(message, phoneNumber);
  const [action, amount] = message;  
  const response = await textResolver[action].resolver(amount, phoneNumber);
  return twiml.message(response || 'Default Return message');

  // Object.keys(textResolver).map(async (keyName) => {
  //   if(keyName === message[0]) {
  //     console.log("TEEEXT", textResolver[keyName]);
  //     response = await textResolver[keyName].resolver(message[1], phoneNumber); 
  //     console.log('le response', response);
  //   }
  // });
}

export default {receiveIncomingMessage};