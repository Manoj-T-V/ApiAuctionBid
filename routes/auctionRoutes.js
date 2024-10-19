import express from 'express';
import auccontroller  from '../controllers/auctionController.js';

import authenticateUser  from '../middleware/authMiddleware.js';

const router = express.Router();

// Create auction item (Authenticated users only)
router.post('/create', authenticateUser, auccontroller.createAuctionItem);

// Get all auction items
router.get('/', auccontroller.getAuctionItems);

router.get('/getmyauctions', authenticateUser , auccontroller.getAuctionsByUser);

// Get a single auction item by ID
router.get('/:id', auccontroller.getAuctionItemById);

// Update auction item (Authenticated users only)
router.put('/:id', authenticateUser, auccontroller.updateAuctionItem);

// Delete auction item (Authenticated users only)
router.delete('/:id', authenticateUser, auccontroller.deleteAuctionItem);

export default router;
