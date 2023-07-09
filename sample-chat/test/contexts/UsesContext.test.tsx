import {renderHook} from '@testing-library/react-hooks';
import {useUsers, UsersProvider} from '@/contexts/UsersContext';
import {ReactNode} from 'react';

describe('useUsers', () => {
  const wrapper = ({children}: {children: ReactNode}) => (
    <UsersProvider>{children}</UsersProvider>
  )

  vi.mock('@/hooks/useCollectionData', () => {
    return {
      useCollectionData: () => [
        [{id: 'test-user-uid', name: 'test'}], false
      ],
    };
  })
  afterEach(() => {
    vi.resetAllMocks();
  })

  it('Return users and usersById,loading', async() => {
    const {result} = renderHook(()=> useUsers(), {wrapper});
    expect(result.current).toEqual({
      users:[{id: 'test-user-uid', name: 'test'}],
      usersById: {
        'test-user-uid': {
          id: 'test-user-uid',
          name: 'test',
        },
      },
      loading: false,
    });
  })
})

