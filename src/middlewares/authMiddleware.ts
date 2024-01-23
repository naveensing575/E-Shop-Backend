import { Request, Response, NextFunction } from "express";
import {firebaseAdmin} from "../config/firebaseAdmin";

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return res
      .status(401)
      .json({ error: "Unauthorized - Missing Authorization Header" });
  }

  const token = authorizationHeader.split(" ")[1];

  try {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
    req.user = decodedToken; 
    next();
  } catch (error) {
    console.error("Error verifying Firebase token:", error);
    return res.status(403).json({ error: "Forbidden - Invalid Token" });
  }
};

export default authenticate;
