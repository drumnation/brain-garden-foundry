import type {Meta, StoryObj} from '@storybook/react';
import {type Breakpoint, breakpoints} from '../breakpoints';
import {useBreakpoint} from './useBreakpoint';

const UseBreakpointDemo = () => {
  const {current, isAtLeast, isAtMost, is} = useBreakpoint();

  const allBreakpoints: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];

  return (
    <div style={{fontFamily: 'system-ui, sans-serif', maxWidth: '600px'}}>
      <h2 style={{marginBottom: '1rem'}}>useBreakpoint Hook Demo</h2>

      {/* Current Breakpoint Display */}
      <div
        style={{
          padding: '1.5rem',
          marginBottom: '1.5rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: '8px',
          textAlign: 'center',
        }}
      >
        <div
          style={{fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem'}}
        >
          Current Breakpoint
        </div>
        <div style={{fontSize: '3rem', fontWeight: 'bold'}}>{current}</div>
        <div style={{fontSize: '0.875rem', opacity: 0.9, marginTop: '0.5rem'}}>
          {typeof window !== 'undefined' && `Window: ${window.innerWidth}px`}
        </div>
      </div>

      {/* Breakpoint Definitions */}
      <div
        style={{
          padding: '1rem',
          backgroundColor: '#f9fafb',
          borderRadius: '8px',
          marginBottom: '1.5rem',
        }}
      >
        <h3
          style={{fontSize: '1rem', marginBottom: '0.75rem', fontWeight: '600'}}
        >
          Breakpoint Definitions
        </h3>
        <div style={{fontFamily: 'monospace', fontSize: '0.875rem'}}>
          {allBreakpoints.map((bp) => (
            <div
              key={bp}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.5rem',
                backgroundColor: is(bp) ? '#dbeafe' : 'transparent',
                borderLeft: is(bp)
                  ? '3px solid #3b82f6'
                  : '3px solid transparent',
                marginBottom: '0.25rem',
              }}
            >
              <span style={{fontWeight: is(bp) ? 'bold' : 'normal'}}>{bp}</span>
              <span style={{color: '#6b7280'}}>{breakpoints[bp]}px</span>
            </div>
          ))}
        </div>
      </div>

      {/* isAtLeast Tests */}
      <div
        style={{
          padding: '1rem',
          backgroundColor: '#f0fdf4',
          border: '1px solid #86efac',
          borderRadius: '8px',
          marginBottom: '1rem',
        }}
      >
        <h3
          style={{fontSize: '1rem', marginBottom: '0.75rem', fontWeight: '600'}}
        >
          isAtLeast() Tests
        </h3>
        <div style={{fontSize: '0.875rem'}}>
          {allBreakpoints.map((bp) => (
            <div
              key={bp}
              style={{
                padding: '0.5rem',
                marginBottom: '0.25rem',
                backgroundColor: isAtLeast(bp) ? '#10b981' : '#ef4444',
                color: 'white',
                borderRadius: '4px',
              }}
            >
              {isAtLeast(bp) ? '✓' : '✗'} isAtLeast('{bp}') ={' '}
              {String(isAtLeast(bp))}
            </div>
          ))}
        </div>
      </div>

      {/* isAtMost Tests */}
      <div
        style={{
          padding: '1rem',
          backgroundColor: '#fef3c7',
          border: '1px solid #fcd34d',
          borderRadius: '8px',
        }}
      >
        <h3
          style={{fontSize: '1rem', marginBottom: '0.75rem', fontWeight: '600'}}
        >
          isAtMost() Tests
        </h3>
        <div style={{fontSize: '0.875rem'}}>
          {allBreakpoints.map((bp) => (
            <div
              key={bp}
              style={{
                padding: '0.5rem',
                marginBottom: '0.25rem',
                backgroundColor: isAtMost(bp) ? '#f59e0b' : '#6b7280',
                color: 'white',
                borderRadius: '4px',
              }}
            >
              {isAtMost(bp) ? '✓' : '✗'} isAtMost('{bp}') ={' '}
              {String(isAtMost(bp))}
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Instructions */}
      <div
        style={{
          marginTop: '1.5rem',
          padding: '1rem',
          backgroundColor: '#eff6ff',
          border: '1px solid #3b82f6',
          borderRadius: '8px',
          fontSize: '0.875rem',
          lineHeight: '1.6',
        }}
      >
        <strong>💡 Try it:</strong> Resize your browser window to see the
        breakpoint detection update in real-time!
      </div>
    </div>
  );
};

const meta = {
  title: 'Core Responsive/Hooks/useBreakpoint',
  component: UseBreakpointDemo,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'React hook for detecting the current responsive breakpoint. Provides helper methods to check if the viewport is at least, at most, or exactly at a specific breakpoint. Updates automatically when the window is resized.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof UseBreakpointDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Interactive demo showing all breakpoint detection features
 * Try resizing your browser window to see it update!
 */
export const Interactive: Story = {};
