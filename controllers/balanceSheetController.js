const Expense = require('../models/Expense');
const PDFDocument = require('pdfkit');
const socketService = require('../services/socketService');

exports.getBalanceSheet = async (req, res, next) => {
  try {
    const expenses = await Expense.find({
      $or: [
        { paidBy: req.user._id },
        { 'participants.user': req.user._id }
      ]
    })
    .populate('paidBy', 'name email')
    .populate('participants.user', 'name email');

    const balanceSheet = calculateBalanceSheet(expenses, req.user._id);

    // Emit real-time balance update
    const io = req.app.get('io');
    socketService.emitBalanceUpdate(io, req.user._id, balanceSheet);

    res.json({ 
      success: true, 
      message: 'Balance sheet retrieved successfully',
      data: balanceSheet
    });
  } catch (error) {
    next(error);
  }
};

exports.downloadBalanceSheet = async (req, res, next) => {
  try {
    const expenses = await Expense.find({
      $or: [
        { paidBy: req.user._id },
        { 'participants.user': req.user._id }
      ]
    })
    .populate('paidBy', 'name email')
    .populate('participants.user', 'name email');

    const balanceSheet = calculateBalanceSheet(expenses, req.user._id);

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=balance-sheet.pdf');

    doc.pipe(res);
    generatePDF(doc, balanceSheet);
    doc.end();
  } catch (error) {
    next(error);
  }
};

function calculateBalanceSheet(expenses, userId) {
  const balances = {};

  expenses.forEach(expense => {
    const paidBy = expense.paidBy._id.toString();
    const totalAmount = expense.amount;

    expense.participants.forEach(participant => {
      const participantId = participant.user._id.toString();
      const share = participant.share;

      if (participantId === paidBy) {
        balances[participantId] = (balances[participantId] || 0) + (totalAmount - share);
      } else {
        balances[participantId] = (balances[participantId] || 0) - share;
        balances[paidBy] = (balances[paidBy] || 0) + share;
      }
    });
  });

  return balances;
}

function generatePDF(doc, balanceSheet) {
  doc.fontSize(18).text('Balance Sheet', { align: 'center' });
  doc.moveDown();

  Object.entries(balanceSheet).forEach(([userId, balance]) => {
    const text = `User ${userId}: ${balance >= 0 ? 'Owes' : 'Is owed'} $${Math.abs(balance).toFixed(2)}`;
    doc.fontSize(12).text(text);
  });
}