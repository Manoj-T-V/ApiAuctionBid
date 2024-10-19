import express from 'express';
const router = express.Router();
import passport from 'passport';
import authController from '../controllers/authController.js'; 
import authMiddleware from '../middleware/authMiddleware.js';
import getProfile from '../controllers/getProfileController.js';

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/check', authController.checksession);
router.post('/signingoogle', authController.signingoogle)
router.get('/profile', authMiddleware, getProfile);
// todo route for Google login 
// Route to start Google authentication
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
  }));
  
//   // Callback route after Google authentication
//   router.get('/google/callback', 
//     passport.authenticate('google', { session: false }),
//     (req, res) => {
//         console.log("success");
//       // Successful authentication, redirect home.
//       res.redirect('/');
//     }
//   );

  // Callback route after Google authentication
router.get('/google/callback', 
    passport.authenticate('google', { session: false }), // No session handling here, use JWT or similar
    (req, res) => {
        // Successful authentication, generate a token and redirect
        const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.redirect(`http://localhost:3000/tasks?token=${token}`); // Redirect with token as query parameter
    }
);
  
  // Logout route
  router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });
  
  // Check if authenticated
  router.get('/current_user', (req, res) => {
    res.json(req.user);
  });
export default router;
