import { DeepPartial } from "typeorm";
import { User } from "../entity/User";
import { AppDataSource } from "..";

export class UserService {
  static async getUsers() {
    return AppDataSource.getRepository(User).find();
  }

  static async createUser(user: DeepPartial<User>) {
    const isInvalid = this.isInvalid(user);
    if (isInvalid) {
      return { error: isInvalid.error, status: 400 };
    }

    try {
      return await AppDataSource.getRepository(User).save(user);
    } catch (err) {
      return { error: "Error saving post", status: 500 };
    }
  }

  // TODO: Implement body validation, ex: zod or express-validator.
  private static isInvalid(user: DeepPartial<User>) {
    user = this.trim(user);

    const fNameLength = user.firstName?.length || 0;
    const lNameLength = user.lastName?.length || 0;
    const emailLength = user.email?.length || 0;

    const isEmailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email || "");

    if (fNameLength === 0 || fNameLength > 100) {
      return {
        error: "User is required and must be between 1 and 100 characters",
      };
    }

    if (lNameLength === 0 || lNameLength > 100) {
      return {
        error: "Description is required and must be between 1 and 100 characte",
      };
    }

    if (emailLength === 0 || emailLength > 100) {
      return {
        error: "Email is required and must be between 1 and 100 characters",
      };
    }

    if (!isEmailFormat) {
      return { error: "Email is not in the correct format" };
    }

    return false;
  }

  private static trim(user: DeepPartial<User>) {
    user.firstName = user.firstName?.trim();
    user.lastName = user.lastName?.trim();
    user.email = user.email?.trim();

    return user;
  }
}
