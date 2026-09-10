const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// PostgreSQL connection
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,

    ssl: {
        rejectUnauthorized: false
    }
});

// Test database connection
app.get("/api/health", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");

        res.json({
            status: "OK",
            database: "Connected",
            time: result.rows[0].now
        });

    } catch (error) {
        console.error("Database connection error:", error.message);

        res.status(500).json({
            status: "ERROR",
            database: "Not connected",
            error: error.message
        });
    }
});

// Get all employees
app.get("/api/employees", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM employees ORDER BY id"
        );

        res.json(result.rows);

    } catch (error) {
        console.error("SELECT error:", error.message);

        res.status(500).json({
            error: "Failed to fetch employees"
        });
    }
});

// Add employee
app.post("/api/employees", async (req, res) => {

    const {
        name,
        role,
        department,
        email
    } = req.body;

    if (!name || !role || !department || !email) {
        return res.status(400).json({
            error: "All fields are required"
        });
    }

    try {

        const result = await pool.query(
            `INSERT INTO employees
            (name, role, department, email)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [
                name,
                role,
                department,
                email
            ]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {

        console.error("INSERT error:", error.message);

        res.status(500).json({
            error: "Failed to add employee"
        });
    }
});

// Serve frontend
app.use(express.static(path.join(__dirname, "../frontend")));

app.get("*", (req, res) => {
    res.sendFile(
        path.join(__dirname, "../frontend/index.html")
    );
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Employee application running on port ${PORT}`);
});