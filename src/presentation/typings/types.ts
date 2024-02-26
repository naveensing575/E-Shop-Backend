import { Request } from "express";
import * as admin from "firebase-admin";

export default interface CustomRequest extends Request {
  user?: admin.auth.DecodedIdToken;
  uid?: string;
  extractedUser?: {
    userId: number;
    uid: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
  };
}
