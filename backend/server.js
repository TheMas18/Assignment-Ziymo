require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const app = express();

app.use(express.json());
app.use(cors());

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});


app.get('/products', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const offset = (page - 1) * limit;
    const searchTerm = req.query.searchTerm || '';
    const category = req.query.category || '';

    try {
        let sql = 'SELECT * FROM products WHERE 1=1';
        let params = [];

        if (searchTerm) {
            sql += ' AND (name LIKE ? OR category LIKE ?)';
            params.push(`%${searchTerm}%`, `%${searchTerm}%`);
        }

        if (category) {
            sql += ' AND category = ?';
            params.push(category);
        }

        sql += ' LIMIT ? OFFSET ?';
        params.push(limit, offset);

        const [products] = await db.query(sql, params);
        const [[{ count }]] = await db.query('SELECT COUNT(*) as count FROM products WHERE 1=1' + (searchTerm ? ' AND (name LIKE ? OR category LIKE ?)' : '') + (category ? ' AND category = ?' : ''), searchTerm ? (category ? [searchTerm, searchTerm, category] : [searchTerm, searchTerm]) : (category ? [category] : []));

        res.json({
            products,
            totalProducts: count,
            currentPage: page,
            totalPages: Math.ceil(count / limit),
        });
    } catch (err) {
        console.error('Error fetching products:', err.message);
        res.status(500).send('Server error');
    }
});



app.get('/products/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query('SELECT * FROM products WHERE id = ?', [id]);

        if (result.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(result[0]);
    } catch (err) {
        console.error('Error fetching product:', err.message);
        res.status(500).json({ error: err.message });
    }
});


app.post('/products', async (req, res) => {
    const { name, description, price, category, image_url } = req.body;

    try {
        const [result] = await db.query(
            'INSERT INTO products (name, description, price, category, image_url) VALUES (?, ?, ?, ?, ?)',
            [name, description, price, category, image_url]
        );

        res.status(201).json({ message: 'Product added successfully', productId: result.insertId });
    } catch (err) {
        console.error('Error adding product:', err.message);
        res.status(500).json({ error: err.message });
    }
});


app.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, price, category, image_url } = req.body;

    try {
        const [result] = await db.query(
            'UPDATE products SET name = ?, description = ?, price = ?, category = ?, image_url = ? WHERE id = ?',
            [name, description, price, category, image_url, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Product updated successfully' });
    } catch (err) {
        console.error('Error updating product:', err.message);
        res.status(500).json({ error: err.message });
    }
});


app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query('DELETE FROM products WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        console.error('Error deleting product:', err.message);
        res.status(500).json({ error: err.message });
    }
});


app.get('/search', async (req, res) => {
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

    try {
        const [result] = await db.query(sql, params);
        res.json({ products: result });
    } catch (err) {
        console.error('Error searching products:', err.message);
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
