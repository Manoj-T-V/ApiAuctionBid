import mongoose from 'mongoose';

const auctionItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  startingBid: {
    type: Number,
    required: true,
    min: 0,
  },
  currentHighestBid: {
    type: Number,
    default: 0,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  bids: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bid',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const AuctionItem = mongoose.model('AuctionItem', auctionItemSchema);
export default AuctionItem;