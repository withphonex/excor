import User from "../models/user";
import { getUser, fund, purchase } from '../services/marqueta';

/**
 * Create a user
 * @param {*} req
 * @param {*} res
 */
const create = async (req, res) => {
  // Requires these fields in the body of the request
  try {
    const user = await User.create(req.body);
    console.log(user);
    res.send({ success: true, data: user });
  } catch (error) {
    res.send({ success: false, err:error.data });
  }
};

/**
 * rad a user
 * @param {*} req
 * @param {*} res
 */
const read = async (req, res) => {
  try {
    console.log("Readding user");
    const { phone: phoneNumber } = req.params;
    console.log('getting idea', phoneNumber);
    const users = await User.findOne({phoneNumber});
    const carlos = await getUser({ token: '7868322852' });

    console.log(carlos);
    res.send({ success: true, data: carlos });
  } catch (error) {
    console.log(error)
    res.send({ success: false, error });
  }
};


const transferFunds = async (req, res) => {
  try {
    const { phone: user_token } = req.params;
    const { amount } = req.body;
    const {data} = await fund({ amount, user_token: '7868322852' });

    res.send({ success: true, data});
  } catch (error) {
    console.log(error)
    res.send({ success: false, err: error.data });
  }
}

const expense = async (req, res) => {
  try {
    const { phone: token } = req.params;
    const {amount} = req.body;

    const user = await getUser({ token });
    const {data: { transaction }} = await purchase({ amount, card_token: user.cards[0].token}); //'d939280d-1a01-4e2b-8b73-41ba15d86803'

    res.send({ success: true, transaction });
  } catch (error) {
    console.log(error)
    res.send({ success: false, err: error.data });
  }
}




const sendTransaction = async (req, res) => {
  try {
    const {phone: phoneNumber} = req.params;
    const {amount, from} = req.body;

    const user = await User.findOneAndUpdate({phoneNumber}, {"$push": {"transactions": {amount, from}}}, {new: true});

    res.send({success: true, data: user})
  } catch (e) {
    console.log(e);
    res.send({ success: false, e });
  }
};

export default { create, read, transferFunds, expense, sendTransaction };
