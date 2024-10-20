import express from "express"
import auth from './routes/auth.js';
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
import swaggerJsdoc from'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
config(); //load env variables
const app = express();

// Create HTTP server
const server = http.createServer(app);

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Auction API',
      version: '1.0.0',
      description: 'API documentation for Auction system',
    },
    servers: [
      {
        url: 'http://localhost:5000/api', // replace with your API base URL
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT', 
        },
      },
    },
    security: [
      {
        bearerAuth: [], 
      },
    ],
  },
  apis: ['./routes/*.js'], 
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);

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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Serve the Swagger JSON specification
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});
app.use('/api/auth', auth);
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


   mongoose.connect(process.env.MONGODB_URI, {
     serverApi: ServerApiVersion.v1
   }).then(() => {
     console.log('Mongoose connected to MongoDB');
   }).catch(error => {
     console.error('Mongoose connection error:', error);
   });
   
   app.get('/', async (req, res) => {
       try {
         res.send("Hello from API with success");
       } catch (error) {
         res.send("Hello from API with error");
       }
     });
   