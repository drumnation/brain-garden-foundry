# Core Component Library - API Specification

**Version**: 1.0
**Last Updated**: 2025-11-14
**Status**: Architecture Phase

---

## Overview

This document defines the complete API surface for the Core Component Library - the atomic building blocks of the Brain Garden Rapid Dev Kit.

**Design Philosophy**:
- **Library-Agnostic**: Core components use primitive React/HTML only
- **Composition-Based**: UI wrappers compose core components with library styling
- **TypeScript-Native**: Full type safety and exported types
- **Responsive-First**: Mobile-first design by default

---

## @bg-kit/core-layouts

Standard application layouts for common patterns.

### DashboardLayout

Classic dashboard with sidebar and main content area.

```typescript
import { DashboardLayout } from '@bg-kit/core-layouts';

interface DashboardLayoutProps {
  /** Sidebar content (navigation, etc.) */
  sidebar: React.ReactNode;

  /** Main content area */
  children: React.ReactNode;

  /** Optional header (logo, user menu, etc.) */
  header?: React.ReactNode;

  /** Sidebar placement */
  sidebarPosition?: 'left' | 'right';

  /** Sidebar width (default: 240px) */
  sidebarWidth?: number | string;

  /** Collapsible sidebar */
  collapsible?: boolean;

  /** Initially collapsed (mobile default: true) */
  defaultCollapsed?: boolean;

  /** Callback when sidebar state changes */
  onSidebarToggle?: (collapsed: boolean) => void;

  /** Responsive behavior */
  responsive?: {
    /** Breakpoint where sidebar becomes drawer (default: 'md') */
    drawerBreakpoint?: 'sm' | 'md' | 'lg';
    /** Hide sidebar entirely on mobile */
    hideSidebarMobile?: boolean;
  };
}

// Usage Example
<DashboardLayout
  sidebar={<Navigation />}
  header={<AppHeader />}
  sidebarPosition="left"
  collapsible
  responsive={{ drawerBreakpoint: 'md' }}
>
  <PageContent />
</DashboardLayout>
```

### ToolLayout

Tool-style application with panel system (no sidebar).

```typescript
interface ToolLayoutProps {
  /** Main tool content */
  children: React.ReactNode;

  /** Optional toolbar (top actions) */
  toolbar?: React.ReactNode;

  /** Optional status bar (bottom) */
  statusBar?: React.ReactNode;

  /** Panel system integration */
  panels?: {
    /** Enable Mosaic panel system */
    enabled: boolean;
    /** Initial panel layout */
    initialLayout?: PanelLayout;
  };
}

// Usage Example
<ToolLayout
  toolbar={<ToolActions />}
  statusBar={<StatusBar />}
  panels={{ enabled: true }}
>
  <PanelContainer>
    <Panel id="editor">...</Panel>
    <Panel id="preview">...</Panel>
  </PanelContainer>
</ToolLayout>
```

### ContentLayout

Marketing/content layout (header, content, footer).

```typescript
interface ContentLayoutProps {
  /** Header content (logo, nav, CTA) */
  header: React.ReactNode;

  /** Main content */
  children: React.ReactNode;

  /** Footer content */
  footer?: React.ReactNode;

  /** Max width for content (default: '1280px') */
  maxWidth?: number | string;

  /** Center content horizontally */
  centered?: boolean;
}

// Usage Example
<ContentLayout
  header={<MarketingHeader />}
  footer={<MarketingFooter />}
  maxWidth="1280px"
  centered
>
  <LandingPage />
</ContentLayout>
```

### AuthLayout

Login/signup page layouts.

```typescript
interface AuthLayoutProps {
  /** Auth form content */
  children: React.ReactNode;

  /** Optional logo/branding */
  logo?: React.ReactNode;

  /** Layout variant */
  variant?: 'centered' | 'split' | 'full';

  /** Background image/gradient */
  background?: string | React.ReactNode;

  /** Max width for form (default: '400px') */
  formWidth?: number | string;
}

// Usage Example
<AuthLayout
  variant="split"
  logo={<CompanyLogo />}
  background="/images/auth-bg.jpg"
>
  <LoginForm />
</AuthLayout>
```

---

## @bg-kit/core-panels

Mosaic-style panel system for tool applications.

### PanelContainer

Root container for panel system.

```typescript
import { PanelContainer, Panel } from '@bg-kit/core-panels';

interface PanelContainerProps {
  /** Panel children */
  children: React.ReactNode;

  /** Initial layout configuration */
  initialLayout?: PanelLayout;

  /** Persist layout to localStorage */
  persistLayout?: boolean;

  /** localStorage key (default: 'panel-layout') */
  storageKey?: string;

  /** Callback when layout changes */
  onLayoutChange?: (layout: PanelLayout) => void;

  /** Minimum panel size (pixels) */
  minPanelSize?: number;

  /** Gap between panels (pixels) */
  gap?: number;
}

type PanelLayout = {
  direction: 'row' | 'column';
  first: string | PanelLayout;  // Panel ID or nested layout
  second: string | PanelLayout;
  splitPercentage: number;       // 0-100
};

// Usage Example
<PanelContainer
  initialLayout={{
    direction: 'row',
    first: 'editor',
    second: {
      direction: 'column',
      first: 'preview',
      second: 'console',
      splitPercentage: 60
    },
    splitPercentage: 50
  }}
  persistLayout
  gap={4}
>
  <Panel id="editor"><Editor /></Panel>
  <Panel id="preview"><Preview /></Panel>
  <Panel id="console"><Console /></Panel>
</PanelContainer>
```

