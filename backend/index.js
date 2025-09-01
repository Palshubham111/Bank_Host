import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import sbiRoute from "./routes/sbi.route.js"
import sbiData from "./routes/sbidata.route.js"
import userRoute from "./routes/user.route.js"
import userRoutes from './routes/user.routes.js';

// Load environment variables first
dotenv.config();

const app = express();

// Middleware setup with more permissive CORS
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Increase payload size limit for file uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 9006;
const URI = process.env.MongoDBURI || 'mongodb://localhost:27017/sbi';

// Test endpoint with detailed response
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend server is running',
    timestamp: new Date().toISOString(),
    status: 'ok'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    status: 'ok',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// MongoDB Connection with better error handling
mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of 30s
})
.then(() => {
  console.log("Connected to MongoDB");
})
.catch((error) => {
  console.error("MongoDB connection error:", error);
  process.exit(1);
});

// MongoDB connection events
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});

// Routes
app.use("/sbi", sbiRoute);
app.use("/api/sbidata", sbiData);
app.use("/user", userRoute);

app.use('/user', userRoutes);

// 404 handler with detailed response
app.use((req, res) => {
  res.status(404).json({ message: '404 - API Endpoint Not Found' });

});

app.get('/', (req, res) => {

  res.send({
    activestatus:true,
    error:false,
  })

})

// Error handling middleware with detailed logging
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ message: 'Internal Server Error' });
});



// Start server with error handling
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Test the server at http://localhost:${PORT}/api/test`);
  console.log(`Health check at http://localhost:${PORT}/health`);
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please try a different port.`);
    process.exit(1);
  } else {
    console.error('Server error:', error);
  }
});

