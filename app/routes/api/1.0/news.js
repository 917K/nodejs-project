var router = require('express').Router();
var news = require('./../../../controllers/api/1.0/news');

// =====================================
// GET ALL ========
// =====================================
router.get('/', news.getAll);

// =====================================
// GET BY ID ===========================
// =====================================
router.get('/:id', news.getById);

module.exports = router;