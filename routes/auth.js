import express from 'express';
const router = express.Router();
import passport from 'passport';
import authController from '../controllers/authController.js'; 
import authMiddleware from '../middleware/authMiddleware.js';
import getProfile from '../controllers/getProfileController.js';

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       description: User registration data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: User successfully registered
 *       400:
 *         description: Invalid input data
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login a user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       description: User login data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login, returns token
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /check:
 *   get:
 *     summary: Check if a user session is valid
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Session is valid
 *       401:
 *         description: Not authenticated
 */
router.get('/check', authController.checksession);

/**
 * @swagger
 * /signingoogle:
 *   post:
 *     summary: Sign in using Google account
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Google sign-in successful
 *       401:
 *         description: Google sign-in failed
 */
router.post('/signingoogle', authController.signingoogle);

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get user profile information
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile
 *       401:
 *         description: Unauthorized
 */
router.get('/profile', authMiddleware, getProfile);

/**
 * @swagger
 * /google:
 *   get:
 *     summary: Start Google authentication
 *     tags:
 *       - Authentication
 *     responses:
 *       302:
 *         description: Redirect to Google login page
 */
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

/**
 * @swagger
 * /google/callback:
 *   get:
 *     summary: Callback after Google authentication
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Successful Google authentication, redirect to tasks page
 *       401:
 *         description: Authentication failed
 */
router.get('/google/callback', 
    passport.authenticate('google', { session: false }), 
    (req, res) => {
        const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.redirect(`http://localhost:3000/tasks?token=${token}`);
    }
);

/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Logout the current user
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Successfully logged out
 */
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

/**
 * @swagger
 * /current_user:
 *   get:
 *     summary: Get the current authenticated user
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Returns the authenticated user
 *       401:
 *         description: Not authenticated
 */
router.get('/current_user', (req, res) => {
    res.json(req.user);
});

export default router;
