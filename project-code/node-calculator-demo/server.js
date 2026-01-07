const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Route for the calculator page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint
app.get('/sample-api', (req, res) => {
    const data = [
        {
            "name": "Amit",
            "country": "India"
        },
        {
            "name": "John",
            "country": "United States"
        },
        {
            "name": "Rahul",
            "country": "India"
        },
        {
            "name": "Maria",
            "country": "Spain"
        },
        {
            "name": "Kenji",
            "country": "Japan"
        }
    ];
    res.json(data);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Calculator app is running on http://localhost:${PORT}`);
});
