import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ThemeProvider } from '@bg-kit/design-system';
import { StatusBadge } from './StatusBadge';

describe('StatusBadge', () => {
  it('should render with text', () => {
    render(
      <ThemeProvider>
        <StatusBadge status="success">Active</StatusBadge>
      </ThemeProvider>
    );

    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('should render all status variants', () => {
    const { rerender } = render(
      <ThemeProvider>
        <StatusBadge status="success">Success</StatusBadge>
      </ThemeProvider>
    );
    expect(screen.getByText('Success')).toBeInTheDocument();

    rerender(
      <ThemeProvider>
        <StatusBadge status="warning">Warning</StatusBadge>
      </ThemeProvider>
    );
    expect(screen.getByText('Warning')).toBeInTheDocument();

    rerender(
      <ThemeProvider>
        <StatusBadge status="error">Error</StatusBadge>
      </ThemeProvider>
    );
    expect(screen.getByText('Error')).toBeInTheDocument();

    rerender(
      <ThemeProvider>
        <StatusBadge status="info">Info</StatusBadge>
      </ThemeProvider>
    );
    expect(screen.getByText('Info')).toBeInTheDocument();

    rerender(
      <ThemeProvider>
        <StatusBadge status="neutral">Neutral</StatusBadge>
      </ThemeProvider>
    );
    expect(screen.getByText('Neutral')).toBeInTheDocument();
  });

  it('should render with left section icon', () => {
    const Icon = () => <span data-testid="icon">✓</span>;

    render(
      <ThemeProvider>
        <StatusBadge status="success" leftSection={<Icon />}>
          Complete
        </StatusBadge>
      </ThemeProvider>
    );

    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByText('Complete')).toBeInTheDocument();
  });

  it('should render different sizes', () => {
    const { rerender } = render(
      <ThemeProvider>
        <StatusBadge status="success" size="xs">
          XS
        </StatusBadge>
      </ThemeProvider>
    );
    expect(screen.getByText('XS')).toBeInTheDocument();

    rerender(
      <ThemeProvider>
        <StatusBadge status="success" size="lg">
          LG
        </StatusBadge>
      </ThemeProvider>
    );
    expect(screen.getByText('LG')).toBeInTheDocument();
  });
});
