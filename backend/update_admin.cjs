
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

db.serialize(() => {
    db.run("UPDATE users SET role = 'admin' WHERE id = 1", function (err) {
        if (err) {
            console.error("Error updating user:", err.message);
        } else {
            console.log(`Row(s) updated: ${this.changes}`);
            console.log("User 1 has been manually promoted to ADMIN.");
        }
    });
});

db.close();
