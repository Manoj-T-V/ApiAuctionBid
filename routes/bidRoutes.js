import express from 'express';
import controller from '../controllers/bidController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /bids/{auctionItemId}/bid:
 *   post:
 *     summary: Place a bid on an auction item
 *     description: Authenticated users can place a bid on a specific auction item.
 *     parameters:
 *       - in: path
 *         name: auctionItemId
 *         required: true
 *         description: ID of the auction item to place a bid on.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bid placed successfully.
 *       401:
 *         description: Unauthorized (user must be authenticated).
 */
router.post('/:auctionItemId/bid', authMiddleware, controller.placeBid);

/**
 * @swagger
 * /bids/{auctionItemId}/allbids:
 *   get:
 *     summary: Get all bids for an auction item
 *     description: Retrieves all bids placed for a specific auction item.
 *     parameters:
 *       - in: path
 *         name: auctionItemId
 *         required: true
 *         description: ID of the auction item to retrieve bids for.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of bids retrieved successfully.
 */
router.get('/:auctionItemId/allbids', controller.getBidsForAuctionItem);

/**
 * @swagger
 * /bids/mybids:
 *   get:
 *     summary: Get all bids of the authenticated user
 *     description: Retrieve all bids placed by the currently authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's bids retrieved successfully.
 *       401:
 *         description: Unauthorized (user must be authenticated).
 */
router.get('/mybids', authMiddleware, controller.getBidsofMine);

/**
 * @swagger
 * /bids/notifications:
 *   get:
 *     summary: Get outbid notifications for the authenticated user
 *     description: Retrieve notifications for the authenticated user when they have been outbid.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of outbid notifications retrieved successfully.
 *       401:
 *         description: Unauthorized (user must be authenticated).
 */
router.get('/notifications', authMiddleware, controller.getNotifications);

export default router;
