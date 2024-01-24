import express from "express";
import { registerUser, loginUserHandler, logoutUserHandler } from "../controllers/userController";
import authenticate from "../middlewares/authMiddleware";

const router = express.Router();

// Define the registration route
router.post("/register", registerUser);

// Define the login route, protected by the authentication middleware
router.post("/login", authenticate, loginUserHandler);

// Define the logout route, protected by the authentication middleware
router.post("/logout", authenticate, logoutUserHandler);

export default router;