### Panel

Individual panel within container.

```typescript
interface PanelProps {
  /** Unique panel ID */
  id: string;

  /** Panel content */
  children: React.ReactNode;

  /** Panel title */
  title?: string;

  /** Panel toolbar/actions */
  toolbar?: React.ReactNode;

  /** Closeable panel */
  closeable?: boolean;

  /** Callback when panel closes */
  onClose?: () => void;

  /** Minimum width/height */
  minSize?: number;
}
```

### usePanelLayout

Hook for programmatic panel layout control.

```typescript
function usePanelLayout(): {
  /** Current layout */
  layout: PanelLayout;

  /** Update layout */
  setLayout: (layout: PanelLayout) => void;

  /** Reset to initial layout */
  reset: () => void;

  /** Save current layout to localStorage */
  save: () => void;

  /** Load layout from localStorage */
  load: () => void;
}
```

---

## @bg-kit/core-responsive

Mobile-first responsive patterns.

### useMediaQuery

React hook for media queries.

```typescript
import { useMediaQuery } from '@bg-kit/core-responsive';

function useMediaQuery(query: string): boolean;

// Usage Example
const isMobile = useMediaQuery('(max-width: 768px)');
const isPortrait = useMediaQuery('(orientation: portrait)');
const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
```

### useBreakpoint

Hook for current breakpoint.

```typescript
type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

function useBreakpoint(): {
  /** Current breakpoint */
  current: Breakpoint;

  /** Check if at least breakpoint */
  isAtLeast: (bp: Breakpoint) => boolean;

  /** Check if at most breakpoint */
  isAtMost: (bp: Breakpoint) => boolean;

  /** Check if exactly breakpoint */
  is: (bp: Breakpoint) => boolean;
}

// Usage Example
const { current, isAtLeast } = useBreakpoint();

if (isAtLeast('md')) {
  // Desktop layout
} else {
  // Mobile layout
}
```

### Show Component

Conditional rendering by breakpoint.

```typescript
interface ShowProps {
  /** Show when breakpoint matches */
  when?: {
    /** Show at least this breakpoint */
    min?: Breakpoint;
    /** Show at most this breakpoint */
    max?: Breakpoint;
    /** Show only at this breakpoint */
    only?: Breakpoint;
  };

  /** Fallback content */
  fallback?: React.ReactNode;

  children: React.ReactNode;
}

// Usage Example
<Show when={{ min: 'md' }}>
  <DesktopNav />
</Show>

<Show when={{ max: 'sm' }}>
  <MobileNav />
</Show>
```

### Stack Component

Responsive stack/grid layout.

```typescript
interface StackProps {
  /** Stack direction (responsive object or string) */
  direction?: 'row' | 'column' | {
    xs?: 'row' | 'column';
    sm?: 'row' | 'column';
    md?: 'row' | 'column';
    lg?: 'row' | 'column';
    xl?: 'row' | 'column';
  };

  /** Gap between items (pixels or responsive object) */
  gap?: number | {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };

  /** Alignment */
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';

  /** Wrap items */
  wrap?: boolean;

  children: React.ReactNode;
}

// Usage Example
<Stack
  direction={{ xs: 'column', md: 'row' }}
  gap={{ xs: 8, md: 16 }}
  align="center"
>
  <Item />
  <Item />
  <Item />
</Stack>
```

---

## @bg-kit/core-crud

CRUD primitives for data management.

### DataTable

Generic data table with sorting, filtering, pagination.

```typescript
interface DataTableProps<T> {
  /** Table data */
  data: T[];

  /** Column definitions */
  columns: ColumnDef<T>[];

  /** Loading state */
  loading?: boolean;

  /** Pagination */
  pagination?: {
    enabled: boolean;
    pageSize?: number;
    currentPage?: number;
    totalItems?: number;
    onPageChange?: (page: number) => void;
  };

  /** Sorting */
  sorting?: {
    enabled: boolean;
    defaultSort?: {
      column: keyof T;
      direction: 'asc' | 'desc';
    };
    onSortChange?: (column: keyof T, direction: 'asc' | 'desc') => void;
  };

  /** Filtering */
  filtering?: {
    enabled: boolean;
    onFilterChange?: (filters: Record<string, any>) => void;
  };

  /** Selection */
  selection?: {
    enabled: boolean;
    selectedRows?: T[];
    onSelectionChange?: (selected: T[]) => void;
  };

  /** Row actions */
  onRowClick?: (row: T) => void;
  onRowEdit?: (row: T) => void;
  onRowDelete?: (row: T) => void;
}

type ColumnDef<T> = {
  /** Column ID */
  id: keyof T;

  /** Display header */
  header: string;

  /** Accessor function */
  accessor: (row: T) => React.ReactNode;

  /** Sortable column */
  sortable?: boolean;

  /** Filterable column */
  filterable?: boolean;

  /** Column width */
  width?: number | string;

  /** Alignment */
  align?: 'left' | 'center' | 'right';
};

// Usage Example
<DataTable
  data={users}
  columns={[
    { id: 'name', header: 'Name', accessor: (u) => u.name, sortable: true },
    { id: 'email', header: 'Email', accessor: (u) => u.email },
    { id: 'role', header: 'Role', accessor: (u) => u.role, filterable: true }
  ]}
  pagination={{ enabled: true, pageSize: 20 }}
  sorting={{ enabled: true }}
  onRowEdit={(user) => openEditModal(user)}
  onRowDelete={(user) => openDeleteModal(user)}
/>
```

