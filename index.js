import express from "express"
import productRoutes from './routes/productRoutes.js';
import auth from './routes/auth.js';
import tasks from './routes/tasks.js';
import bidRoutes from './routes/bidRoutes.js';
import auctionRoutes from './routes/auctionRoutes.js';
import mongoose from "mongoose";
import { MongoClient, ServerApiVersion} from "mongodb";
import session from 'express-session'; 
import passport from './config/passport.js';
import cors from "cors"
import { config } from "dotenv";
import './config/passport.js';
import http from 'http'; 
import { Server } from 'socket.io'; 
config(); //load env variables
const app = express();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
export const io = new Server(server);

// Setup Socket.IO event listeners
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // You can handle various socket events here
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

app.listen(5000, () => {
 console.log("App is running");
});
app.use(express.json());
app.use(cors());

app.use('/api/products', productRoutes);
app.use('/api/auth', auth);
app.use('/api/tasks', tasks);
app.use('/api/auctions', auctionRoutes);
app.use('/api/bids', bidRoutes);
app.use((req, res, next) => {
  console.log('Request body:', req.body);
  next();
});
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());


const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    dob: { type: Date, required: true }
   });
   const Dummy = mongoose.model('Dummy', userSchema);

   mongoose.connect(process.env.MONGODB_URI, {
     serverApi: ServerApiVersion.v1
   }).then(() => {
     console.log('Mongoose connected to MongoDB');
   }).catch(error => {
     console.error('Mongoose connection error:', error);
   });
   
   app.get('/', async (req, res) => {
       try {
         res.send("Hello from GET with success");
       } catch (error) {
         res.send("Hello from GET with error");
       }
     });
   
     app.get('/users', async (req, res) => {
       try {
         const users = await Dummy.find(); // Find all users in the collection
         res.json(users); // Send the list of users as JSON
       } catch (error) {
         console.error('Error retrieving users:', error);
         res.status(500).send("Error retrieving users");
       }
     });
   
     app.post('/users', async (req, res) => {
       try {
         const { name, email, age, dob } = req.body;
         
         // Create a new user instance
         const user = new Dummy({
           name,
           email,
           age,
           dob: new Date(dob) // Convert string to Date object
         });
         
         // Save the user to the database
         const result = await Dummy.save();
         console.log('User created:', result);
         res.status(201).json(result); // Return the created user
       } catch (error) {
         console.error('Error creating user:', error);
         res.status(400).send("Error creating user");
       }
     });