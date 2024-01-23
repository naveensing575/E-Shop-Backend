import { User } from "firebase-admin";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
