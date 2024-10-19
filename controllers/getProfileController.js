import AuctionItem from '../models/AuctionItem.js'; 
import Bid from '../models/Bid.js';         
import User from '../models/User.js';       

// Controller function to fetch profile data
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming the auth middleware attaches `req.user` from the token
    
    // Fetch auctions created by the user
    const auctions = await AuctionItem.find({ createdBy: userId });

    // Fetch bids made by the user
    const bids = await Bid.find({ bidder: userId }).populate('AuctionItem'); // Assuming bids are linked to auctions

    res.json({
      auctions,
      bids,
    });
  } catch (error) {
    console.error('Error fetching user profile data:', error);
    return res.status(500).json({ error: 'Server error while fetching user profile data' });
  }
};

export default getProfile;
