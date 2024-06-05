const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const { expressjwt: jwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const productRoutes = require('./routes/productRoutes');
const productOrderRoutes = require('./routes/productOrderRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const invoiceLineItemRoutes = require('./routes/invoiceLineItemRoutes');

const app = express();

app.use(bodyParser.json());
app.use(helmet()); // Adds security headers
app.use(cors({ origin: 'http://your-frontend-domain.com' })); // Adjust the origin as needed

// JWT Authentication middleware
const jwtCheck = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: 'https://your-auth-domain/.well-known/jwks.json' // Replace with your JWKS URL
    }),
    audience: 'your-api-audience',
    issuer: 'https://your-auth-domain/',
    algorithms: ['RS256']
});

// Protect routes with JWT middleware
app.use('/api', jwtCheck);

app.use('/api/products', productRoutes);
app.use('/api/product-orders', productOrderRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/invoice-line-items', invoiceLineItemRoutes);

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
