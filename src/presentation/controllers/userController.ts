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

export { registerUser, loginUserHandler };
