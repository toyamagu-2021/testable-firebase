import {
  render,
  cleanup,
  screen,
  waitFor,
} from '@testing-library/react';
import { userFactory } from '../factories/user';
import { messageFactory } from '../factories/message';
import { Timestamp } from '@firebase/firestore';

const sender = userFactory.build({
  id: 'user-id',
  name: 'test',
  photoUrl: 'user-photo-url',
});

const useBlobMock = vi.fn();
vi.mock('@hook/useBlob', () => {
  return {
    useBlob: useBlobMock,
  };
})

vi.mock('@/contexts/UsersContext', () => {
  return {
    useUsers: () => {
      return {
        usersById: {'user-id': [sender]}, loading: false
      };
    },
  };
});

describe('Message', async() => {
  const {Message} = await import('@/components/Message');
  afterEach(() => cleanup());

  const message = messageFactory.build({
    content: 'test message',
    senderId: 'user-id',
    createdAt: Timestamp.fromDate(
      new Date('2022-07-01 00:00:00+09:00')
    ),
  });


  it('icon', async () => {
    render(<Message message={message}/>);
    await waitFor(() => {
      expect(screen.getByRole('img').getAttribute('src')).toBe('/src/images/noname.png')
    });
  });

  it('show sender name', async () => {
    render(<Message message={message}/>);
    await waitFor(() => {
      expect(screen.getByText('nanashi')).toBeTruthy()
    });
  });

  it('send time', async () => {
    render(<Message message={message}/>);
    await waitFor(() => {
      expect(screen.getByText('2022-07-01 00:00')).toBeTruthy()
    });
  })

  it('message', async () => {
    render(<Message message={message}/>);
    await waitFor(() => {
      expect(screen.getByText('test message')).toBeTruthy()
    });
  })
})
