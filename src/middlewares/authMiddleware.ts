import { Response, NextFunction } from "express";
import CustomRequest from "../typings/types";
import { firebaseAdmin } from "../config/firebaseAdmin";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const authenticate = async (
  req: CustomRequest,
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

    // Get the UID and find the corresponding user in Prisma
    const UID = decodedToken.uid;
    const extractedUser = await prisma.user.findUnique({
      where: { 
        uid:  UID
       },
    });

    if (!extractedUser) {
      throw new Error("User not found");
    }

    // Check if the user making the request has the same UID as the one from the token
    if (extractedUser.uid !== UID) {
      return res.status(403).json({ error: "Forbidden - Unauthorized User" });
    }

    req.extractedUser = extractedUser;
    next();
  } catch (error) {
    console.error("Error verifying Firebase token:", error);
    return res.status(403).json({ error: "Forbidden - Invalid Token" });
  }
};

export default authenticate;

