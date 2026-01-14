
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    // Update ALL users to admin
    db.run("UPDATE users SET role = 'admin'", function (err) {
        if (err) {
            console.error("Error updating users:", err.message);
        } else {
            console.log(`Updated ${this.changes} user(s) to ADMIN role.`);
        }
    });

    // Verify
    db.all("SELECT id, email, role FROM users", (err, rows) => {
        if (err) console.error("Verify Error:", err);
        else console.log("Current Users:", JSON.stringify(rows));
    });
});

db.close();
