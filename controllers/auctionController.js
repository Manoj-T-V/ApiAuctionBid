import AuctionItem from '../models/AuctionItem.js';

// Create a new auction item
const createAuctionItem = async (req, res) => {
  console.log(req);
  const { title, description, startingBid, endDate } = req.body;
  try {
    const auctionItem = new AuctionItem({
      title,
      description,
      startingBid,
      currentHighestBid: startingBid,
      endDate,
      createdBy: req.user.id, 
    });

    await auctionItem.save();
    res.status(201).json(auctionItem);
  } catch (err) {
    res.status(500).json({ message: 'Error creating auction item' });
  }
};

// Get all auction items
const getAuctionItems = async (req, res) => {
  try {
    const auctionItems = await AuctionItem.find().populate('createdBy', 'username');
    res.json(auctionItems);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching auction items' });
  }
};

const getAuctionsByUser = async (req, res) =>{
  try {
    const auctionItems = await AuctionItem.find({ createdBy: req.user.id }).populate('createdBy', 'username');
    res.json(auctionItems);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching auction items' });
  }
}

// Get a single auction item by ID
const getAuctionItemById = async (req, res) => {
  try {
    const auctionItem = await AuctionItem.findById(req.params.id).populate('createdBy', 'username');
    if (!auctionItem) return res.status(404).json({ message: 'Auction item not found' });

    res.json(auctionItem);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching auction item' });
  }
};

// Update an auction item
const updateAuctionItem = async (req, res) => {
  try {
    const auctionItem = await AuctionItem.findById(req.params.id);

    if (!auctionItem) return res.status(404).json({ message: 'Auction item not found' });

    if (auctionItem.createdBy.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this item' });
    }

    Object.assign(auctionItem, req.body);
    await auctionItem.save();

    res.json(auctionItem);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error updating auction item' });
  }
};

// Delete an auction item
const deleteAuctionItem = async (req, res) => {
  try {
    const auctionItem = await AuctionItem.findById(req.params.id);

    if (!auctionItem) return res.status(404).json({ message: 'Auction item not found' });

    if (auctionItem.createdBy.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this item' });
    }
       // Delete all bids associated with the auction item
       await Bid.deleteMany({ auctionItem: auctionItem._id });
    await AuctionItem.deleteOne({ _id: auctionItem._id });
    res.json({ message: 'Auction item deleted' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error deleting auction item' , error: err });
  }
};

export default{
     getAuctionItems,
    createAuctionItem,
    deleteAuctionItem,
    updateAuctionItem,
    getAuctionItemById,
    getAuctionsByUser
};
