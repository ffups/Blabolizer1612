// filepath: backend/src/routes/exampleRoute.js
const express = require('express');
const { getExampleData } = require('../services/exampleService');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const data = await getExampleData();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;