import {
  Auth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  UserCredential,
} from "firebase/auth";
import { auth } from "@/app/lib/firebase/clientApp";

export class AuthService {
  private auth: Auth;
  private googleProvider: GoogleAuthProvider;
  private appleProvider: OAuthProvider;
  private static instance: AuthService | null = null;

  private constructor() {
    this.auth = auth;
    this.googleProvider = new GoogleAuthProvider();
    this.appleProvider = new OAuthProvider("apple.com");
    this.appleProvider.addScope("email");
    this.appleProvider.addScope("name");

    // Optional: Add additional Google scopes if needed
    this.googleProvider.addScope(
      "https://www.googleapis.com/auth/userinfo.email"
    );
    this.googleProvider.addScope(
      "https://www.googleapis.com/auth/userinfo.profile"
    );
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async verifyAdminAccess(): Promise<boolean> {
    const user = this.auth.currentUser;
    if (!user) return false;

    const idTokenResult = await user.getIdTokenResult();
    return idTokenResult.claims.isAdmin === true;
  }

  // public async signInWithGoogle(): Promise<UserCredential> {
  //   try {
  //     const result = await signInWithPopup(this.auth, this.googleProvider);
  //     const isAdmin = await this.verifyAdminAccess();
  //     if (!isAdmin) {
  //       await this.signOut();
  //       throw new Error("Unauthorized: Admin access required");
  //     }
  //     return result;
  //   } catch (error) {
  //     throw new Error("Something went wrong");
  //   }
  // }

  public async signInWithGoogle(): Promise<UserCredential> {
    return signInWithPopup(this.auth, this.googleProvider)
      .then(async (result) => {
        const user = result.user;
        const idTokenResult = await user.getIdTokenResult();

        if (!idTokenResult.claims.isAdmin) {
          await this.signOut();
          throw new Error("Unauthorized access");
        }

        return result;
      })
      .catch((error) => {
        if (error.message === "Unauthorized access") {
          throw error;
        }
        throw new Error("Something went wrong");
      });
  }

  public async signInEmailAndPassword(
    email: string,
    password: string
  ): Promise<UserCredential> {
    try {
      const result = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  public async signInWithApple(): Promise<UserCredential> {
    try {
      const result = await signInWithPopup(this.auth, this.appleProvider);
      return result;
    } catch (error) {
      throw error;
    }
  }

  public getCurrentUser() {
    return this.auth.currentUser;
  }

  public async signOut(): Promise<void> {
    try {
      await this.auth.signOut();
    } catch (error) {
      throw error;
    }
  }
}
