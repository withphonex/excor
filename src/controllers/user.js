import User from "../models/user";

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
    res.send({ success: false, error });
  }
};

/**
 * rad a user
 * @param {*} req
 * @param {*} res
 */
const read = async (req, res) => {
  try {
    const users = await User.find({});

    res.send({ success: true, data: users });
  } catch (error) {
    res.send({ success: false, error });
  }
};

const sendTransaction = async (req, res) => {
  try {
    const {phoneNumber} = req.params;
    const {amount, from} = req.body;

    const user = await User.findOneAndUpdate({phoneNumber}, {"$push": {"transactions": {amount, from}}}, {new: true});
    // let {balance} = user;
    // balance = balance - amount;
    // user.update({balance}, {new: true})

    res.send({success: true, data: user})
  } catch (e) {
    console.log(e);
    res.send({ success: false, e });
  }
};

export default { create, read, sendTransaction };
