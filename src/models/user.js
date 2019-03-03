import mongoose from 'mongoose';

const userModel = mongoose.model(
  'User',
  new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phoneNumber: {type: String, unique: true, required: true},
    balance: {type: Number},
    timestamp: { type: Date, default: new Date() },
    transactions: [{
      amount: {type: Number, required: true},
      to: {type: String}
    }]
  }),
);

export default userModel;
