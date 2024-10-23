module.exports = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ 
      success: false, 
      message: err.message 
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid ID format'
    });
  }

  res.status(500).json({ 
    success: false, 
    message: 'Internal server error'
  });
};