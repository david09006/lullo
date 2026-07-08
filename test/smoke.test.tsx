import {render, screen} from '@testing-library/react';
import {describe, it, expect} from 'vitest';

function Hello({name}: {name: string}) {
  return <p>Hello {name}</p>;
}

// Smoke test: proves the runner, jsdom, jest-dom matchers, and the TSX
// transform all work. Real logic tests land in Phase 1+.
describe('test harness', () => {
  it('renders a component', () => {
    render(<Hello name="Lullo" />);
    expect(screen.getByText('Hello Lullo')).toBeInTheDocument();
  });
});
