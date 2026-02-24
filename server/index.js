const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

// MySQL Connection
const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err);
  } else {
    console.log("✅ Connected to MySQL database");
    connection.release();
  }
});


// Insert User
app.post("/users", (req, res) => {
  const { name, reg_no, dept, year, mail } = req.body;

  if (!name || !reg_no || !dept || !year || !mail) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const sql =
    "INSERT INTO users (name, reg_no, dept, year, mail) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [name, reg_no, dept, year, mail], (err, result) => {
    if (err) {
      console.error("Error inserting user:", err);
      return res.status(500).json({ error: "Failed to insert user" });
    }
    res.json({
      message: "User added successfully",
      userId: result.insertId,
    });
  });
});

// Fetch users
app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, result) => {
    if (err) {
      console.error("❌ Error fetching users:", err);
      return res.status(500).json({ error: "Failed to fetch users" });
    }
    res.json(result);
  });
});

// Delete user
app.delete("/users/:id", (req, res) => {
  db.query("DELETE FROM users WHERE id = ?", [req.params.id], (err) => {
    if (err) {
      console.error("❌ Error deleting user:", err);
      return res.status(500).json({ error: "Failed to delete user" });
    }
    res.json({ message: "User deleted successfully" });
  });
});

// Update user
app.patch("/users/:id", (req, res) => {
  const { name, reg_no, dept, year, mail } = req.body;
  const sql =
    "UPDATE users SET name = ?, reg_no = ?, dept = ?, year = ?, mail = ? WHERE id = ?";

  db.query(
    sql,
    [name, reg_no, dept, year, mail, req.params.id],
    (err) => {
      if (err) {
        console.error("Error updating user:", err);
        return res.status(500).json({ error: "Failed to update user" });
      }
      res.json({ message: "User updated successfully" });
    }
  );
});

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, "dist")));

// Catch-all route to serve the frontend for any non-API requests
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

