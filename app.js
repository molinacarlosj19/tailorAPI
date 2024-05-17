// Import required modules
const express = require('express');
const bodyParser = require('body-parser');

const productRoutes = require('./routes/productRoutes');
const productOrderRoutes = require('./routes/productOrderRoutes');

// Create an instance of Express app
const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());


// Middleware to parse JSON request bodies
//app.use(express.json());

// Mount routes
app.use('/api/products', productRoutes);  // Mount product routes under /api/products
app.use('/api/product-orders', productOrderRoutes);  // Mount product order routes under /api/product-orders

// Sample route
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Sample API routes (you can define your own routes here)
app.get('/api/users', (req, res) => {
  // Logic to fetch users from database or any other source
  const users = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' }
  ];
  res.json(users);
});

app.post('/api/users', (req, res) => {
  // Logic to create a new user
  const newUser = req.body;
  // Assuming newUser is validated and saved to database
  res.status(201).json(newUser);
});


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Define a catch-all route for handling unknown endpoints
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
