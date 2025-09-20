import { User, IUser } from "../models/user.model";
import { logger } from "../utils/logger";
import { hash } from "bcrypt";

interface CreateUserData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: string;
}

export class UserService {
  async createUser(userData: CreateUserData): Promise<IUser> {
    try {
      const { password, ...rest } = userData;
      const passwordHash = await hash(password, 10);

      const user = await User.create({
        ...rest,
        passwordHash,
      });

      return user.toObject();
    } catch (error) {
      logger.error("Error creating user:", error);
      throw error;
    }
  }

  async getUserById(id: string): Promise<IUser | null> {
    try {
      const user = await User.findById(id).populate("role");
      return user ? user.toObject() : null;
    } catch (error) {
      logger.error("Error getting user by ID:", error);
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    try {
      const user = await User.findOne({ email }).populate("role");
      return user ? user.toObject() : null;
    } catch (error) {
      logger.error("Error getting user by email:", error);
      throw error;
    }
  }

  async updateUser(
    id: string,
    updateData: Partial<IUser>
  ): Promise<IUser | null> {
    try {
      // If password is being updated, hash it
      if ("password" in updateData) {
        const passwordHash = await hash(updateData.password as string, 10);
        delete updateData.password;
        updateData.passwordHash = passwordHash;
      }

      const user = await User.findByIdAndUpdate(id, updateData, {
        new: true,
      }).populate("role");
      return user ? user.toObject() : null;
    } catch (error) {
      logger.error("Error updating user:", error);
      throw error;
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      const result = await User.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      logger.error("Error deleting user:", error);
      throw error;
    }
  }
}
