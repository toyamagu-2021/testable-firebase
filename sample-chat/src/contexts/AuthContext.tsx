import { ReactNode, createContext, useContext, useCallback } from 'react';
import { useAuthState } from '@/hooks/useAuthState';
import { LoginScreen } from '@/components/LoginScreeen';
import { LoadingScreen } from '@/components/LoadingScreen';
import {getUser, addUser} from '@/lib/user';
import {
  User,
  signInGoogleWithPopup,
  signOut,
  getFcmToken,
 } from '@/lib/firebase';
 import { setUserSecret } from '@/lib/userSecret';

type AuthContextValue = {
  currentUser: User | null;
};

export const useAuth = () => {
  const {currentUser} = useContext(AuthContext);
  const signInWithGoogle = useCallback(async () => {
    try {
      const {user} = await signInGoogleWithPopup();
      const fcmToken = await getFcmToken();
      const {isExist} = await getUser(user.uid);
      if(!isExist) await addUser(user);
      await setUserSecret(user.uid, {fcmToken});
    } catch (e) {
      console.error(e);
      await signOut();
    }
  }, []);
  return {currentUser, signInWithGoogle, signOut };
}

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [currentUser, loading] = useAuthState();
  if(loading) return <LoadingScreen />;
  if (!currentUser) return <LoginScreen />;
  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  )
};

export const AuthContext = createContext<AuthContextValue>({
  currentUser: null,
});
