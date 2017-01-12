'use strict';

let Joi = require('joi');

module.exports = {
  user: Joi.object({
    name: Joi.string().alphanum().min(1).max(30).required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{1,100}$/).required()
  }),
  message: Joi.object({
    content: Joi.string().required().min(1).max(3000)
  }),
  channel: Joi.object({
    name: Joi.string().alphanum().min(1).max(30).required(),
    private: Joi.boolean().required()
  }),
  id: Joi.number().min(1).max(9999999),
  invitation: Joi.object({
    inviteename: Joi.string().alphanum().min(1).max(30).required(),
    message: Joi.string().min(1).max(3000).optional()
  })
};
