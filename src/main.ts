// Import required modules
import express from 'express'; // Express framework for building the server
import packageRoutes from './routes/packageRoutes'; // Import package-related routes
import path from 'path'; // Node.js path module for handling file paths
import dotenv from 'dotenv'; // Module for loading environment variables from .env file

// Load environment variables from .env file into process.env
dotenv.config();

// Create an Express application instance
const app = express();

// Set the port number from environment variable or default to 3000
const PORT = process.env.PORT || 3000;

/**
 * Middleware Setup
 */

// Parse incoming JSON requests and populate req.body
app.use(express.json());

// Serve static files from the 'public' directory
// This handles CSS, JS, images, etc. for the frontend
app.use(express.static(path.join(__dirname, '../public')));

/**
 * API Routes Configuration
 */

// Mount package-related routes under '/api' base path
// All package routes will be prefixed with '/api'
app.use('/api', packageRoutes);

/**
 * Frontend Handling
 * 
 * This catch-all route serves the frontend's index.html for any
 * route not handled by the API, enabling client-side routing
 */
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

/**
 * Start the Server
 */
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});