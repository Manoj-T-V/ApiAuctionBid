import express from 'express';
import controller from '../controllers/bidController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Place a bid (Authenticated users only)
router.post('/:auctionItemId/bid', authMiddleware, controller.placeBid);

// Get all bids for a specific auction item
router.get('/:auctionItemId/allbids', controller.getBidsForAuctionItem);

router.get('/mybids',authMiddleware, controller.getBidsofMine);

//get notifications of outbids
router.get('/notifications',authMiddleware, controller.getNotifications);

export default router;
