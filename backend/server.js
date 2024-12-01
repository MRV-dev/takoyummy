require('dotenv').config();

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const account = require('./models/userModel')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/users')
const ingredientsRoutes = require('./routes/ingredientsRoutes')
const posRoutes = require('./routes/posRoutes')
const salesRoutes = require('./routes/sales')

const app = express()

// Middleware
app.use(express.json())
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors({
    origin: 'http://127.0.0.1:5504',  
    methods: ['GET', 'POST'],  
    allowedHeaders: ['Content-Type'],        
    credentials: true    
}))

// Database connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        account.init().catch((error) => {
            console.error('Error initializing account model:', error.message);
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
    });

// Routes
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/ingredients', ingredientsRoutes)
app.use('/api/pos', posRoutes)
app.use('/api/v1/sales', salesRoutes)

// Start the server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
