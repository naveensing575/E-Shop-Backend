import { Request } from "express";
import * as admin from "firebase-admin";

interface CustomRequest extends Request {
  user?: admin.auth.DecodedIdToken;
}

export default CustomRequest;
