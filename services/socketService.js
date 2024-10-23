const socketService = {
  emitExpenseUpdate: (io, expense) => {
    // Emit to all participants
    expense.participants.forEach(participant => {
      io.to(`user-${participant.user}`).emit('expense-update', {
        type: 'NEW_EXPENSE',
        message: 'New expense added',
        expense: expense
      });
    });

    // Also emit to the person who paid
    io.to(`user-${expense.paidBy}`).emit('expense-update', {
      type: 'NEW_EXPENSE',
      message: 'New expense added',
      expense: expense
    });
  },

  emitBalanceUpdate: (io, userId, balanceSheet) => {
    io.to(`user-${userId}`).emit('balance-update', {
      type: 'BALANCE_UPDATED',
      message: 'Balance sheet updated',
      balanceSheet: balanceSheet
    });
  }
};

module.exports = socketService;