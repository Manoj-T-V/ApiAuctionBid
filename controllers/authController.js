import User from '../models/User.js';
import bcrypt from 'bcryptjs'; 
import jwt from 'jsonwebtoken'; 
// **register** 
const register = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(401).json({ error: 'User already exists' });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword
    });

    await newUser.save();
    res.status(201).json({ msg: 'User registered' });
  } catch (err) {
    res.status(500).json({ msg: 'Internal Server error' });
  }
};

// **login** 
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'User not registered' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ 
      token ,
      user: {
        id: user._id,
        name: user.firstName + ' ' + user.lastName,
        email: user.email 
      }

    });
  } catch (err) {
    res.status(500).json({ msg: 'Internal Server error' });
  }
};

const checksession = async(req,res) =>{
    if (req.isAuthenticated()) {
        // User is authenticated
        res.json({ authenticated: true });
      } else {
        // User is not authenticated
        res.json({ authenticated: false });
      }
};

const signingoogle = async(req, res) =>{
  const { firstName, lastName, email, password, googleId, picture, emailVerified } = req.body;
  try {
    // Check if user exists by email or Google ID
    let user = await User.findOne({ email });

    if (user) {
      // User exists
      if (googleId) {
        // Update Google ID if provided
        user.googleId = googleId;
        user.picture = picture;
        user.emailVerified = emailVerified;
        await user.save();
      }
      // Generate a JWT token for the user
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.status(200).json({ success: true, token, user });
    } else {
      // User does not exist, create a new user
      const hashedPassword = password ? await bcrypt.hash(password, 10) : null; // Hash password if provided

      user = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword, 
        googleId,
        picture,
        emailVerified,
      });
      await user.save();

      // Generate a JWT token for the new user
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '3h' });
      return res.status(201).json({ success: true, token });
    }
  }
  catch{
    res.status(500).json({ success: false, error: 'Internal Server Error, while logging in' });
  }
}

// Export all controller functions as an object
export default {
  register,
  login,
  checksession,
  signingoogle
};
