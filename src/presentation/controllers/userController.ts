import { Request, Response } from 'express';
import UserService from '../../application/userServices'

const registerUser = async (req: Request, res: Response) => {
  try {
    const user = await UserService.registerUser(req.body);
    return res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const loginUserHandler = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({
      message: 'User logged in successfully',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const logoutUserHandler = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;

    if (!userId) {
      return res.status(400).json({ error: 'Missing user ID' });
    }

    // Call logoutUser service method with userId
    await UserService.logoutUser(userId);

    return res.status(200).json({ message: 'User logged out successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to log out user' });
  }
};

export { registerUser, loginUserHandler, logoutUserHandler };
