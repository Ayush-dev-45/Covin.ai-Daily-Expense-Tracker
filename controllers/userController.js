const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validateUser } = require('../utils/validation');

exports.register = async (req, res, next) => {
  try {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const user = new User(req.body);
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.status(201).json({ 
      success: true, 
      message: 'User registered successfully',
      data: { user, token }
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ 
      success: true, 
      message: 'Login successful',
      data: { user, token }
    });
  } catch (error) {
    next(error);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    res.json({ 
      success: true, 
      message: 'Profile retrieved successfully',
      data: req.user
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}, '-password');
    res.json({ 
      success: true, 
      message: 'Users retrieved successfully',
      data: users
    });
  } catch (error) {
    next(error);
  }
};