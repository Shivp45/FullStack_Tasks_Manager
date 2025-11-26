import Task from '../models/Task.js';
import { createTaskSchema, updateTaskSchema } from '../validators/taskValidator.js';
import logger from '../utils/logger.js';

export const createTask = async (req, res, next) => {
  try {
    const { error } = createTaskSchema.validate(req.body);
    if (error) {
      logger.error(`Create task validation failed for user ${req.user._id}: ${error.details[0].message}`);
      return res.status(400).json({ message: error.details[0].message });
    }

    const task = await Task.create({ ...req.body, user: req.user._id });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

export const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

export const getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) {
      logger.error(`Get task failed - task not found: ${req.params.id} (user ${req.user._id})`);
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (err) {
    next(err);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { error } = updateTaskSchema.validate(req.body);
    if (error) {
      logger.error(`Update task validation failed for user ${req.user._id}: ${error.details[0].message}`);
      return res.status(400).json({ message: error.details[0].message });
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $set: req.body },
      { new: true }
    );

    if (!task) {
      logger.error(`Update task failed - task not found: ${req.params.id} (user ${req.user._id})`);
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (err) {
    next(err);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) {
      logger.error(`Delete task failed - task not found: ${req.params.id} (user ${req.user._id})`);
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted' });
  } catch (err) {
    next(err);
  }
};
