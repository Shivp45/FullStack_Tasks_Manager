import express from "express";
import auth from "../middleware/auth.js";
import authorize from "../middleware/authorize.js";

import {
  getAllUsers,
  promoteUser,
  deleteUser,
  getUserTasks
} from "../controllers/userController.js";

const router = express.Router();

// Admin-only routes
router.get("/", auth, authorize("admin"), getAllUsers);
router.put("/:id/promote", auth, authorize("admin"), promoteUser);
router.delete("/:id", auth, authorize("admin"), deleteUser);
router.get("/:id/tasks", auth, authorize("admin"), getUserTasks);

export default router;
