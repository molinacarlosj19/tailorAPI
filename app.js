const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const authRoutes = require('./routes/authRoutes'); 
const productRoutes = require('./routes/productRoutes');
const productOrderRoutes = require('./routes/productOrderRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const invoiceLineItemRoutes = require('./routes/invoiceLineItemRoutes');
const authMiddleware = require('./middlewares/authMiddleware');

const { expressjwt: jwt } = require('express-jwt');

const app = express();

// Middleware setup
app.use(bodyParser.json());
app.use(helmet());
app.use(cors({
    origin: 'http://localhost:4000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// JWT Authentication middleware
const jwtCheck = jwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256']
});

// Protect routes with JWT middleware
app.use('/api', jwtCheck);

// Routes
app.use('/auth', authRoutes); 
app.use('/api/products', productRoutes);
app.use('/api/product-orders', productOrderRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/invoice-line-items', invoiceLineItemRoutes);

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack); // Detailed error stack logging
    res.status(err.status || 500).json({
        message: 'Something went wrong!',
        error: err.message, // Provide error message
        stack: err.stack // Provide stack trace for debugging
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
