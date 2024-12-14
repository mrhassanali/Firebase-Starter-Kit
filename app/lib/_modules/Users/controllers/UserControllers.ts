import { AddTags, UserModal } from "../models/UserModel";
import { UserService } from "../services/UserService";

export class UserController {
  private static instance: UserController | null = null;
  private userService: UserService;

  private constructor() {
    this.userService = UserService.getInstance();
  }

  public static getInstance(): UserController {
    if (!UserController.instance) {
      UserController.instance = new UserController();
    }
    return UserController.instance;
  }

  public async getPaginationUsers(pageNo: number): Promise<UserModal[]> {
    try {
      return await this.userService.getPaginationUsers(pageNo);
    } catch (e) {
      throw e;
    }
  }

  public async searchUsers({
    pageNo,
    searchQuery,
  }: {
    pageNo: number;
    searchQuery: string;
  }): Promise<UserModal[]> {
    try {
      return await this.userService.searchUsers(pageNo, searchQuery);
    } catch (e) {
      throw e;
    }
  }

  public async addTagToUserProfile({ userId, tag }: AddTags) {
    try {
      return await this.userService.addTagToUserProfile({ userId, tag });
    } catch (e) {
      throw e;
    }
  }

  public async removeTagFromUserProfile({
    userId,
    tagToRemove,
  }: {
    userId: string;
    tagToRemove: string;
  }) {
    try {
      return await this.userService.removeTagUserProfile(userId, tagToRemove);
    } catch (e) {
      throw e;
    }
  }
}
