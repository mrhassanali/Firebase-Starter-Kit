import { AuthService } from "../services/AuthService";
import { UserCredential } from "firebase/auth";

export class AuthController {
  private static instance: AuthController | null = null;
  private authService: AuthService;

  private constructor() {
    this.authService = AuthService.getInstance();
  }

  public static getInstance(): AuthController {
    if (!AuthController.instance) {
      AuthController.instance = new AuthController();
    }
    return AuthController.instance;
  }

  public async signInWithGoogle(): Promise<UserCredential> {
    try {
      return await this.authService.signInWithGoogle();
    } catch (error) {
      throw error;
    }
  }

  public async signInEmailAndPassword(
    email: string,
    password: string,
  ): Promise<UserCredential> {
    try {
      return await this.authService.signInEmailAndPassword(email, password);
    } catch (error) {
      throw error;
    }
  }

  public async signInWithApple(): Promise<UserCredential> {
    try {
      return await this.authService.signInWithApple();
    } catch (error) {
      throw error;
    }
  }

  public getCurrentUser() {
    return this.authService.getCurrentUser();
  }

  public async signOut(): Promise<void> {
    try {
      await this.authService.signOut();
    } catch (error) {
      throw error;
    }
  }
}
