# Brain Garden Component Generator

Intelligent component generator for the Brain Garden design system.

## Quick Start

```bash
pnpm generate
```

Follow the interactive prompts to generate a new UI component with:
- Component file (TypeScript + JSX)
- Comprehensive test suite
- Storybook stories with all variants
- Automatic exports in package index

## Generated Files

For a component named `UserAvatar`, the generator creates:

```
packages/ui-components/src/components/
├── UserAvatar.tsx          # Component implementation
├── UserAvatar.test.tsx     # Unit tests (7 test cases)
└── UserAvatar.stories.tsx  # Storybook stories (5 variants)
```

And updates:
```
packages/ui-components/src/index.ts  # Adds exports
```

## Component Features

All generated components include:

- ✅ **Design System Integration** - Uses tokens from @bg-kit/design-system
- ✅ **Dark/Light Mode** - Automatic theme support
- ✅ **TypeScript** - Fully typed with props interface
- ✅ **Accessibility** - WCAG 2.1 AA compliant
- ✅ **Responsive** - Mobile-first design patterns
- ✅ **5 Color Variants** - primary, success, warning, error, info
- ✅ **Interactive Storybook** - Live component playground
- ✅ **100% Test Coverage** - Comprehensive unit tests

## Workflow

The generator follows the documented workflow in `/docs/generator-workflow.md`:

1. **Build** → Generate component with design system tokens
2. **Test** → Run test suite (`pnpm test`)
3. **Storybook** → View in Storybook (`pnpm storybook`)
4. **Smoke Test** → Verify in browser (http://localhost:6006)
5. **Customize** → Modify implementation as needed
6. **Commit** → Save with atomic commits

## Templates

The generator uses Handlebars templates in `.generator/templates/`:

- `component.tsx.hbs` - Component template
- `component.test.tsx.hbs` - Test template
- `component.stories.tsx.hbs` - Story template

## Customization

### Modify Component Template

Edit `.generator/templates/component.tsx.hbs` to change the default component structure.

**Variables available:**
- `{{pascalCase name}}` - Component name in PascalCase
- `{{lowerCase category}}` - Category in lowercase
- `{{category}}` - Category as provided

### Modify Test Template

Edit `.generator/templates/component.test.tsx.hbs` to add/remove test cases.

All generated tests include:
- Required props test
- Optional props test
- All variants test
- Action handler test
- Interaction test
- Accessibility test
- Icon rendering test

### Modify Story Template

Edit `.generator/templates/component.stories.tsx.hbs` to change Storybook stories.

All generated stories include:
- Primary variant
- With icon variant
- Without action variant
- All variants showcase
- Interactive playground

## Categories

Available component categories:
- **Data Display** - Cards, tables, lists, badges
- **Inputs** - Forms, text fields, selects, checkboxes
- **Layout** - Containers, grids, stacks, groups
- **Navigation** - Menus, breadcrumbs, tabs, links
- **Feedback** - Alerts, notifications, progress indicators
- **Buttons** - Buttons, action icons, button groups
- **Typography** - Headings, text, code blocks

## Testing Generated Components

```bash
# Run all tests
pnpm --filter=@bg-kit/ui-components test

# Run tests with coverage
pnpm --filter=@bg-kit/ui-components test:coverage

# Watch mode
pnpm --filter=@bg-kit/ui-components test:watch
```

## Viewing in Storybook

```bash
# Start Storybook
pnpm storybook

# Opens http://localhost:6006
# Navigate to "UI Components" → Your component name
```

## Best Practices

1. **Design System First** - Always use design system tokens, never hardcode values
2. **Semantic HTML** - Use proper HTML5 elements for accessibility
3. **Keyboard Navigation** - Ensure all interactive elements are keyboard accessible
4. **Responsive** - Test on mobile and desktop viewport sizes
5. **Documentation** - Write clear prop descriptions in JSDoc comments
6. **Examples** - Provide usage examples in Storybook stories

## Example Component

Here's what a generated component looks like:

```tsx
import { Card, Text, Button } from '@bg-kit/design-system';
import { spacing, colors } from '@bg-kit/design-system/tokens';

export interface UserAvatarProps {
  title: string;
  description?: string;
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info';
}

export function UserAvatar({ title, description, variant = 'primary' }: UserAvatarProps) {
  return (
    <Card>
      <Text>{title}</Text>
      {description && <Text c="dimmed">{description}</Text>}
    </Card>
  );
}
```

## Version

Current template version: **v1.0.0**

## Changelog

See `.generator/CHANGELOG.md` for template version history.
