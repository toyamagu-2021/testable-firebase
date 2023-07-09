import {
  render,
  cleanup,
  screen,
  waitFor,
} from '@testing-library/react';
import {
  renderHook,
  act as actHook,
  cleanup as cleanupHook
} from '@testing-library/react-hooks';
import type { User} from 'firebase/auth';

const useAuthStateMock = vi.fn();
vi.mock('@/hooks/useAuthState', () => {
  return {
    useAuthState: useAuthStateMock,
  };
});


describe('AuthProvider', async () => {
  const { useAuth, AuthProvider } = await import('@/contexts/AuthContext');
  const AuthedScreen = () => {
    const {currentUser} = useAuth();
    return (
      <div>
        Logined {currentUser?.displayName}
      </div>
    )
  };
  const TestComponent = () => (
    <AuthProvider>
      <AuthedScreen />
    </AuthProvider>
  );

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it('未認証の場合、ログイン画面が表示される', async () => {
    useAuthStateMock.mockReturnValue([null, false, undefined]);
    render(<TestComponent />);
    await waitFor(() => expect(screen.getByText('Please login')).toBeTruthy());
  });

  it('ローディング中の場合、ローディング画面が表示される', async () => {
    useAuthStateMock.mockReturnValue([null, true, undefined]);
    render(<TestComponent />);
    await waitFor(() => expect(screen.getByText('loading...')).toBeTruthy());
  });

  it('認証済みの場合、コンシューマコンポーネントでコンテキストデータが取得できる', async () => {
    useAuthStateMock.mockReturnValue([{ uid: 'test-user-uid', displayName: 'test' } as User, false, undefined]);
    render(<TestComponent />);
    await waitFor(() => expect(screen.getByText('Logined test')).toBeTruthy());
  });
})

const getUserMock = vi.fn();
const addUserMock = vi.fn();
vi.mock('@/lib/user', () => {
  return {
    getUser: getUserMock,
    addUser: addUserMock,
  };
});

const signInGoogleWithPopupMock = vi.fn();
const signOutMock = vi.fn();
vi.mock('@/lib/firebase', async() => {
  const firebase = await vi.importActual<object>(
    '@/lib/firebase'
  );
  return {
    ...firebase,
    signInGoogleWithPopup: signInGoogleWithPopupMock,
    signOut: signOutMock,
  };
});

describe('useAuth', async() => {
  const {useAuth} = await import('@/contexts/AuthContext');
  afterEach(async () => {
    vi.resetAllMocks()
    await cleanupHook();
  });

  it('For the first time login, user info are registered', async () => {
    const {result} = renderHook(() => useAuth());
    signInGoogleWithPopupMock.mockResolvedValue({
      user: {
        uid: 'test-uid',
        displayName: 'test',
        photoURL: null
      },
    });
    getUserMock.mockResolvedValue({ isExist: false });
    await actHook(async() => {
      await result.current.signInWithGoogle();
    });
    expect(addUserMock).toBeCalledWith({
      uid: 'test-uid',
      displayName: 'test',
      photoURL: null
    });
  });

  it('For the second time login, user info are not registered', async() => {
    const {result} = renderHook(() => useAuth());
    signInGoogleWithPopupMock.mockResolvedValue({
      user: {
        uid: 'test-uid',
        displayName: 'test',
        photoURL: null,
      },
    });
    getUserMock.mockResolvedValue({isExist: true});
    await actHook(async () => {
      await result.current.signInWithGoogle();
    });
    expect(addUserMock).not.toBeCalled();
  })
})
