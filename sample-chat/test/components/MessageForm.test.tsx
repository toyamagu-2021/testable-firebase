import { render, screen, cleanup, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
vi.mock('@/contexts/AuthContext', () => {
  return {
    useAuth: () => ({ currentUser: {uid: 'test-user-uid'}})
  }
})


const addMessageMock = vi.fn().mockResolvedValue({});
vi.mock('@/lib/message', () => {
  return {
    addMessage: addMessageMock
  }
});


describe('MessageForm', async () => {
  const {MessageForm} = await import('@/components/MessageForm');
  afterEach(() => {
    cleanup()
  });

  it('message input', () => {
    render(<MessageForm />);
    expect(screen.getByLabelText('content-input')).toBeDefined();
  });
  
  it('send button', () => {
    render(<MessageForm />);
    expect(screen.getByText('Send')).toBeDefined();
  })

  it('cannot push send button when input is empty', () => {
    render(<MessageForm />);
    const button = screen.getByText<HTMLButtonElement>('Send');
    expect(button).toBeDisabled()
  })

  it('call send method when push button', async () => {
    render(<MessageForm/>);
    const input = screen.getByLabelText<HTMLInputElement>('content-input');
    await act(() => userEvent.type(input, 'test'))
    screen.getByText<HTMLButtonElement>('Send').click()
    expect(addMessageMock).toBeCalled();
  });

  it('input clear after sending', async () => {
    render(<MessageForm />);
    const input = screen.getByLabelText<HTMLInputElement>('content-input');
    await act(() => userEvent.type(input, 'test'));
    expect(input).toHaveValue('test');
    screen.getByText<HTMLButtonElement>('Send').click()
    await waitFor(() => expect(input).toHaveValue(''));
  });
})


