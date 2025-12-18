import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.get(
  "/recruiter-only",
  authenticate,
  authorizeRoles("RECRUITER"),
  (req, res) => {
    res.json({
      message: "Welcome recruiter",
      user: req.user,
    });
  }
);

export default router;
