import User from "../models/User.js";
import Task from "../models/Task.js";
import bcrypt from "bcrypt";
import logger from "../utils/logger.js";

// GET ALL USERS (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    logger.error(`Failed to fetch users: ${error.message}`);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// PROMOTE USER TO ADMIN (admin must enter their own password)
export const promoteUser = async (req, res) => {
  try {
    const adminId = req.user._id;
    const targetUserId = req.params.id;
    const { password } = req.body;

    if (!password) {
      logger.error(`Promote user failed - password missing (admin ${adminId})`);
      return res.status(400).json({ message: "Password is required" });
    }

    if (adminId.toString() === targetUserId) {
      logger.error(`Promote user failed - admin tried to promote themselves (${adminId})`);
      return res.status(400).json({ message: "Admins cannot promote themselves" });
    }

    const admin = await User.findById(adminId).select("+password");
    if (!admin) {
      logger.error(`Promote user failed - admin not found: ${adminId}`);
      return res.status(404).json({ message: "Admin not found" });
    }

    const correct = await bcrypt.compare(password, admin.password);
    if (!correct) {
      logger.error(`Promote user failed - wrong password for admin: ${adminId}`);
      return res.status(401).json({ message: "Wrong password" });
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      logger.error(`Promote user failed - target user not found: ${targetUserId}`);
      return res.status(404).json({ message: "User not found" });
    }

    if (targetUser.role === "admin") {
      logger.error(`Promote user failed - target is already admin: ${targetUserId}`);
      return res.status(400).json({ message: "User is already admin" });
    }

    const updated = await User.findByIdAndUpdate(
      targetUserId,
      { role: "admin" },
      { new: true }
    ).select("-password");

    return res.json({
      message: "User promoted successfully",
      user: updated,
    });

  } catch (error) {
    logger.error(`Promote user error: ${error.message}`);
    res.status(500).json({ message: "Failed to promote user" });
  }
};

// DELETE USER + tasks
export const deleteUser = async (req, res) => {
  try {
    const targetUserId = req.params.id;

    await User.findByIdAndDelete(targetUserId);
    await Task.deleteMany({ user: targetUserId });

    res.json({ message: "User deleted" });
  } catch (error) {
    logger.error(`Failed to delete user ${req.params.id}: ${error.message}`);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

// GET TASKS OF SPECIFIC USER
export const getUserTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.params.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    logger.error(`Failed to fetch tasks for user ${req.params.id}: ${error.message}`);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};
