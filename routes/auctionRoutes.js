import express from 'express';
import auccontroller from '../controllers/auctionController.js';
import authenticateUser from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /auctions/create:
 *   post:
 *     summary: Create a new auction item
 *     description: Authenticated users can create a new auction item.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Data required to create a new auction item.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               startPrice:
 *                 type: number
 *     responses:
 *       201:
 *         description: Auction item created successfully.
 *       401:
 *         description: Unauthorized (user must be authenticated).
 */
router.post('/create', authenticateUser, auccontroller.createAuctionItem);

/**
 * @swagger
 * /auctions:
 *   get:
 *     summary: Get all auction items
 *     description: Retrieve a list of all auction items.
 *     responses:
 *       200:
 *         description: List of auction items retrieved successfully.
 */
router.get('/', auccontroller.getAuctionItems);

/**
 * @swagger
 * /auctions/getmyauctions:
 *   get:
 *     summary: Get all auctions created by the authenticated user
 *     description: Authenticated users can retrieve a list of their own auction items.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's auctions retrieved successfully.
 *       401:
 *         description: Unauthorized (user must be authenticated).
 */
router.get('/getmyauctions', authenticateUser, auccontroller.getAuctionsByUser);

/**
 * @swagger
 * /auctions/{id}:
 *   get:
 *     summary: Get a single auction item by ID
 *     description: Retrieve the details of a specific auction item by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the auction item to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Auction item retrieved successfully.
 *       404:
 *         description: Auction item not found.
 */
router.get('/:id', auccontroller.getAuctionItemById);

/**
 * @swagger
 * /auctions/{id}:
 *   put:
 *     summary: Update an auction item
 *     description: Authenticated users can update an existing auction item by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the auction item to update.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Data to update the auction item.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               startPrice:
 *                 type: number
 *     responses:
 *       200:
 *         description: Auction item updated successfully.
 *       401:
 *         description: Unauthorized (user must be authenticated).
 *       404:
 *         description: Auction item not found.
 */
router.put('/:id', authenticateUser, auccontroller.updateAuctionItem);

/**
 * @swagger
 * /auctions/{id}:
 *   delete:
 *     summary: Delete an auction item
 *     description: Authenticated users can delete an auction item by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the auction item to delete.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Auction item deleted successfully.
 *       401:
 *         description: Unauthorized (user must be authenticated).
 *       404:
 *         description: Auction item not found.
 */
router.delete('/:id', authenticateUser, auccontroller.deleteAuctionItem);

export default router;