### CrudForm

Generic CRUD form with validation.

```typescript
interface CrudFormProps<T> {
  /** Form fields */
  fields: FieldDef<T>[];

  /** Initial values (edit mode) */
  initialValues?: Partial<T>;

  /** Validation schema (Zod) */
  schema?: ZodSchema<T>;

  /** Submit handler */
  onSubmit: (values: T) => void | Promise<void>;

  /** Cancel handler */
  onCancel?: () => void;

  /** Loading state */
  loading?: boolean;

  /** Submit button text */
  submitText?: string;

  /** Cancel button text */
  cancelText?: string;
}

type FieldDef<T> = {
  /** Field name */
  name: keyof T;

  /** Field label */
  label: string;

  /** Field type */
  type: 'text' | 'email' | 'password' | 'number' | 'date' | 'select' | 'textarea' | 'checkbox';

  /** Placeholder */
  placeholder?: string;

  /** Required field */
  required?: boolean;

  /** Options for select */
  options?: Array<{ label: string; value: any }>;

  /** Help text */
  helperText?: string;
};

// Usage Example
<CrudForm
  fields={[
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'role', label: 'Role', type: 'select', options: roles }
  ]}
  initialValues={editingUser}
  schema={userSchema}
  onSubmit={handleSubmit}
  onCancel={closeModal}
/>
```

### CrudModal

Create/Edit modal wrapper.

```typescript
interface CrudModalProps<T> {
  /** Modal open state */
  open: boolean;

  /** Close handler */
  onClose: () => void;

  /** Modal title */
  title: string;

  /** Mode */
  mode: 'create' | 'edit' | 'view';

  /** Form props (passed to CrudForm) */
  formProps: Omit<CrudFormProps<T>, 'onCancel'>;
}

// Usage Example
<CrudModal
  open={modalOpen}
  onClose={() => setModalOpen(false)}
  title="Edit User"
  mode="edit"
  formProps={{
    fields: userFields,
    initialValues: editingUser,
    schema: userSchema,
    onSubmit: handleSave
  }}
/>
```

---

## Breakpoints Configuration

Standard responsive breakpoints used across all core components.

```typescript
export const breakpoints = {
  xs: 0,      // Mobile (all devices)
  sm: 640,    // Large mobile / Small tablet
  md: 768,    // Tablet
  lg: 1024,   // Desktop
  xl: 1280,   // Large desktop
  '2xl': 1536 // Extra large desktop
} as const;

export type Breakpoint = keyof typeof breakpoints;
```

---

## Styling Strategy

All core components use **Emotion** (CSS-in-JS) for library-agnostic styling.

```typescript
// Core components use Emotion
import { css } from '@emotion/react';

const containerStyles = css`
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

// UI wrappers apply library-specific styling
import { MantineProvider } from '@mantine/core';

<MantineProvider>
  <DashboardLayout {...props} />
</MantineProvider>
```

---

## Type Exports

All core packages export types for extension and composition.

```typescript
// @bg-kit/core-layouts
export type {
  DashboardLayoutProps,
  ToolLayoutProps,
  ContentLayoutProps,
  AuthLayoutProps
} from './layouts';

// @bg-kit/core-panels
export type {
  PanelContainerProps,
  PanelProps,
  PanelLayout
} from './panels';

// @bg-kit/core-responsive
export type {
  Breakpoint,
  ShowProps,
  StackProps
} from './responsive';

// @bg-kit/core-crud
export type {
  DataTableProps,
  ColumnDef,
  CrudFormProps,
  FieldDef,
  CrudModalProps
} from './crud';
```

---

## Next Steps

1. **Implement Core Packages**: Build packages following this API spec
2. **Create UI Wrappers**: Build @bg-kit/ui-mantine and @bg-kit/ui-shadcn
3. **Build Generators**: Create generators that use these components
4. **Write Tests**: Comprehensive test coverage for all components
5. **Document Examples**: Storybook stories for all components

---

**API Version**: 1.0
**Status**: Ready for Implementation
**Target**: Brain Garden Rapid Dev Kit v1.0
