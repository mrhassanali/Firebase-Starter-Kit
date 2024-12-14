import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  OAuthProvider,
  onAuthStateChanged as _onAuthStateChanged,
  ActionCodeSettings,
  reauthenticateWithPopup,
  EmailAuthProvider,
  reauthenticateWithCredential,
  User,
  getAdditionalUserInfo,
} from "firebase/auth";

import { auth } from "@/app/lib/firebase/clientApp";
import { getFirebaseAuthErrorMessage } from "@/app/lib/utils/getFirebaseAuthErrorMessage";

export function onAuthStateChanged(cb: (user: any) => void) {
  return _onAuthStateChanged(auth, cb);
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);

    return {
      message: "Successfully signed in with Google",
      statusCode: 200,
      isNewUser: getAdditionalUserInfo(result)?.isNewUser ? true : false,
    };
  } catch (error: any) {
    return {
      message: getFirebaseAuthErrorMessage(error.code),
      statusCode: 401,
      success: false,
    };
  }
}

export async function signInEmailAndPassword(email: string, password: string) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    if (result) {
      return {
        message: "Successfully signed in with email and password",
        statusCode: 200,
        success: true,
      };
    }
  } catch (error: any) {
    return {
      message: getFirebaseAuthErrorMessage(error.code),
      statusCode: 401,
      success: false,
    };
  }
}

export async function sendEmailVerificationLink(user: any) {
  try {
    const actionCodeSettings: ActionCodeSettings = {
      url: "REDIRECT_VERIFICATION_LINK",
    };
    await sendEmailVerification(user, actionCodeSettings);
  } catch (error: any) {
    return {
      message: getFirebaseAuthErrorMessage(error.code),
      statusCode: 400,
      success: false,
    };
  }
}

export async function registerEmailPassword(email: string, password: string) {
  try {
    const result = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    ).then((userCredential) => {
      const user = userCredential.user;
      return {
        emailVerified: user.emailVerified,
        email: user.email,
        success: true,
      };
    });
    if (result.emailVerified) {
      return {
        message: "Successfully registered with email and password",
        statusCode: 200,
        success: true,
      };
    }
  } catch (error: any) {
    return {
      message: getFirebaseAuthErrorMessage(error.code),
      statusCode: 400,
      success: false,
    };
  }
}

export async function signInWithApple() {
  try {
    const provider = new OAuthProvider("apple.com");
    provider.addScope("email");
    provider.addScope("name");

    const result = await signInWithPopup(auth, provider);
    return {
      message: "Successfully signed in with Apple",
      statusCode: 200,
      isNewUser: getAdditionalUserInfo(result)?.isNewUser ? true : false,
      sucess: true,
    };
  } catch (error: any) {
    return {
      message: getFirebaseAuthErrorMessage(error.code),
      statusCode: 401,
      success: false,
    };
  }
}

export async function signOut() {
  try {
    await auth.signOut();

    window.localStorage.clear();
    window.location.reload();

    return {
      message: "Successfully signed out",
      statusCode: 200,
      success: true,
    };
  } catch (error: any) {
    return {
      message: getFirebaseAuthErrorMessage(error.code),
      statusCode: 401,
      success: false,
    };
  }
}

// get current user ID
export function getCurrentUserId() {
  if (auth.currentUser) {
    return auth.currentUser.uid;
  }
}

export function getCurrentUserToken(): Promise<string | null> {
  const currentUser = auth.currentUser;
  if (currentUser) {
    return currentUser
      .getIdToken()
      .then((token) => token)
      .catch((error) => {
        return null;
      });
  }
  return Promise.resolve(null);
}

export const reauthenticateAndDeleteUser = async (
  currentUser: User,
  password: any
) => {
  const isGoogleUser = currentUser.providerData.some(
    (provider: any) => provider.providerId === "google.com"
  );

  if (isGoogleUser) {
    const provider = new GoogleAuthProvider();
    await reauthenticateWithPopup(currentUser, provider);
  } else if (currentUser.email) {
    if (!password) {
      throw new Error("Please enter your password to delete the account.");
    }
    const credential = EmailAuthProvider.credential(
      currentUser.email,
      password
    );
    await reauthenticateWithCredential(currentUser, credential);
  }

  await currentUser.delete();
};
