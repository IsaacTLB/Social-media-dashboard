import express from "express";
import { Register, Login, Logout } from "../controllers/auth.js"; // Make sure to import Login and Logout functions
import Validate from "../middleware/validate.js";
import { check } from "express-validator";

const router = express.Router();

// Register route -- POST request
router.post(
  "/v1/signup",
  check("email")
    .isEmail()
    .withMessage("Enter a valid email address")
    .normalizeEmail(),
  check("first_name")
    .not()
    .isEmpty()
    .withMessage("Your first name is required")
    .trim()
    .escape(),
  check("last_name")
    .not()
    .isEmpty()
    .withMessage("Your last name is required")
    .trim()
    .escape(),
  check("password")
    .notEmpty()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  Validate,
  Register
);

// Login route -- POST request
router.post(
  "/v1/login",
  check("email")
    .isEmail()
    .withMessage("Enter a valid email address")
    .normalizeEmail(),
  check("password").not().isEmpty(),
  Validate,
  Login
);

// Logout route -- GET request
router.get("/v1/logout", Logout);

export default router;
