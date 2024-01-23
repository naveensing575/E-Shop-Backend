import { Request, Response } from 'express';
import userService from '../services/userServices';

const registerUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.registerUser(req.body);

    return res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export default registerUser;

const loginUserHandler = async (req: Request, res: Response) => {
  try {
    // Send the entire req.body object to the validateUserToken service
    await userService.validateUserToken(req.body);

    return res.status(200).json({
      message: 'User logged in successfully',
    });
  } catch (error) {
    console.error(error);

    return res.status(401).json({ error: 'Invalid ID token' });
  }
};

const logoutUserHandler = async (req: Request, res: Response) => {
  try {
    const { uid } = req.body;

    if (!uid) {
      return res.status(400).json({ error: 'Missing user ID' });
    }

    // Send the entire req.body object to the logoutUser service
    await userService.logoutUser(req.body);

    return res.status(200).json({ message: 'User logged out successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to log out user' });
  }
};

export { registerUser, loginUserHandler, logoutUserHandler };
