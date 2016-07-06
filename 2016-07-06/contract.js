var Contract = require('consumer-contracts').Contract,
    Joi = require('consumer-contracts').Joi


module.exports = new Contract({
  name: 'A friendly greet',
  consumer: 'conversation-starter',
  request: {
    method: 'GET',
    url: 'http://localhost:3000/greet'
  },
  response: {
    statusCode: 200,
    body: Joi.string().valid('hello!')
  }
});
