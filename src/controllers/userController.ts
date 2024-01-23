import { Request, Response } from 'express';
import userService from '../services/userServices';

const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, dateOfBirth, address, phoneNo } = req.body;

    // Call the registerUser service
    const user = await userService.registerUser(email, password, firstName, lastName, dateOfBirth, address, phoneNo);

    return res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const loginUserHandler = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;

    // Call the validateUserToken service
    await userService.validateUserToken(idToken);

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
    const uid = req.body.uid;

    if (!uid) {
      return res.status(400).json({ error: 'Missing user ID' });
    }

    // Call the logoutUser service
    await userService.logoutUser(uid);

    return res.status(200).json({ message: 'User logged out successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to log out user' });
  }
};

export { registerUser, loginUserHandler, logoutUserHandler };
