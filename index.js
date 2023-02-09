const express = require('express');
require('dotenv').config();
const cors = require('cors');
const dbConnection = require('./db/config');

const PORT = process.env.PORT;

// Create Node server
const app = express();

// Database
dbConnection();

// cors
app.use( cors() )

// Public directory
app.use( express.static( 'public' ) );

// Read and parse configuration from body
app.use( express.json() );

// Routes
app.use('/api/auth', require('./routes/auth') );
// TODO: CRUD: Events
app.use('/api/events', require('./routes/events') );

// connect to reactapplication
app.get('*', (req, res) => {
    res.sendFile( __dirname + '/public/index.html');
})


// Listen port
app.listen( PORT, () => {
    console.log(`Server listening on port ${ PORT }`);
} );