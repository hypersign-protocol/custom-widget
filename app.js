const express = require('express');
const path = require('path');

const app = express();
const PORT = 3007;

// Serve static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

// Explicit route for index.html (optional but clear)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
