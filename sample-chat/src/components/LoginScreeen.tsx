import {useAuth} from '@/contexts/AuthContext';

export const LoginScreen = () => {
  const {signInWithGoogle} = useAuth();
  return (
    <div>
      <div>
        Please login
      </div>
      <button onClick={signInWithGoogle}>Google Login</button>
    </div>
  )
}
