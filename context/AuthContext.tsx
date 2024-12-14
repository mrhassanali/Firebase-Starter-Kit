'use client';

import React, {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useState,
} from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '@/app/lib/firebase/clientApp';
import { UserPropertiesModal } from '@/app/lib/_modules/jobs/model/UpworkJobs';
import { AuthController } from '@/app/lib/_modules/Auth/controller/AuthController';

interface AuthContextValue {
  isUser: boolean;
  isLoading: boolean;
  user: User | null;
  isNewUser: boolean;
  setIsNewUser: React.Dispatch<React.SetStateAction<boolean>>;
  upworkKeys: UserPropertiesModal | null;
  intercomHmac: string;
}

const defaultAuthContextValue: AuthContextValue = {
  isUser: false,
  isLoading: false,
  user: null,
  isNewUser: false,
  setIsNewUser: () => {},
  upworkKeys: null,
  intercomHmac: '',
};
const AuthContext = createContext<AuthContextValue>(defaultAuthContextValue);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUser, setIsUser] = useState<boolean>(false);
  const [isNewUser, setIsNewUser] = useState<boolean>(false);
  const [intercomHmac, setIntercomHmac] = useState<string>('');
  const [upworkKeys, setUpworkKeys] = useState<UserPropertiesModal | null>(
    null,
  );

  const router = useRouter();

  // track user credentials
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setIsLoading(true);
      if (firebaseUser) {
        setIsUser(true);
        setUser(firebaseUser);
      } else {
        setIsUser(false);
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  // get Upwork keys from firebase realtime db
  React.useEffect(() => {
    let unsubscribe: () => void;

    const fetchUpworkKeys = async (userId: string) => {
      try {
        const UpworkJobs = AuthController.getInstance();
        unsubscribe = await UpworkJobs.getRealtimeListenUpworkKeysFromRTB(
          userId,
          (data) => {
            setUpworkKeys(data);
          },
        );
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };

    if (user && isUser) {
      setIsLoading(true);
      fetchUpworkKeys(user.uid);
    }
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user, isUser]);

  const getIntercomHmac = useCallback(async (userId: string) => {
    try {
      const response = await fetch('/api/intercom/hmac?uid=' + userId);
      const data = await response.json();
      setIntercomHmac(data.hash);
    } catch (e) {
      console.log(e);
    }
  }, []);

  React.useEffect(() => {
    if (user && isUser) {
      getIntercomHmac(user.uid);
    }
  }, [user, isUser, getIntercomHmac]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isUser,
        isNewUser,
        setIsNewUser,
        upworkKeys,
        intercomHmac,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
