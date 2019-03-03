import twilio from 'twilio';
import User from '../models/user';
import { getUser, fund } from './marqueta';

const { TWILIO_AUTH_TOKEN, TWILIO_ACCOUNT_SID, TWILIO_PHONE_NUMBER } = process.env;

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

const MessageResponse = twilio.twiml.MessagingResponse;


const textResolver = {
  AIRTIME: {
    resolver: () => {
      return `
WELCOME TO DIGICEL, HERE ARE YOUR COMMANDS \n
TRANSFER - use the command 'TRANSFER X' where x
is the amount of airtime you're trying to transfer. \n
BALANCE - use the command 'BALANCE' to determine your total
airtime balance. 
      `
    }
  },
  PHONEX: {
    resolver: async (amount, token) => {
      try {
        const {gpa: {ledger_balance, currency_code}} = await getUser({token});
        return `Your PhoneX balance is : $${ledger_balance} ${currency_code}`
      } catch(err){
        return 'There was an issue retrieving your PhoneX account information';
      }
    }
  },
  TRANSFER: {
    resolver: async (amount, phoneNumber) => {
      try {
        if (!amount && typeof parseFloat(amount) !== "number") 
          return "There was an error transferring to your account";

        const user = await User.findOne({ phoneNumber });
        if (user.airtime < amount)
          return "Couldn't complete your transaction: Insufficient Balance";

        user.airtime -= amount;
        const { airtime } = await user.save();
        const transaction = await fund({ amount, user_token: phoneNumber });
        const { gpa: { ledger_balance, currency_code } } = await getUser({ token: phoneNumber });

        console.log('Account funded with from airtime', transaction);

        return `Transferred ${amount} to your bank account!\n
Your airtime balance is now: ${airtime} HTG\n Your PhoneX balance is : $${ledger_balance} ${currency_code}
`;
      } catch(err) {
        console.log(err)
        return 'There was an issue processing your transaction. Please try again.'
      }
    }
  },
  BALANCE: {
    resolver: async (amount = 0, phoneNumber) => {
      const user = await User.findOne({phoneNumber});
      if(user) {
        const {airtime} = user;
        return `Your balance ${airtime} is 50 minutes`;
      } else {
        return "Sorry, There's no user that belongs to this number..."
      }
    }
  },
}


const receiveIncomingMessage = async (message, phoneNumber) => {
  try {
    const twiml = new MessageResponse();
    console.log(message, phoneNumber);
    const [action, amount] = message;  
    const response = await textResolver[action].resolver(amount, phoneNumber.replace('+1', ''));
    return twiml.message(response || 'Default Return message');
  } catch (e) {
    return twiml.message('There was an issue handling your text, Enter PHONEX for help');
  }
}

export default {receiveIncomingMessage};