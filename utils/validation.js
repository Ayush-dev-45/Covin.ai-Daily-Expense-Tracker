const Joi = require('joi');

exports.validateUser = (user) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().required(),
    mobileNumber: Joi.string().required(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(user);
};

exports.validateExpense = (expense) => {
  const schema = Joi.object({
    description: Joi.string().required(),
    amount: Joi.number().min(0).required(),
    splitType: Joi.string().valid('equal', 'exact', 'percentage').required(),
    participants: Joi.array().items(
      Joi.object({
        user: Joi.string().required(),
        share: Joi.number().min(0).required(),
      })
    ).min(2).required(),
  });

  return schema.validate(expense);
};