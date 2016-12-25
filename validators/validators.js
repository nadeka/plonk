'use strict';

let Joi = require('joi');

module.exports = {
  user: Joi.object({
    name: Joi.string().alphanum().min(1).max(30).required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{1,100}$/).required()
  }),
  message: Joi.object({
    userid: Joi.number().required(),
    channelid: Joi.number().required(),
    sender: Joi.string().required(),
    content: Joi.string().required().min(1).max(3000)
  }),
  channel: Joi.object({
    name: Joi.string().alphanum().min(1).max(30).required(),
    creatorid: Joi.number().required(),
    private: Joi.boolean().required()
  }),
  joiningUser: Joi.object({
    userid: Joi.number().required()
  })
};
