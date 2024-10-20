import Bid from '../models/Bid.js';
import AuctionItem from '../models/AuctionItem.js';
import Notification from '../models/Notification.js'; 
import User from '../models/User.js'
import nodemailer from 'nodemailer'; 
import { io } from '../index.js'

// Email configuration (using Nodemailer)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'manoj.venkateshgowda@campusuvce.in',
    pass: 'Bhagvanp@914',
  },
});

// Function to send outbid notification email
const sendOutbidEmail = async (email, auctionItem, newBidAmount) => {
  const mailOptions = {
    from: 'manoj.venkateshgowda@campusuvce.in',
    to: email,
    subject: 'You have been outbid!',
    text: `You have been outbid on auction item: ${auctionItem.title}. The new highest bid is $${newBidAmount}. Place a new bid to win the auction!`,
  };

  try{
  await transporter.sendMail(mailOptions);
  }
  catch(err){
    console.log(err);
  }
};

// Place a new bid
const placeBid = async (req, res) => {
    debugger;
    console.log(req);
  const { amount } = req.body;
  const { auctionItemId } = req.params;

  try {
    const auctionItem = await AuctionItem.findById(auctionItemId).populate('bids');
    if (!auctionItem) return res.status(404).json({ message: 'Auction item not found' });

    const previousHighestBid = auctionItem.currentHighestBid;
    const previousHighestBidder = auctionItem.highestBidder; // Assuming you store the highest bidder

    if (amount <= previousHighestBid) {
      return res.status(400).json({ message: 'Bid must be higher than the current highest bid' });
    }

    // Create and save the bid
    const bid = new Bid({
      amount,
      bidder: req.user.id,
      auctionItem: auctionItemId,
    });

    await bid.save();

    // Update auction item with new highest bid and add the bid to its bid history
    auctionItem.currentHighestBid = amount;
    auctionItem.highestBidder = req.user.id; // Update highest bidder
    auctionItem.bids.push(bid._id);
    await auctionItem.save();
 
    // Notify the previous highest bidder via email (if there was one)
    if (previousHighestBidder && previousHighestBidder !== req.user.id) {
        const previousUser = await User.findById(previousHighestBidder);
        const message = `You have been outbid on auction item "${auctionItem.title}". The new highest bid is $${amount}.`;
        const notification = new Notification({
            user: previousHighestBidder, 
            message: message,    
            email: previousUser.email,
        });
        console.log(notification);
        await notification.save();
      const previousBidderEmail = previousHighestBidder.email; // Assuming email is part of the user model
      //await sendOutbidEmail(previousBidderEmail, auctionItem, amount);
    }

    res.status(201).json(bid);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error placing bid' });
  }
};

// Get all bids for a specific auction item
const getBidsForAuctionItem = async (req, res) => {
  try {
    const bids = await Bid.find({ auctionItem: req.params.auctionItemId })
      .populate('bidder', 'firstName lastName');
    res.json(bids);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching bids' });
  }
};

const getBidsofMine = async (req, res) => {
    try {
        const bids = await Bid.find({ bidder: req.user.id })
            .populate('auctionItem', 'title endDate') // Ensure we're populating with title and endDate
            .exec();

        res.json(bids);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error fetching bids', error: err });
    }
};

const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(notifications);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching notifications' });
      }
};

  
  

export default {
  placeBid,
  getBidsForAuctionItem,
  getBidsofMine,
  getNotifications,
};
