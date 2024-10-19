import mongoose from 'mongoose';

const bidSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  bidder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  auctionItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AuctionItem',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Bid = mongoose.model('Bid', bidSchema);
export default Bid;
