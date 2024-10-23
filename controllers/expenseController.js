const Expense = require('../models/Expense');
const { validateExpense } = require('../utils/validation');
const socketService = require('../services/socketService');

exports.addExpense = async (req, res, next) => {
  try {
    const { error } = validateExpense(req.body);
    if (error) return res.status(400).json({ 
      success: false, 
      message: error.details[0].message 
    });

    const expense = new Expense({
      ...req.body,
      paidBy: req.user._id,
    });

    await expense.save();

    // Populate the expense with user details for real-time update
    const populatedExpense = await Expense.findById(expense._id)
      .populate('paidBy', 'name email')
      .populate('participants.user', 'name email');

    // Emit real-time update using socket service
    const io = req.app.get('io');
    socketService.emitExpenseUpdate(io, populatedExpense);

    res.status(201).json({ 
      success: true, 
      message: 'Expense added successfully',
      data: populatedExpense
    });
  } catch (error) {
    next(error);
  }
};

exports.getExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.find({
      $or: [
        { paidBy: req.user._id },
        { 'participants.user': req.user._id }
      ]
    })
    .populate('paidBy', 'name email')
    .populate('participants.user', 'name email')
    .sort({ date: -1 }); // Latest expenses first
    
    res.json({ 
      success: true, 
      message: 'Expenses retrieved successfully',
      data: expenses
    });
  } catch (error) {
    next(error);
  }
};

exports.getExpenseById = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id)
      .populate('paidBy', 'name email')
      .populate('participants.user', 'name email');
    
    if (!expense) {
      return res.status(404).json({ 
        success: false, 
        message: 'Expense not found'
      });
    }

    res.json({ 
      success: true, 
      message: 'Expense retrieved successfully',
      data: expense
    });
  } catch (error) {
    next(error);
  }
};