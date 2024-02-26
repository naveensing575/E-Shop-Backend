import { User } from "./entities/User";

export interface UserRepository {
  registerUser(userData: User): Promise<User>;
}
