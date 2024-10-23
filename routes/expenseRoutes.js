const express = require('express');
const expenseController = require('../controllers/expenseController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, expenseController.addExpense);
router.get('/', auth, expenseController.getExpenses);
router.get('/:id', auth, expenseController.getExpenseById);

module.exports = router;