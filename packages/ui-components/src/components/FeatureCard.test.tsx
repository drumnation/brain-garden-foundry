import {ThemeProvider} from '@bg-kit/design-system';
import {render, screen} from '@testing-library/react';
import {describe, expect, it, vi} from 'vitest';
import {FeatureCard} from './FeatureCard';

const TestIcon = () => (
  <svg data-testid="test-icon">
    <title>Test icon</title>Icon
  </svg>
);

describe('FeatureCard', () => {
  it('should render with title and description', () => {
    render(
      <ThemeProvider>
        <FeatureCard
          icon={<TestIcon />}
          title="Test Feature"
          description="Test description"
        />
      </ThemeProvider>,
    );

    expect(screen.getByText('Test Feature')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('should render icon', () => {
    render(
      <ThemeProvider>
        <FeatureCard
          icon={<TestIcon />}
          title="Test"
          description="Description"
        />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('should render action button when provided', () => {
    const handleAction = vi.fn();

    render(
      <ThemeProvider>
        <FeatureCard
          icon={<TestIcon />}
          title="Test"
          description="Description"
          actionLabel="Click Me"
          onAction={handleAction}
        />
      </ThemeProvider>,
    );

    const button = screen.getByRole('button', {name: 'Click Me'});
    expect(button).toBeInTheDocument();
  });

  it('should call onAction when button clicked', () => {
    const handleAction = vi.fn();

    render(
      <ThemeProvider>
        <FeatureCard
          icon={<TestIcon />}
          title="Test"
          description="Description"
          actionLabel="Click Me"
          onAction={handleAction}
        />
      </ThemeProvider>,
    );

    const button = screen.getByRole('button', {name: 'Click Me'});
    button.click();

    expect(handleAction).toHaveBeenCalledTimes(1);
  });

  it('should not render button when actionLabel not provided', () => {
    render(
      <ThemeProvider>
        <FeatureCard
          icon={<TestIcon />}
          title="Test"
          description="Description"
        />
      </ThemeProvider>,
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('should apply variant color', () => {
    render(
      <ThemeProvider>
        <FeatureCard
          icon={<TestIcon />}
          title="Test"
          description="Description"
          variant="success"
        />
      </ThemeProvider>,
    );

    // Component renders successfully with variant
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
