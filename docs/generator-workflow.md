# Component Generator Workflow

## Overview

This workflow ensures all generated components are production-ready, fully tested, and properly integrated with the design system before being saved to the generator.

## Process Workflow

```
┌─────────────┐
│   Build     │ → Create component with design system tokens
└─────────────┘
       ↓
┌─────────────┐
│    Test     │ → Write comprehensive unit tests
└─────────────┘
       ↓
┌─────────────┐
│  Storybook  │ → Create interactive stories with variants
└─────────────┘
       ↓
┌─────────────┐
│ Smoke Test  │ → Verify in Storybook UI (http://localhost:6006)
└─────────────┘
       ↓
┌─────────────┐
│   Clear     │ → Remove example components from ui-components
└─────────────┘
       ↓
┌─────────────┐
│    Save     │ → Save templates to generator with atomic commit
└─────────────┘
```

## Detailed Steps

### 1. Build Component

**Requirements:**
- Use design system tokens (colors, spacing, typography)
- Support dark/light mode automatically
- Fully typed with TypeScript
- Accessible (WCAG 2.1 AA)
- Responsive design

**File Structure:**
```
packages/ui-components/src/components/
├── ComponentName.tsx          # Main component
├── ComponentName.test.tsx     # Unit tests
└── ComponentName.stories.tsx  # Storybook stories
```

**Component Template:**
```tsx
import { Card, Text, Button } from '@bg-kit/design-system';
import { spacing, colors } from '@bg-kit/design-system/tokens';
import { type ReactNode } from 'react';

export interface ComponentNameProps {
  // Props with proper documentation
  title: string;
  description?: string;
  variant?: 'primary' | 'success' | 'warning' | 'error';
}

/**
 * ComponentName - Brief description
 *
 * Detailed description of what this component does and when to use it.
 *
 * @example
 * ```tsx
 * <ComponentName title="Example" variant="primary" />
 * ```
 */
export function ComponentName({
  title,
  description,
  variant = 'primary',
}: ComponentNameProps) {
  return (
    <Card>
      {/* Component implementation using design system */}
    </Card>
  );
}
```

### 2. Test Thoroughly

**Requirements:**
- Unit tests for all props and variants
- Accessibility tests (semantic HTML, ARIA)
- Interaction tests (click handlers, form submissions)
- Edge cases and error states
- 100% coverage for new components

**Test Template:**
```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ThemeProvider } from '@bg-kit/design-system';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  it('should render with required props', () => {
    render(
      <ThemeProvider>
        <ComponentName title="Test" />
      </ThemeProvider>
    );

    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('should handle all variants', () => {
    const { rerender } = render(
      <ThemeProvider>
        <ComponentName title="Test" variant="primary" />
      </ThemeProvider>
    );

    // Test each variant
  });

  it('should call event handlers', () => {
    const handleClick = vi.fn();
    // Test interaction
  });

  // More tests...
});
```

**Run Tests:**
```bash
cd packages/ui-components
pnpm test              # Run all tests
pnpm test:coverage     # Check coverage
```

### 3. Create Storybook Stories

**Requirements:**
- Show all variants and states
- Interactive controls for all props
- Dark/light mode examples
- Accessibility documentation
- Usage examples in code

**Story Template:**
```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentName } from './ComponentName';

const meta = {
  title: 'UI Components/ComponentName',
  component: ComponentName,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'success', 'warning', 'error'],
    },
  },
} satisfies Meta<typeof ComponentName>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    title: 'Example Title',
    variant: 'primary',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <ComponentName title="Primary" variant="primary" />
      <ComponentName title="Success" variant="success" />
      <ComponentName title="Warning" variant="warning" />
      <ComponentName title="Error" variant="error" />
    </div>
  ),
};
```

### 4. Smoke Test in Storybook

**Open Storybook:**
```bash
pnpm storybook
# Opens http://localhost:6006
```

**Verify:**
- [ ] Component renders correctly in light mode
- [ ] Component renders correctly in dark mode
- [ ] All variants display properly
- [ ] Interactive controls work
- [ ] No console errors or warnings
- [ ] Responsive behavior works
- [ ] Documentation is clear and helpful

### 5. Clear Example Components

**Before saving templates, clean up:**

```bash
# Remove example components (FeatureCard, StatusBadge)
rm packages/ui-components/src/components/FeatureCard.*
rm packages/ui-components/src/components/StatusBadge.*

# Update index to remove exports
# Edit packages/ui-components/src/index.ts

# Verify tests still pass
cd packages/ui-components && pnpm test
```

### 6. Save to Generator

