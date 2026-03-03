/**
 * Design tokens: Colors
 *
 * Semantic color system that works for both light and dark modes.
 * Uses Mantine's color tuple system for automatic shade generation.
 */

export const colors = {
  // Primary brand color
  primary: [
    '#e6f2ff', // 0 - lightest
    '#bdd9ff', // 1
    '#8bb9ff', // 2
    '#5999ff', // 3
    '#2679ff', // 4
    '#0059ff', // 5 - main (default)
    '#0047cc', // 6
    '#003699', // 7
    '#002466', // 8
    '#001233', // 9 - darkest
  ],

  // Neutral grays
  gray: [
    '#f8f9fa', // 0
    '#f1f3f5', // 1
    '#e9ecef', // 2
    '#dee2e6', // 3
    '#ced4da', // 4
    '#adb5bd', // 5
    '#868e96', // 6
    '#495057', // 7
    '#343a40', // 8
    '#212529', // 9
  ],

  // Semantic colors
  success: [
    '#ebfbee',
    '#d3f9d8',
    '#b2f2bb',
    '#8ce99a',
    '#69db7c',
    '#51cf66',
    '#40c057',
    '#37b24d',
    '#2f9e44',
    '#2b8a3e',
  ],

  warning: [
    '#fff9db',
    '#fff3bf',
    '#ffec99',
    '#ffe066',
    '#ffd43b',
    '#fcc419',
    '#fab005',
    '#f59f00',
    '#f08c00',
    '#e67700',
  ],

  error: [
    '#fff5f5',
    '#ffe3e3',
    '#ffc9c9',
    '#ffa8a8',
    '#ff8787',
    '#ff6b6b',
    '#fa5252',
    '#f03e3e',
    '#e03131',
    '#c92a2a',
  ],

  info: [
    '#e7f5ff',
    '#d0ebff',
    '#a5d8ff',
    '#74c0fc',
    '#4dabf7',
    '#339af0',
    '#228be6',
    '#1c7ed6',
    '#1971c2',
    '#1864ab',
  ],
} as const;

/**
 * Color roles for semantic usage
 */
export const colorRoles = {
  // Text colors
  text: {
    primary: 'var(--mantine-color-text)',
    secondary: 'var(--mantine-color-dimmed)',
    disabled: 'var(--mantine-color-placeholder)',
    inverse: 'var(--mantine-color-white)',
  },

  // Background colors
  background: {
    default: 'var(--mantine-color-body)',
    paper: 'var(--mantine-color-default)',
    elevated: 'var(--mantine-color-default-hover)',
  },

  // Border colors
  border: {
    default: 'var(--mantine-color-default-border)',
    hover: 'var(--mantine-color-gray-4)',
  },

  // State colors
  state: {
    hover: 'var(--mantine-color-default-hover)',
    active: 'var(--mantine-color-primary-light)',
    focus: 'var(--mantine-color-primary-light)',
  },
} as const;
