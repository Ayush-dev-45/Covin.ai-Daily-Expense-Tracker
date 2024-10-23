const express = require('express');
const balanceSheetController = require('../controllers/balanceSheetController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, balanceSheetController.getBalanceSheet);
router.get('/download', auth, balanceSheetController.downloadBalanceSheet);

module.exports = router;