**Create Template Files:**

```
.generator/
├── templates/
│   ├── component.tsx.hbs           # Component template
│   ├── component.test.tsx.hbs      # Test template
│   ├── component.stories.tsx.hbs   # Story template
│   └── README.md                   # Template documentation
└── scripts/
    └── generate-component.ts       # Generator script
```

**Atomic Commit Strategy:**

```bash
# Commit 1: Add component template
git add .generator/templates/component.tsx.hbs
git commit -m "feat(generator): add component template with design system integration

- Uses design system tokens (colors, spacing, typography)
- Supports dark/light mode
- Fully typed with TypeScript
- WCAG 2.1 AA compliant"

# Commit 2: Add test template
git add .generator/templates/component.test.tsx.hbs
git commit -m "feat(generator): add component test template

- Comprehensive unit test coverage
- Tests all variants and props
- Interaction testing with vitest
- Accessibility testing included"

# Commit 3: Add story template
git add .generator/templates/component.stories.tsx.hbs
git commit -m "feat(generator): add Storybook story template

- Interactive controls for all props
- Shows all variants
- Dark/light mode examples
- Auto-generated documentation"

# Commit 4: Add generator script
git add .generator/scripts/generate-component.ts
git commit -m "feat(generator): add component generation script

Usage: pnpm generate ComponentName

Automatically generates:
- Component file with design system tokens
- Comprehensive test suite
- Storybook stories with all variants"
```

## Generator Script

**Installation:**

```bash
pnpm add -D plop @types/node
```

**Create plopfile.js:**

```javascript
export default function (plop) {
  plop.setGenerator('component', {
    description: 'Generate a new UI component',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Component name (PascalCase):',
      },
      {
        type: 'list',
        name: 'category',
        message: 'Component category:',
        choices: ['Data Display', 'Inputs', 'Layout', 'Navigation', 'Feedback'],
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'packages/ui-components/src/components/{{pascalCase name}}.tsx',
        templateFile: '.generator/templates/component.tsx.hbs',
      },
      {
        type: 'add',
        path: 'packages/ui-components/src/components/{{pascalCase name}}.test.tsx',
        templateFile: '.generator/templates/component.test.tsx.hbs',
      },
      {
        type: 'add',
        path: 'packages/ui-components/src/components/{{pascalCase name}}.stories.tsx',
        templateFile: '.generator/templates/component.stories.tsx.hbs',
      },
      {
        type: 'append',
        path: 'packages/ui-components/src/index.ts',
        pattern: /(\/\/ COMPONENT EXPORTS)/,
        template: "export { {{pascalCase name}} } from './components/{{pascalCase name}}';\nexport type { {{pascalCase name}}Props } from './components/{{pascalCase name}}';",
      },
    ],
  });
}
```

**Add scripts to package.json:**

```json
{
  "scripts": {
    "generate": "plop"
  }
}
```

**Usage:**

```bash
pnpm generate

# Interactive prompts:
# ? Component name (PascalCase): UserAvatar
# ? Component category: Data Display

# Generated files:
# ✔ packages/ui-components/src/components/UserAvatar.tsx
# ✔ packages/ui-components/src/components/UserAvatar.test.tsx
# ✔ packages/ui-components/src/components/UserAvatar.stories.tsx
# ✔ Updated packages/ui-components/src/index.ts
```

## Quality Checklist

Before saving to generator, ensure:

- [x] Component uses design system tokens
- [x] Component works in dark and light modes
- [x] All tests pass with 100% coverage
- [x] Storybook stories show all variants
- [x] No TypeScript errors
- [x] No ESLint warnings
- [x] Accessible (tested with screen reader)
- [x] Responsive (tested on mobile/desktop)
- [x] Documentation is complete
- [x] Examples are clear and helpful

## Maintenance

**Updating Templates:**

1. Build improved version in `packages/ui-components`
2. Test thoroughly
3. Update template in `.generator/templates/`
4. Commit with clear changelog
5. Regenerate existing components if needed

**Version Control:**

- Template version in comments: `// Generator: v1.2.0`
- Changelog in `.generator/CHANGELOG.md`
- Migration guide for breaking changes

## Best Practices

1. **Design System First**: Always use design system tokens, never hardcode values
2. **Accessibility**: Test with keyboard navigation and screen readers
3. **Performance**: Lazy load heavy components, optimize re-renders
4. **Documentation**: Write clear props descriptions and usage examples
5. **Testing**: Cover all user interactions and edge cases
6. **Consistency**: Follow established patterns from existing components
7. **Atomic Commits**: One feature per commit for clear history
