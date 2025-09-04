// Dillon Koekemoer u23537052
const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Serve static files from frontend build
app.use(express.static(path.join(__dirname, '../public')));

// Example API endpoint
app.get('/api', (req, res) => {
    res.json({ message: 'hello from backend' });
});

// Catch-all handler: send back React's index.html for any unknown route
app.get('/{*any}', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
