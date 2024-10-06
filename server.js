// server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize SQLite Database
const db = new sqlite3.Database(':memory:'); // Use ':memory:' for a temporary database
//'./database.db'
// Path to the SQLite database file const
// DB_PATH = path.join(__dirname, 'database.db'); // If you want to refresh (clear) the database on every server start
// if (fs.existsSync(DB_PATH)) { fs.unlinkSync(DB_PATH); }
//
//
// // Initialize SQLite Database
// const db = new sqlite3.Database(DB_PATH); // Use file-based DB for persistence
db.serialize(() => {
    db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)");

    const stmt = db.prepare("INSERT INTO users (name) VALUES (?)");
    stmt.run("Alice");
    stmt.run("Bob");
    stmt.finalize();
});

// API endpoint to get users
app.get('/api/users', (req, res) => {
    db.all("SELECT * FROM users", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
