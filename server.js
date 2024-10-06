const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000; // Використання PORT з середовища або 3000 за замовчуванням

// Middleware to parse JSON
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Path to the SQLite database file
const DB_PATH = path.join(__dirname, 'database.db'); // Використовуйте файл бази даних для збереження даних

// Якщо потрібно очистити базу даних при кожному запуску сервера, раскоментуйте цей код
if (fs.existsSync(DB_PATH)) { fs.unlinkSync(DB_PATH); }

// Ініціалізація бази даних SQLite
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error("Error opening database " + err.message);
    }
});

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT)"); // Додано IF NOT EXISTS

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

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
