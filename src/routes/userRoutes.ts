import express from "express";
import { registerUser, loginUserHandler, logoutUserHandler } from "../controllers/userController";
import authenticate from "../middlewares/authMiddleware";

const router = express.Router();

// Define the registration route
router.post("/register", registerUser);

// Define the login route
router.post("/login", loginUserHandler);

//Define the logout route
router.post("/logout", logoutUserHandler);


export default router;
