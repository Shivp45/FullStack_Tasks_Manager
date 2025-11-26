import Joi from 'joi';

export const createTaskSchema = Joi.object({
  title: Joi.string().min(1).required(),
  description: Joi.string().allow('', null),
  completed: Joi.boolean().optional()
});

export const updateTaskSchema = Joi.object({
  title: Joi.string().min(1).optional(),
  description: Joi.string().allow('', null).optional(),
  completed: Joi.boolean().optional()
});
