import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ThemeProvider, useTheme } from './ThemeProvider';
import { Button, Text } from '@mantine/core';

describe('ThemeProvider', () => {
  it('should render children', () => {
    render(
      <ThemeProvider>
        <div data-testid="child">Test Content</div>
      </ThemeProvider>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should apply theme to Mantine components', () => {
    render(
      <ThemeProvider>
        <Button>Test Button</Button>
      </ThemeProvider>
    );

    const button = screen.getByRole('button', { name: 'Test Button' });
    expect(button).toBeInTheDocument();
  });

  it('should render text with theme typography', () => {
    render(
      <ThemeProvider>
        <Text>Themed Text</Text>
      </ThemeProvider>
    );

    expect(screen.getByText('Themed Text')).toBeInTheDocument();
  });

  it('should accept theme overrides', () => {
    render(
      <ThemeProvider themeOverrides={{ primaryColor: 'blue' }}>
        <Button>Overridden Button</Button>
      </ThemeProvider>
    );

    const button = screen.getByRole('button', { name: 'Overridden Button' });
    expect(button).toBeInTheDocument();
  });

  it('should support nested components', () => {
    render(
      <ThemeProvider>
        <div>
          <Button>Outer Button</Button>
          <div>
            <Text>Nested Text</Text>
          </div>
        </div>
      </ThemeProvider>
    );

    expect(screen.getByRole('button', { name: 'Outer Button' })).toBeInTheDocument();
    expect(screen.getByText('Nested Text')).toBeInTheDocument();
  });
});

describe('useTheme', () => {
  function ThemeConsumer() {
    const { colorScheme, isDark, isLight } = useTheme();

    return (
      <div>
        <div data-testid="color-scheme">{colorScheme}</div>
        <div data-testid="is-dark">{String(isDark)}</div>
        <div data-testid="is-light">{String(isLight)}</div>
      </div>
    );
  }

  it('should provide color scheme information', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    const colorScheme = screen.getByTestId('color-scheme');
    expect(colorScheme.textContent).toMatch(/light|dark/);

    const isDark = screen.getByTestId('is-dark');
    const isLight = screen.getByTestId('is-light');

    // One should be true, one should be false
    expect([isDark.textContent, isLight.textContent]).toContain('true');
    expect([isDark.textContent, isLight.textContent]).toContain('false');
  });
});
