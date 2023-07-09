import {render, cleanup, screen} from '@testing-library/react';
import {App} from '@/components/App';

describe('App', () => {
  afterEach(() => cleanup());

  it('show title', async() => {
    render(<App/>);
    expect(screen.getByText('Sample Chart App')).toBeTruthy();
  });
})
