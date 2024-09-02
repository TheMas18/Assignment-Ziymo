require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();
app.use(express.json());
app.use(cors());
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
        return;
    }
    console.log('Connected to MySQL Database');
});

// Get all products with pagination
app.get('/products', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
        const [rows] = await db.promise().query('SELECT * FROM products LIMIT ? OFFSET ?', [limit, offset]);
        const [[{ count }]] = await db.promise().query('SELECT COUNT(*) as count FROM products');

        res.json({
            products: rows,
            totalProducts: count,
            currentPage: page,
            totalPages: Math.ceil(count / limit),
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Get product by ID
app.get('/products/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM products WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) return res.status(404).json({ message: 'Product not found' });
        res.json(result[0]);
    });
});

// Add a new product
app.post('/products', (req, res) => {
    const { name, description, price, category, image_url } = req.body;
    const sql = 'INSERT INTO products (name, description, price, category, image_url) VALUES (?, ?, ?, ?, ?)';

    db.query(sql, [name, description, price, category, image_url], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Product added successfully', productId: result.insertId });
    });
});

// Update a product
app.put('/products/:id', (req, res) => {
    const { id } = req.params;
    const { name, description, price, category, image_url } = req.body;
    const sql = 'UPDATE products SET name = ?, description = ?, price = ?, category = ?, image_url = ? WHERE id = ?';

    db.query(sql, [name, description, price, category, image_url, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Product updated successfully' });
    });
});

// Delete a product
app.delete('/products/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM products WHERE id = ?';

    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Product deleted successfully' });
    });
});

// Search products
app.get('/search', (req, res) => {
    const { keyword, category } = req.query;
    let sql = 'SELECT * FROM products WHERE 1=1';
    let params = [];

    if (keyword) {
        sql += ' AND name LIKE ?';
        params.push(`%${keyword}%`);
    }

    if (category) {
        sql += ' AND category = ?';
        params.push(category);
    }

    db.query(sql, params, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ products: result });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
