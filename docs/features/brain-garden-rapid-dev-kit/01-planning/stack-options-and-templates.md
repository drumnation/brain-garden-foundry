# Stack Options and Agent Templates Specification

**Version**: 1.0
**Last Updated**: 2025-11-12
**Status**: Planning Phase

---

## Overview

This document defines the complete set of stack options available in the Brain Garden Rapid Development Kit, the agent templates that correspond to each option, and the decision logic for the planning agent to select optimal combinations.

**Design Philosophy**:
- **Constrained Choices**: 2-3 options per category for maximum control
- **AI-Controllable**: All options must have CLI/API for AI agent control
- **Production-Ready**: All options battle-tested in real-world apps
- **Well-Documented**: Strong TypeScript support and comprehensive docs
- **Active Maintenance**: All libraries actively maintained

---

## Table of Contents

1. [Database Options](#database-options)
2. [Auth Options](#auth-options)
3. [UI Library Options](#ui-library-options)
4. [Layout System Options](#layout-system-options)
5. [Admin Panel Options](#admin-panel-options)
6. [CI/CD Options](#cicd-options)
7. [Agent Template Catalog](#agent-template-catalog)
8. [Stack Compatibility Matrix](#stack-compatibility-matrix)
9. [Decision Logic](#decision-logic)

---

## Database Options

### Option 1: PostgreSQL + Drizzle ORM

**When to Choose**:
- Relational data with complex queries
- Production deployment needs
- ACID compliance requirements
- Multi-user concurrent access
- Scalability beyond MVP

**Pros**:
- Industry standard, battle-tested
- Excellent TypeScript support (Drizzle)
- Type-safe queries
- Great for complex relational models
- Supports advanced features (JSON columns, full-text search)

**Cons**:
- Requires external database server
- More setup complexity than SQLite
- Costs money for hosted solutions

**Agent Required**: `postgres-drizzle-specialist`

**CLI Commands (AI-Controllable)**:
```bash
# Schema management
drizzle-kit generate        # Generate migrations
drizzle-kit push            # Push schema to DB
drizzle-kit studio          # Launch DB browser

# Database operations
psql -h localhost -U user -d dbname  # Connect to DB
pg_dump dbname > backup.sql          # Backup
psql dbname < backup.sql             # Restore
```

**Configuration**:
```json
{
  "database": {
    "type": "postgres",
    "orm": "drizzle",
    "connection": {
      "host": "localhost",
      "port": 5432,
      "user": "{{ env.DB_USER }}",
      "password": "{{ env.DB_PASSWORD }}",
      "database": "{{ projectName }}"
    },
    "migrations": {
      "directory": "drizzle/migrations",
      "tableName": "_drizzle_migrations"
    }
  }
}
```

**Example Schema**:
```typescript
// drizzle/schema/customers.ts
import { pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const customers = pgTable('customers', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  phone: varchar('phone', { length: 20 }),
  status: varchar('status', { length: 20 }).default('active'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});
```

---

### Option 2: SQLite + Drizzle ORM

**When to Choose**:
- Local development and testing
- Single-user applications
- Embedded applications
- Prototypes and MVPs
- No external database infrastructure available

**Pros**:
- Zero configuration (file-based)
- Perfect for local dev
- Fast for small datasets
- No hosting costs
- Easy backups (copy file)

**Cons**:
- Not suitable for production multi-user apps
- Limited concurrent writes
- No network access
- Fewer advanced features than Postgres

**Agent Required**: `sqlite-drizzle-specialist`

**CLI Commands (AI-Controllable)**:
```bash
# Schema management
drizzle-kit generate        # Generate migrations
drizzle-kit push            # Push schema to DB
drizzle-kit studio          # Launch DB browser

# Database operations
sqlite3 database.db ".schema"       # View schema
sqlite3 database.db ".dump" > backup.sql  # Backup
sqlite3 database.db < backup.sql    # Restore
```

**Configuration**:
```json
{
  "database": {
    "type": "sqlite",
    "orm": "drizzle",
    "connection": {
      "filename": "data/{{ projectName }}.db"
    },
    "migrations": {
      "directory": "drizzle/migrations"
    }
  }
}
```

**Example Schema** (identical to Postgres, just imports change):
```typescript
// drizzle/schema/customers.ts
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const customers = sqliteTable('customers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
  phone: text('phone'),
  status: text('status').default('active'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
});
```

---

### Option 3: MongoDB + Mongoose

**When to Choose**:
- Document-oriented data
- Flexible schema requirements
- Rapid prototyping with evolving schema
- Hierarchical or nested data structures
- JSON-heavy applications

**Pros**:
- Schema flexibility
- Great for prototyping
- Easy to work with JSON
- Scalable horizontally
- Rich query language

**Cons**:
- No SQL (different query paradigm)
- Requires external database server
- Less type-safe than Drizzle
- Can lead to schema drift

**Agent Required**: `mongodb-mongoose-specialist`

**CLI Commands (AI-Controllable)**:
```bash
# Database operations
mongosh                              # Connect to MongoDB
mongodump --db {{ dbname }}          # Backup
mongorestore --db {{ dbname }}       # Restore

# Schema operations (via Mongoose)
npx ts-node scripts/seed-db.ts      # Run seed script
npx ts-node scripts/migrate-schema.ts  # Schema migration
```

**Configuration**:
```json
{
  "database": {
    "type": "mongodb",
    "orm": "mongoose",
    "connection": {
      "uri": "{{ env.MONGODB_URI }}",
      "database": "{{ projectName }}"
    },
    "options": {
      "useNewUrlParser": true,
      "useUnifiedTopology": true
    }
  }
}
```

**Example Schema**:
```typescript
// src/db/models/Customer.ts
import mongoose, { Schema, Document } from 'mongoose';

interface ICustomer extends Document {
  name: string;
  email: string;
  phone?: string;
  status: 'active' | 'inactive' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema = new Schema<ICustomer>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  status: { type: String, enum: ['active', 'inactive', 'archived'], default: 'active' },
}, {
  timestamps: true
});

export const Customer = mongoose.model<ICustomer>('Customer', CustomerSchema);
```

---

## Auth Options

### Option 1: JWT (JSON Web Tokens)

**When to Choose**:
- Stateless authentication
- Mobile app support
- Microservices architecture
- API-first applications
- Need for scalability

**Pros**:
- Stateless (no server sessions)
- Works across domains
- Great for SPAs and mobile apps
- Scales horizontally
- Simple to implement

**Cons**:
- Cannot invalidate tokens easily
- Token size overhead
- Requires secure storage on client

**Agent Required**: `jwt-auth-specialist`

**CLI Commands (AI-Controllable)**:
```bash
# Token generation/verification (via API)
curl -X POST /api/auth/login -d '{"email":"user@example.com","password":"secret"}'
curl -X POST /api/auth/refresh -H "Authorization: Bearer {token}"
curl -X POST /api/auth/logout -H "Authorization: Bearer {token}"
```

**Configuration**:
```json
{
  "auth": {
    "type": "jwt",
    "provider": "jsonwebtoken",
    "options": {
      "secret": "{{ env.JWT_SECRET }}",
      "expiresIn": "15m",
      "refreshExpiresIn": "7d",
      "algorithm": "HS256"
    },
    "endpoints": {
      "login": "/api/auth/login",
      "refresh": "/api/auth/refresh",
      "logout": "/api/auth/logout",
      "register": "/api/auth/register"
    }
  }
}
```

**Implementation Example**:
```typescript
// src/api/middleware/auth.ts
import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  // Dev bypass
  if (process.env.NODE_ENV === 'development' && process.env.SKIP_AUTH === 'true') {
    req.user = { userId: 'dev-user', email: 'dev@example.com', role: 'admin' };
    return next();
  }

  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// src/api/routes/auth.ts
export async function login(req, res) {
  const { email, password } = req.body;

  // Verify credentials (omitted)
  const user = await verifyCredentials(email, password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const accessToken = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: '7d' }
  );

  res.json({ accessToken, refreshToken, user });
}
```

---

### Option 2: Session-Based Auth

**When to Choose**:
- Traditional web applications
- Server-rendered pages
- Need to invalidate sessions immediately
- Simpler security requirements
- Monolithic architecture

**Pros**:
- Can invalidate sessions server-side
- Smaller cookie size
- More secure (session data on server)
- Standard web pattern

**Cons**:
- Requires session storage (Redis/DB)
- Doesn't scale horizontally as easily
- CSRF protection needed
- Not ideal for APIs/mobile

**Agent Required**: `session-auth-specialist`

**CLI Commands (AI-Controllable)**:
```bash
# Session management (via Redis CLI if using Redis)
redis-cli KEYS "sess:*"              # List sessions
redis-cli DEL "sess:abc123"          # Delete session
redis-cli FLUSHDB                    # Clear all sessions

# Or via PostgreSQL if using pg store
psql -d dbname -c "DELETE FROM sessions WHERE sid = 'abc123';"
```

**Configuration**:
```json
{
  "auth": {
    "type": "session",
    "provider": "express-session",
    "options": {
      "secret": "{{ env.SESSION_SECRET }}",
      "resave": false,
      "saveUninitialized": false,
      "cookie": {
        "secure": true,
        "httpOnly": true,
        "maxAge": 86400000
      }
    },
    "store": {
      "type": "redis",
      "host": "localhost",
      "port": 6379
    }
  }
}
```

**Implementation Example**:
```typescript
// src/api/middleware/session.ts
import session from 'express-session';
import RedisStore from 'connect-redis';
import { createClient } from 'redis';

const redisClient = createClient({ url: process.env.REDIS_URL });
await redisClient.connect();

export const sessionMiddleware = session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
});

// src/api/routes/auth.ts
export async function login(req, res) {
  const { email, password } = req.body;

  const user = await verifyCredentials(email, password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Store user in session
  req.session.userId = user.id;
  req.session.email = user.email;
  req.session.role = user.role;

  res.json({ user });
}

export async function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out' });
  });
}
```

---

### Option 3: OAuth (via Passport.js)

**When to Choose**:
- Social login required (Google, GitHub, etc.)
- Don't want to manage passwords
- B2C applications
- Need third-party integrations
- Enterprise SSO requirements

**Pros**:
- No password management
- User trust (familiar providers)
- Built-in 2FA (from providers)
- Enterprise ready (SAML, OIDC)
- Passport.js has 500+ strategies

**Cons**:
- Requires OAuth app setup
- Dependency on third-party
- More complex flow
- Privacy considerations

**Agent Required**: `oauth-passport-specialist`

**CLI Commands (AI-Controllable)**:
```bash
# OAuth app configuration (via provider CLI/API)
# Example: GitHub CLI
gh auth login
gh auth status

# Example: Google Cloud CLI
gcloud auth login
gcloud projects list
```

**Configuration**:
```json
{
  "auth": {
    "type": "oauth",
    "provider": "passport",
    "strategies": [
      {
        "name": "google",
        "clientId": "{{ env.GOOGLE_CLIENT_ID }}",
        "clientSecret": "{{ env.GOOGLE_CLIENT_SECRET }}",
        "callbackURL": "/api/auth/google/callback"
      },
      {
        "name": "github",
        "clientId": "{{ env.GITHUB_CLIENT_ID }}",
        "clientSecret": "{{ env.GITHUB_CLIENT_SECRET }}",
        "callbackURL": "/api/auth/github/callback"
      }
    ]
  }
}
```

**Implementation Example**:
```typescript
// src/api/middleware/passport.ts
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: '/api/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  // Find or create user
  const user = await findOrCreateUser({
    provider: 'google',
    providerId: profile.id,
    email: profile.emails?.[0]?.value,
    name: profile.displayName
  });

  done(null, user);
}));

// src/api/routes/auth.ts
export const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email']
});

export const googleCallback = passport.authenticate('google', {
  failureRedirect: '/login'
}), (req, res) => {
  // Success! Redirect or send JWT
  res.redirect('/dashboard');
};
```

---

## UI Library Options

### Option 1: Mantine

**When to Choose**:
- Need comprehensive component library
- TypeScript-first project
- Modern React patterns (hooks)
- Dark mode support required
- Excellent documentation needed

**Pros**:
- 100+ components out of the box
- Excellent TypeScript support
- Built-in dark mode
- Accessible by default
- Active development
- Great docs and examples

**Cons**:
- Larger bundle size than minimal libraries
- Opinionated styling system
- Learning curve for customization

**Agent Required**: `mantine-ui-specialist`

**CLI Commands (AI-Controllable)**:
```bash
# Installation
pnpm add @mantine/core @mantine/hooks @mantine/form @mantine/notifications

# Storybook integration
npx sb init
```

**Configuration**:
```json
{
  "uiLibrary": {
    "type": "mantine",
    "styling": "emotion",
    "version": "7.x",
    "theme": {
      "colorScheme": "light",
      "primaryColor": "blue",
      "fontFamily": "Inter, sans-serif"
    },
    "features": {
      "darkMode": true,
      "notifications": true,
      "modals": true,
      "forms": true
    }
  }
}
```

**Wrapper Example**:
```typescript
// @brain-garden/ui/Button.tsx
import { Button as MantineButton, ButtonProps as MantineButtonProps } from '@mantine/core';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
}

export const Button = (props: ButtonProps) => {
  const { variant = 'primary', size = 'md', ...rest } = props;

  const mantineVariant = variant === 'danger' ? 'filled' : variant === 'secondary' ? 'outline' : 'filled';
  const mantineColor = variant === 'danger' ? 'red' : 'blue';

  return (
    <MantineButton
      variant={mantineVariant}
      color={mantineColor}
      size={size}
      {...rest}
    />
  );
};
```

---

### Option 2: Ant Design

**When to Choose**:
- Enterprise applications
- Data-heavy dashboards
- Need mature component library
- Chinese market (excellent i18n)
- Form-heavy applications

**Pros**:
- Comprehensive component set
- Excellent for enterprise/admin UIs
- Strong form handling
- Great data tables
- Mature and stable

**Cons**:
- Larger bundle size
- Less modern than Mantine
- Customization can be complex
- Design language opinionated

**Agent Required**: `antd-ui-specialist`

**CLI Commands (AI-Controllable)**:
```bash
# Installation
pnpm add antd

# Theme customization
pnpm add @ant-design/cssinjs
```

**Configuration**:
```json
{
  "uiLibrary": {
    "type": "antd",
    "styling": "cssinjs",
    "version": "5.x",
    "theme": {
      "token": {
        "colorPrimary": "#1890ff",
        "borderRadius": 4,
        "fontFamily": "Inter, sans-serif"
      }
    },
    "features": {
      "icons": true,
      "charts": true,
      "proComponents": false
    }
  }
}
```

**Wrapper Example**:
```typescript
// @brain-garden/ui/Button.tsx
import { Button as AntButton, ButtonProps as AntButtonProps } from 'antd';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
}

export const Button = (props: ButtonProps) => {
  const { variant = 'primary', size = 'md', ...rest } = props;

  const antType = variant === 'primary' ? 'primary' : variant === 'danger' ? 'primary' : 'default';
  const antDanger = variant === 'danger';
  const antSize = size === 'sm' ? 'small' : size === 'lg' ? 'large' : 'middle';

  return (
    <AntButton
      type={antType}
      danger={antDanger}
      size={antSize}
      {...rest}
    />
  );
};
```

---

### Option 3: ShadCN UI

**When to Choose**:
- Want minimal bundle size
- Prefer copy-paste components
- Tailwind CSS workflow
- Maximum customization needed
- Modern, trendy aesthetics

**Pros**:
- Copy-paste approach (no dependency)
- Built with Radix UI (accessible)
- Tailwind CSS integration
- Modern design language
- Full control over code

**Cons**:
- Fewer components than Mantine/Ant
- Manual updates required
- Need to manage component code
- Requires Tailwind CSS

**Agent Required**: `shadcn-ui-specialist`

**CLI Commands (AI-Controllable)**:
```bash
# Installation
npx shadcn-ui@latest init

# Add components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add select
```

**Configuration**:
```json
{
  "uiLibrary": {
    "type": "shadcn",
    "styling": "tailwind",
    "components": {
      "path": "src/components/ui",
      "prefix": ""
    },
    "tailwind": {
      "config": "tailwind.config.js",
      "css": "src/app/globals.css"
    }
  }
}
```

**Wrapper Example**:
```typescript
// @brain-garden/ui/Button.tsx (re-exports ShadCN)
import { Button as ShadcnButton } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export const Button = (props: ButtonProps) => {
  const { variant = 'primary', size = 'md', className, ...rest } = props;

  const shadcnVariant = variant === 'danger' ? 'destructive' : variant === 'secondary' ? 'secondary' : 'default';
  const shadcnSize = size;

  return (
    <ShadcnButton
      variant={shadcnVariant}
      size={shadcnSize}
      className={cn(className)}
      {...rest}
    />
  );
};
```

---

### Option 4: Plain (Custom with Emotion)

**When to Choose**:
- Maximum control over styling
- Minimal dependencies
- Performance critical
- Unique design system
- Learning/teaching purposes

**Pros**:
- Zero dependencies (except Emotion)
- Complete control
- Smallest bundle size
- No opinion conflicts
- Fast iterations

**Cons**:
- Build everything from scratch
- No pre-built components
- More development time
- Need to ensure accessibility

**Agent Required**: `custom-ui-emotion-specialist`

**CLI Commands (AI-Controllable)**:
```bash
# Installation
pnpm add @emotion/react @emotion/styled
```

**Configuration**:
```json
{
  "uiLibrary": {
    "type": "plain",
    "styling": "emotion",
    "theme": {
      "colors": {
        "primary": "#007bff",
        "secondary": "#6c757d",
        "danger": "#dc3545"
      },
      "spacing": {
        "sm": "8px",
        "md": "16px",
        "lg": "24px"
      },
      "typography": {
        "fontFamily": "Inter, sans-serif",
        "fontSize": {
          "sm": "14px",
          "md": "16px",
          "lg": "18px"
        }
      }
    }
  }
}
```

**Implementation Example**:
```typescript
// @brain-garden/ui/Button.tsx
import styled from '@emotion/styled';
import { Theme } from './theme';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
}

const StyledButton = styled.button<{ variant: string; size: string }>`
  padding: ${p => p.size === 'sm' ? '8px 16px' : p.size === 'lg' ? '16px 32px' : '12px 24px'};
  font-size: ${p => p.size === 'sm' ? '14px' : p.size === 'lg' ? '18px' : '16px'};
  background: ${p => {
    if (p.variant === 'primary') return '#007bff';
    if (p.variant === 'danger') return '#dc3545';
    return '#6c757d';
  }};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: inherit;
  font-weight: 500;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const Button = (props: ButtonProps) => {
  const { variant = 'primary', size = 'md', ...rest } = props;

  return (
    <StyledButton variant={variant} size={size} {...rest}>
      {props.children}
    </StyledButton>
  );
};
```

---

## Layout System Options

### Option 1: react-mosaic (Tool Panels)

**When to Choose**:
- Tool-centric applications (like Photoshop, VS Code)
- Multi-panel workflows
- Need drag-and-drop panel management
- Desktop-like experiences
- Power user applications

**Pros**:
- Photoshop-style panel system
- Drag-and-drop built-in
- Persistent layouts
- Highly customizable
- Great for complex UIs

**Cons**:
- Learning curve
- Mobile not ideal
- Complex setup
- Overkill for simple apps

**Agent Required**: `mosaic-layout-specialist`

**CLI Commands (AI-Controllable)**:
```bash
# Installation
pnpm add react-mosaic-component

# Optional: Add persistence
pnpm add localforage
```

**Configuration**:
```json
{
  "layout": {
    "type": "mosaic",
    "preset": "tool-panels",
    "persistence": {
      "enabled": true,
      "storage": "localStorage",
      "key": "mosaic-layout"
    },
    "panels": [
      { "id": "list", "title": "Customer List", "minSize": 300 },
      { "id": "detail", "title": "Customer Detail", "minSize": 400 },
      { "id": "activity", "title": "Activity Feed", "minSize": 250 }
    ]
  }
}
```

**Implementation Example**:
```typescript
// src/layouts/MosaicLayout.tsx
import { Mosaic, MosaicWindow } from 'react-mosaic-component';
import 'react-mosaic-component/react-mosaic-component.css';

const panels = {
  list: <CustomerList />,
  detail: <CustomerDetail />,
  activity: <ActivityFeed />
};

export const MosaicLayout = () => {
  const [layout, setLayout] = useState({
    direction: 'row',
    first: 'list',
    second: {
      direction: 'column',
      first: 'detail',
      second: 'activity',
      splitPercentage: 60
    },
    splitPercentage: 30
  });

  return (
    <Mosaic
      renderTile={(id, path) => (
        <MosaicWindow path={path} title={id}>
          {panels[id]}
        </MosaicWindow>
      )}
      value={layout}
      onChange={setLayout}
    />
  );
};
```

---

### Option 2: CSS Grid

**When to Choose**:
- Responsive layouts needed
- Simple grid-based designs
- Mobile-first approach
- Standard web layouts
- Maximum browser support

**Pros**:
- Native CSS (no dependency)
- Excellent responsive support
- Simple to understand
- Works everywhere
- Low learning curve

**Cons**:
- Less dynamic than Mosaic
- No built-in drag-and-drop
- Manual responsive breakpoints
- Less suited for complex layouts

**Agent Required**: `grid-layout-specialist`

**Configuration**:
```json
{
  "layout": {
    "type": "grid",
    "responsive": true,
    "breakpoints": {
      "mobile": 768,
      "tablet": 1024,
      "desktop": 1440
    },
    "areas": {
      "mobile": ["header", "main", "footer"],
      "desktop": ["header header", "sidebar main", "footer footer"]
    }
  }
}
```

**Implementation Example**:
```typescript
// src/layouts/GridLayout.tsx
import styled from '@emotion/styled';

const GridContainer = styled.div`
  display: grid;
  height: 100vh;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 250px 1fr;
  grid-template-rows: 60px 1fr 60px;
  gap: 0;

  @media (max-width: 768px) {
    grid-template-areas:
      "header"
      "main"
      "footer";
    grid-template-columns: 1fr;
    grid-template-rows: 60px 1fr 60px;
  }
`;

const Header = styled.header`
  grid-area: header;
  background: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
`;

const Sidebar = styled.aside`
  grid-area: sidebar;
  background: #ffffff;
  border-right: 1px solid #dee2e6;

  @media (max-width: 768px) {
    display: none;
  }
`;

const Main = styled.main`
  grid-area: main;
  padding: 20px;
  overflow-y: auto;
`;

const Footer = styled.footer`
  grid-area: footer;
  background: #f8f9fa;
  border-top: 1px solid #dee2e6;
`;

export const GridLayout = ({ children }) => (
  <GridContainer>
    <Header>Header</Header>
    <Sidebar>Sidebar</Sidebar>
    <Main>{children}</Main>
    <Footer>Footer</Footer>
  </GridContainer>
);
```

---

### Option 3: Flexbox Stack

**When to Choose**:
- Simple vertical/horizontal stacks
- Mobile-first design
- Minimal layout needs
- Content-driven layouts
- Maximum simplicity

**Pros**:
- Simplest option
- Great browser support
- Easy to understand
- Responsive by default
- No dependencies

**Cons**:
- Limited to 1D layouts
- Less powerful than Grid
- Manual spacing management
- Not suited for complex layouts

**Agent Required**: `stack-layout-specialist`

**Configuration**:
```json
{
  "layout": {
    "type": "stack",
    "direction": "vertical",
    "spacing": "md",
    "responsive": true,
    "mobileBreakpoint": 768
  }
}
```

**Implementation Example**:
```typescript
// src/layouts/StackLayout.tsx
import styled from '@emotion/styled';

interface StackProps {
  direction?: 'vertical' | 'horizontal';
  spacing?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const StyledStack = styled.div<{ direction: string; spacing: string }>`
  display: flex;
  flex-direction: ${p => p.direction === 'vertical' ? 'column' : 'row'};
  gap: ${p => p.spacing === 'sm' ? '8px' : p.spacing === 'lg' ? '24px' : '16px'};

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const Stack = ({ direction = 'vertical', spacing = 'md', children }: StackProps) => (
  <StyledStack direction={direction} spacing={spacing}>
    {children}
  </StyledStack>
);
```

---

## Admin Panel Options

### Option 1: React Admin

**When to Choose**:
- Need full-featured admin panel
- CRUD operations primary focus
- RESTful API backend
- Enterprise requirements
- Complex data relationships

**Pros**:
- Comprehensive feature set
- Built-in CRUD scaffolding
- Excellent data handling
- Many providers (REST, GraphQL)
- Active community

**Cons**:
- Opinionated architecture
- Learning curve
- Bundle size
- Customization can be complex

**Agent Required**: `react-admin-specialist`

**CLI Commands (AI-Controllable)**:
```bash
# Installation
pnpm add react-admin ra-data-simple-rest

# Code generation
npx create-react-admin-app
```

**Configuration**:
```json
{
  "adminPanel": {
    "type": "react-admin",
    "version": "4.x",
    "dataProvider": "simpleRest",
    "apiUrl": "/api",
    "resources": [
      {
        "name": "customers",
        "icon": "UserIcon",
        "list": true,
        "show": true,
        "edit": true,
        "create": true
      },
      {
        "name": "deals",
        "icon": "DollarIcon",
        "list": true,
        "show": true,
        "edit": true,
        "create": true
      }
    ]
  }
}
```

**Implementation Example**:
```typescript
// src/admin/App.tsx
import { Admin, Resource, ListGuesser, EditGuesser } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';

const dataProvider = simpleRestProvider('/api');

export const AdminApp = () => (
  <Admin dataProvider={dataProvider}>
    <Resource name="customers" list={ListGuesser} edit={EditGuesser} />
    <Resource name="deals" list={ListGuesser} edit={EditGuesser} />
    <Resource name="tasks" list={ListGuesser} edit={EditGuesser} />
  </Admin>
);
```

---

### Option 2: Refine

**When to Choose**:
- Modern React patterns
- Headless architecture
- Custom UI needed
- Multiple backend types
- Flexibility over opinions

**Pros**:
- Headless (bring your own UI)
- Excellent TypeScript support
- Multiple data providers
- Active development
- Great documentation

**Cons**:
- More setup than React Admin
- Fewer built-in components
- Smaller community
- Need to build more yourself

**Agent Required**: `refine-admin-specialist`

**CLI Commands (AI-Controllable)**:
```bash
# Installation
pnpm create refine-app@latest

# Add providers
pnpm add @refinedev/simple-rest
pnpm add @refinedev/mantine # or antd, mui
```

**Configuration**:
```json
{
  "adminPanel": {
    "type": "refine",
    "version": "4.x",
    "uiFramework": "mantine",
    "dataProvider": "simpleRest",
    "apiUrl": "/api",
    "resources": [
      {
        "name": "customers",
        "list": "/customers",
        "create": "/customers/create",
        "edit": "/customers/edit/:id",
        "show": "/customers/show/:id"
      }
    ]
  }
}
```

**Implementation Example**:
```typescript
// src/admin/App.tsx
import { Refine } from '@refinedev/core';
import { RefineKbar, RefineKbarProvider } from '@refinedev/kbar';
import routerProvider from '@refinedev/react-router-v6';
import dataProvider from '@refinedev/simple-rest';
import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';

export const AdminApp = () => (
  <RefineKbarProvider>
    <MantineProvider>
      <NotificationsProvider>
        <Refine
          routerProvider={routerProvider}
          dataProvider={dataProvider('/api')}
          resources={[
            {
              name: 'customers',
              list: '/customers',
              create: '/customers/create',
              edit: '/customers/edit/:id',
              show: '/customers/show/:id'
            }
          ]}
        >
          <RefineKbar />
          {/* Routes */}
        </Refine>
      </NotificationsProvider>
    </MantineProvider>
  </RefineKbarProvider>
);
```

---

### Option 3: None (Custom)

**When to Choose**:
- Unique admin requirements
- Maximum control needed
- Small admin needs
- Learning purposes
- Budget constraints

**Pros**:
- Complete control
- No dependencies
- Build exactly what you need
- Learn by building

**Cons**:
- More development time
- Need to build everything
- No built-in features
- Manual CRUD handling

**Agent Required**: `custom-admin-specialist`

**Configuration**:
```json
{
  "adminPanel": {
    "type": "none",
    "custom": true,
    "features": {
      "crud": "manual",
      "routing": "react-router",
      "forms": "react-hook-form",
      "tables": "tanstack-table"
    }
  }
}
```

---

## CI/CD Options

### Option 1: Vercel

**When to Choose**:
- Next.js applications
- Want zero-config deployment
- Free tier sufficient
- Preview deployments needed
- Simplest setup

**Pros**:
- Zero configuration
- Excellent Next.js support
- Free tier generous
- Instant previews
- Great DX

**Cons**:
- Vendor lock-in
- Costs can escalate
- Limited control over infrastructure
- Primarily for frontend

**Agent Required**: `vercel-deployment-specialist`

**CLI Commands (AI-Controllable)**:
```bash
# Installation
pnpm add -g vercel

# Deployment
vercel deploy
vercel deploy --prod

# Environment variables
vercel env add JWT_SECRET production
vercel env pull .env.local

# Logs
vercel logs
```

**Configuration**:
```json
{
  "cicd": {
    "provider": "vercel",
    "projectId": "{{ env.VERCEL_PROJECT_ID }}",
    "teamId": "{{ env.VERCEL_TEAM_ID }}",
    "builds": {
      "outputDirectory": ".next",
      "installCommand": "pnpm install",
      "buildCommand": "pnpm build"
    },
    "env": {
      "NODE_ENV": "production",
      "DATABASE_URL": "{{ env.DATABASE_URL }}",
      "JWT_SECRET": "{{ env.JWT_SECRET }}"
    }
  }
}
```

**vercel.json**:
```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "env": {
    "NODE_ENV": "production"
  }
}
```

---

### Option 2: Render.com

**When to Choose**:
- Full-stack applications
- Need databases + Redis
- Free tier with persistent storage
- Docker deployment
- More control than Vercel

**Pros**:
- Full-stack support (DB, Redis, etc.)
- Free PostgreSQL database
- Docker support
- Background workers
- Reasonable pricing

**Cons**:
- Slower cold starts than Vercel
- Less polished DX
- Smaller community
- Limited regions

**Agent Required**: `render-deployment-specialist`

**CLI Commands (AI-Controllable)**:
```bash
# No official CLI yet, use render.yaml

# Deploy via Git push
git push origin main  # Auto-deploys

# Or via API
curl -X POST https://api.render.com/deploy/{{ serviceId }}
```

**Configuration**:
```json
{
  "cicd": {
    "provider": "render",
    "services": [
      {
        "type": "web",
        "name": "{{ projectName }}-api",
        "runtime": "node",
        "buildCommand": "pnpm install && pnpm build",
        "startCommand": "pnpm start",
        "envVars": {
          "NODE_ENV": "production",
          "DATABASE_URL": "{{ env.DATABASE_URL }}",
          "JWT_SECRET": "{{ env.JWT_SECRET }}"
        }
      },
      {
        "type": "pserv",
        "name": "{{ projectName }}-db",
        "region": "oregon",
        "plan": "starter",
        "databaseName": "{{ projectName }}",
        "databaseUser": "{{ projectName }}_user"
      }
    ]
  }
}
```

**render.yaml**:
```yaml
services:
  - type: web
    name: myapp-api
    runtime: node
    buildCommand: pnpm install && pnpm build
    startCommand: pnpm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: myapp-db
          property: connectionString
      - key: JWT_SECRET
        generateValue: true

databases:
  - name: myapp-db
    databaseName: myapp
    user: myapp_user
```

---

### Option 3: Digital Ocean App Platform

**When to Choose**:
- Need managed Kubernetes
- Want more infrastructure control
- Regional requirements
- Established Digital Ocean usage
- Budget-conscious

**Pros**:
- Good balance of control and simplicity
- Competitive pricing
- Multiple regions
- Full-stack support
- Managed databases

**Cons**:
- More complex than Vercel
- CLI less polished
- Smaller ecosystem
- Manual scaling configuration

**Agent Required**: `digitalocean-deployment-specialist`

**CLI Commands (AI-Controllable)**:
```bash
# Installation
brew install doctl  # macOS
# or snap install doctl  # Linux

# Authentication
doctl auth init

# App deployment
doctl apps create --spec .do/app.yaml
doctl apps list
doctl apps update {{ appId }} --spec .do/app.yaml

# Logs
doctl apps logs {{ appId }}
```

**Configuration**:
```json
{
  "cicd": {
    "provider": "digitalocean",
    "region": "nyc",
    "services": [
      {
        "name": "{{ projectName }}-api",
        "buildCommand": "pnpm install && pnpm build",
        "runCommand": "pnpm start",
        "instanceSize": "basic-xxs"
      }
    ],
    "databases": [
      {
        "name": "{{ projectName }}-db",
        "engine": "PG",
        "version": "15"
      }
    ]
  }
}
```

**.do/app.yaml**:
```yaml
name: myapp
region: nyc
services:
  - name: api
    github:
      repo: username/myapp
      branch: main
    build_command: pnpm install && pnpm build
    run_command: pnpm start
    instance_size_slug: basic-xxs
    envs:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        scope: RUN_TIME
        type: SECRET

databases:
  - name: db
    engine: PG
    version: "15"
    size: db-s-1vcpu-1gb
```

---

### Option 4: AWS CDK

**When to Choose**:
- Enterprise requirements
- Need full AWS services
- Infrastructure as code
- Compliance requirements
- Large-scale applications

**Pros**:
- Full AWS ecosystem
- Infrastructure as code (TypeScript!)
- Maximum flexibility
- Enterprise-grade
- Fine-grained control

**Cons**:
- Complex setup
- Expensive (can be)
- Steep learning curve
- Requires AWS knowledge
- Verbose configuration

**Agent Required**: `aws-cdk-deployment-specialist`

**CLI Commands (AI-Controllable)**:
```bash
# Installation
pnpm add -g aws-cdk

# CDK commands
cdk init app --language typescript
cdk synth
cdk deploy
cdk diff
cdk destroy

# AWS CLI
aws s3 ls
aws ssm put-parameter --name /app/JWT_SECRET --value "xxx" --type SecureString
```

**Configuration**:
```json
{
  "cicd": {
    "provider": "aws-cdk",
    "region": "us-east-1",
    "stacks": {
      "database": {
        "type": "rds-postgres",
        "instanceClass": "t3.micro"
      },
      "compute": {
        "type": "fargate",
        "cpu": 256,
        "memory": 512
      },
      "storage": {
        "type": "s3",
        "bucketName": "{{ projectName }}-assets"
      }
    }
  }
}
```

**CDK Stack Example**:
```typescript
// infra/lib/app-stack.ts
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as rds from 'aws-cdk-lib/aws-rds';

export class AppStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPC
    const vpc = new ec2.Vpc(this, 'AppVpc', {
      maxAzs: 2
    });

    // RDS Postgres
    const db = new rds.DatabaseInstance(this, 'Database', {
      engine: rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_15 }),
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      vpc,
      databaseName: 'myapp'
    });

    // ECS Fargate
    const cluster = new ecs.Cluster(this, 'Cluster', { vpc });

    const taskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDef', {
      cpu: 256,
      memoryLimitMiB: 512
    });

    const container = taskDefinition.addContainer('App', {
      image: ecs.ContainerImage.fromRegistry('myapp:latest'),
      environment: {
        NODE_ENV: 'production',
        DATABASE_URL: db.dbInstanceEndpointAddress
      },
      logging: ecs.LogDrivers.awsLogs({ streamPrefix: 'myapp' })
    });

    container.addPortMappings({ containerPort: 3000 });

    new ecs.FargateService(this, 'Service', {
      cluster,
      taskDefinition,
      desiredCount: 1
    });
  }
}
```

---

## Agent Template Catalog

This section lists all specialist agents and their responsibilities.

### Database Agents

**postgres-drizzle-specialist**
- Responsibilities: Schema design, migrations, queries, indexes
- Checkpoints: 1-5 (typically first phase)
- Dependencies: None
- Knowledge: Drizzle ORM, PostgreSQL, SQL optimization

**sqlite-drizzle-specialist**
- Responsibilities: Schema design, migrations, queries
- Checkpoints: 1-5 (typically first phase)
- Dependencies: None
- Knowledge: Drizzle ORM, SQLite, file-based DB patterns

**mongodb-mongoose-specialist**
- Responsibilities: Schema design, models, queries
- Checkpoints: 1-5 (typically first phase)
- Dependencies: None
- Knowledge: Mongoose, MongoDB, document modeling

---

### Auth Agents

**jwt-auth-specialist**
- Responsibilities: JWT generation, validation, refresh tokens, middleware
- Checkpoints: 6-10 (after database)
- Dependencies: Database (user table)
- Knowledge: JWT, jsonwebtoken, security best practices

**session-auth-specialist**
- Responsibilities: Session management, Redis/DB store, cookies
- Checkpoints: 6-10 (after database)
- Dependencies: Database (sessions table) or Redis
- Knowledge: express-session, session stores, CSRF protection

**oauth-passport-specialist**
- Responsibilities: OAuth strategies, provider integration, user mapping
- Checkpoints: 6-10 (after database)
- Dependencies: Database (users table)
- Knowledge: Passport.js, OAuth 2.0, provider APIs

---

### UI Agents

**mantine-ui-specialist**
- Responsibilities: Component wrapping, theming, Storybook stories
- Checkpoints: 11-15 (after auth)
- Dependencies: None (parallel with auth)
- Knowledge: Mantine, Emotion, accessibility

**antd-ui-specialist**
- Responsibilities: Component wrapping, theme customization, i18n
- Checkpoints: 11-15 (after auth)
- Dependencies: None (parallel with auth)
- Knowledge: Ant Design, CSS-in-JS, enterprise patterns

**shadcn-ui-specialist**
- Responsibilities: Component installation, Tailwind config, customization
- Checkpoints: 11-15 (after auth)
- Dependencies: None (parallel with auth)
- Knowledge: ShadCN, Radix UI, Tailwind CSS

**custom-ui-emotion-specialist**
- Responsibilities: Custom component design, Emotion styling, design system
- Checkpoints: 11-15 (after auth)
- Dependencies: None (parallel with auth)
- Knowledge: Emotion, CSS-in-JS, design systems

---

### Layout Agents

**mosaic-layout-specialist**
- Responsibilities: Panel system, drag-and-drop, persistence, presets
- Checkpoints: 16-20 (after UI components)
- Dependencies: UI components
- Knowledge: react-mosaic, layout patterns, state management

**grid-layout-specialist**
- Responsibilities: CSS Grid layouts, responsive breakpoints, areas
- Checkpoints: 16-20 (after UI components)
- Dependencies: UI components
- Knowledge: CSS Grid, responsive design, flexbox

**stack-layout-specialist**
- Responsibilities: Simple stack layouts, spacing, mobile-first
- Checkpoints: 16-20 (after UI components)
- Dependencies: UI components
- Knowledge: Flexbox, CSS fundamentals, responsive design

---

### Admin Panel Agents

**react-admin-specialist**
- Responsibilities: Data provider, resources, CRUD scaffolding, customization
- Checkpoints: 21-26 (after database + UI)
- Dependencies: Database, UI components
- Knowledge: React Admin, data providers, resource configuration

**refine-admin-specialist**
- Responsibilities: Data provider, resources, routing, UI integration
- Checkpoints: 21-26 (after database + UI)
- Dependencies: Database, UI components
- Knowledge: Refine, data providers, headless patterns

**custom-admin-specialist**
- Responsibilities: Custom CRUD, forms, tables, routing
- Checkpoints: 21-26 (after database + UI)
- Dependencies: Database, UI components
- Knowledge: React patterns, form libraries, table libraries

---

### Deployment Agents

**vercel-deployment-specialist**
- Responsibilities: vercel.json config, environment variables, deployment, monitoring
- Checkpoints: 27-31 (final phase)
- Dependencies: All previous checkpoints complete
- Knowledge: Vercel CLI, Next.js deployment, serverless

**render-deployment-specialist**
- Responsibilities: render.yaml config, services, databases, environment variables
- Checkpoints: 27-31 (final phase)
- Dependencies: All previous checkpoints complete
- Knowledge: Render.com, Docker, full-stack deployment

**digitalocean-deployment-specialist**
- Responsibilities: .do/app.yaml config, app platform, databases, scaling
- Checkpoints: 27-31 (final phase)
- Dependencies: All previous checkpoints complete
- Knowledge: Digital Ocean, doctl CLI, managed services

**aws-cdk-deployment-specialist**
- Responsibilities: CDK stacks, VPC, RDS, ECS, IAM, deployment
- Checkpoints: 27-31 (final phase)
- Dependencies: All previous checkpoints complete
- Knowledge: AWS CDK, TypeScript, AWS services

---

### Orchestrator Agent

**stack-orchestrator**
- Responsibilities: Coordinate all specialists, manage dependencies, track progress
- Checkpoints: All (oversees entire workflow)
- Dependencies: None (top-level)
- Knowledge: Project management, dependency resolution, parallel execution

---

## Stack Compatibility Matrix

This matrix shows which stack options work well together and which have conflicts.

```
               | Postgres | SQLite | MongoDB | JWT | Session | OAuth | Mantine | Ant | ShadCN | Plain | Mosaic | Grid | Stack | R-Admin | Refine | Custom | Vercel | Render | DO | AWS |
---------------|----------|--------|---------|-----|---------|-------|---------|-----|--------|-------|--------|------|-------|---------|--------|--------|--------|--------|----|----|
Postgres       |    ✓     |   ⚠️    |   ⚠️     |  ✓  |    ✓    |   ✓   |    ✓    |  ✓  |   ✓    |   ✓   |   ✓    |  ✓   |   ✓   |    ✓    |   ✓    |   ✓    |   ✓    |   ✓    | ✓  | ✓  |
SQLite         |    ⚠️     |   ✓    |   ⚠️     |  ✓  |    ⚠️    |   ✓   |    ✓    |  ✓  |   ✓    |   ✓   |   ✓    |  ✓   |   ✓   |    ✓    |   ✓    |   ✓    |   ⚠️    |   ⚠️    | ⚠️  | ⚠️  |
MongoDB        |    ⚠️     |   ⚠️    |   ✓     |  ✓  |    ✓    |   ✓   |    ✓    |  ✓  |   ✓    |   ✓   |   ✓    |  ✓   |   ✓   |    ⚠️    |   ✓    |   ✓    |   ✓    |   ✓    | ✓  | ✓  |
JWT            |    ✓     |   ✓    |   ✓     |  ✓  |    ❌    |   ❌   |    ✓    |  ✓  |   ✓    |   ✓   |   ✓    |  ✓   |   ✓   |    ✓    |   ✓    |   ✓    |   ✓    |   ✓    | ✓  | ✓  |
Session        |    ✓     |   ⚠️    |   ✓     |  ❌  |    ✓    |   ❌   |    ✓    |  ✓  |   ✓    |   ✓   |   ✓    |  ✓   |   ✓   |    ✓    |   ✓    |   ✓    |   ⚠️    |   ✓    | ✓  | ✓  |
OAuth          |    ✓     |   ✓    |   ✓     |  ❌  |    ❌    |   ✓   |    ✓    |  ✓  |   ✓    |   ✓   |   ✓    |  ✓   |   ✓   |    ✓    |   ✓    |   ✓    |   ✓    |   ✓    | ✓  | ✓  |
Mantine        |    ✓     |   ✓    |   ✓     |  ✓  |    ✓    |   ✓   |    ✓    |  ❌  |   ❌    |   ❌   |   ✓    |  ✓   |   ✓   |    ✓    |   ✓    |   ✓    |   ✓    |   ✓    | ✓  | ✓  |
Ant Design     |    ✓     |   ✓    |   ✓     |  ✓  |    ✓    |   ✓   |    ❌    |  ✓  |   ❌    |   ❌   |   ✓    |  ✓   |   ✓   |    ✓    |   ✓    |   ✓    |   ✓    |   ✓    | ✓  | ✓  |
ShadCN UI      |    ✓     |   ✓    |   ✓     |  ✓  |    ✓    |   ✓   |    ❌    |  ❌  |   ✓    |   ❌   |   ✓    |  ✓   |   ✓   |    ⚠️    |   ✓    |   ✓    |   ✓    |   ✓    | ✓  | ✓  |
Plain/Emotion  |    ✓     |   ✓    |   ✓     |  ✓  |    ✓    |   ✓   |    ❌    |  ❌  |   ❌    |   ✓   |   ✓    |  ✓   |   ✓   |    ⚠️    |   ✓    |   ✓    |   ✓    |   ✓    | ✓  | ✓  |
Mosaic         |    ✓     |   ✓    |   ✓     |  ✓  |    ✓    |   ✓   |    ✓    |  ✓  |   ✓    |   ✓   |   ✓    |  ❌  |   ❌   |    ✓    |   ✓    |   ✓    |   ✓    |   ✓    | ✓  | ✓  |
Grid           |    ✓     |   ✓    |   ✓     |  ✓  |    ✓    |   ✓   |    ✓    |  ✓  |   ✓    |   ✓   |   ❌    |  ✓  |   ❌   |    ✓    |   ✓    |   ✓    |   ✓    |   ✓    | ✓  | ✓  |
Stack          |    ✓     |   ✓    |   ✓     |  ✓  |    ✓    |   ✓   |    ✓    |  ✓  |   ✓    |   ✓   |   ❌    |  ❌  |   ✓   |    ✓    |   ✓    |   ✓    |   ✓    |   ✓    | ✓  | ✓  |
React Admin    |    ✓     |   ✓    |   ⚠️     |  ✓  |    ✓    |   ✓   |    ✓    |  ✓  |   ⚠️    |   ⚠️   |   ✓    |  ✓   |   ✓   |    ✓    |   ❌    |   ❌   |   ✓    |   ✓    | ✓  | ✓  |
Refine         |    ✓     |   ✓    |   ✓     |  ✓  |    ✓    |   ✓   |    ✓    |  ✓  |   ✓    |   ✓   |   ✓    |  ✓   |   ✓   |    ❌    |   ✓    |   ❌   |   ✓    |   ✓    | ✓  | ✓  |
Custom Admin   |    ✓     |   ✓    |   ✓     |  ✓  |    ✓    |   ✓   |    ✓    |  ✓  |   ✓    |   ✓   |   ✓    |  ✓   |   ✓   |    ❌    |   ❌    |   ✓    |   ✓    |   ✓    | ✓  | ✓  |
Vercel         |    ✓     |   ⚠️    |   ✓     |  ✓  |    ⚠️    |   ✓   |    ✓    |  ✓  |   ✓    |   ✓   |   ✓    |  ✓   |   ✓   |    ✓    |   ✓    |   ✓    |   ✓    |   ❌    | ❌  | ❌  |
Render.com     |    ✓     |   ⚠️    |   ✓     |  ✓  |    ✓    |   ✓   |    ✓    |  ✓  |   ✓    |   ✓   |   ✓    |  ✓   |   ✓   |    ✓    |   ✓    |   ✓    |   ❌    |   ✓    | ❌  | ❌  |
Digital Ocean  |    ✓     |   ⚠️    |   ✓     |  ✓  |    ✓    |   ✓   |    ✓    |  ✓  |   ✓    |   ✓   |   ✓    |  ✓   |   ✓   |    ✓    |   ✓    |   ✓    |   ❌    |   ❌    | ✓  | ❌  |
AWS CDK        |    ✓     |   ⚠️    |   ✓     |  ✓  |    ✓    |   ✓   |    ✓    |  ✓  |   ✓    |   ✓   |   ✓    |  ✓   |   ✓   |    ✓    |   ✓    |   ✓    |   ❌    |   ❌    | ❌  | ✓  |
```

**Legend**:
- ✓ = Fully compatible, recommended
- ⚠️ = Compatible with caveats (see notes)
- ❌ = Incompatible or not recommended

**Caveats**:
- **SQLite + Session Auth**: Possible but requires file-based session store (not ideal for production)
- **SQLite + Vercel**: Possible but ephemeral filesystem (data loss on redeploy)
- **MongoDB + React Admin**: Requires custom data provider (REST provider won't work)
- **ShadCN + React Admin**: Possible but requires custom UI components
- **Session Auth + Vercel**: Requires Redis/external session store (Vercel serverless is stateless)

---

## Decision Logic

This section defines the decision logic used by the planning agent to select optimal stack combinations.

### Database Selection

```typescript
function selectDatabase(requirements: Requirements): DatabaseChoice {
  // Production deployment with relational data → Postgres
  if (requirements.production && requirements.relational) {
    return { type: 'postgres', orm: 'drizzle' };
  }

  // Document store or flexible schema → MongoDB
  if (requirements.documentOriented || requirements.flexibleSchema) {
    return { type: 'mongodb', orm: 'mongoose' };
  }

  // Local dev, prototype, or simple app → SQLite
  if (requirements.localDev || requirements.prototype || requirements.simple) {
    return { type: 'sqlite', orm: 'drizzle' };
  }

  // Default: SQLite (safest for local dev)
  return { type: 'sqlite', orm: 'drizzle' };
}
```

**Example PRD → Database Decision**:

PRD: "Build a CRM for small businesses with customers, deals, and tasks"
- Relational: ✓ (customers → deals, deals → tasks)
- Production: ✓ (implied by "for small businesses")
- **Decision: PostgreSQL + Drizzle**

PRD: "Build a content management system for blog posts with flexible metadata"
- Document-oriented: ✓ (blog posts with varying metadata)
- Flexible schema: ✓ ("flexible metadata")
- **Decision: MongoDB + Mongoose**

PRD: "Build a personal task tracker for local use"
- Local dev: ✓ ("for local use")
- Simple: ✓ ("personal task tracker")
- **Decision: SQLite + Drizzle**

---

### Auth Selection

```typescript
function selectAuth(requirements: Requirements): AuthChoice {
  // Social login required → OAuth
  if (requirements.socialLogin || requirements.oauthProviders) {
    return { type: 'oauth', provider: 'passport' };
  }

  // Mobile app or API-first → JWT
  if (requirements.mobileApp || requirements.apiFirst || requirements.microservices) {
    return { type: 'jwt', provider: 'jsonwebtoken' };
  }

  // Traditional web app with server sessions → Session
  if (requirements.traditionalWeb || requirements.serverRendered) {
    return { type: 'session', provider: 'express-session' };
  }

  // Default: JWT (most flexible)
  return { type: 'jwt', provider: 'jsonwebtoken' };
}
```

**Example PRD → Auth Decision**:

PRD: "Build a mobile-friendly app with user accounts"
- Mobile app: ✓ ("mobile-friendly")
- **Decision: JWT**

PRD: "Build a SaaS app with Google and GitHub login"
- Social login: ✓ ("Google and GitHub login")
- **Decision: OAuth via Passport**

PRD: "Build a traditional web app with user sessions"
- Traditional web: ✓ ("traditional web app")
- Server sessions: ✓ ("user sessions")
- **Decision: Session-based**

---

### UI Library Selection

```typescript
function selectUILibrary(requirements: Requirements): UIChoice {
  // Enterprise or data-heavy → Ant Design
  if (requirements.enterprise || requirements.dataHeavy || requirements.adminFirst) {
    return { type: 'antd', styling: 'cssinjs' };
  }

  // Modern, TypeScript-first, comprehensive → Mantine
  if (requirements.modern || requirements.typescript || requirements.darkMode) {
    return { type: 'mantine', styling: 'emotion' };
  }

  // Minimal, Tailwind workflow → ShadCN
  if (requirements.tailwind || requirements.minimal || requirements.copyPaste) {
    return { type: 'shadcn', styling: 'tailwind' };
  }

  // Maximum control or learning → Plain/Emotion
  if (requirements.customDesign || requirements.learning || requirements.minimal) {
    return { type: 'plain', styling: 'emotion' };
  }

  // Default: Mantine (best balance)
  return { type: 'mantine', styling: 'emotion' };
}
```

**Example PRD → UI Decision**:

PRD: "Build a modern dashboard with dark mode support"
- Modern: ✓
- Dark mode: ✓
- **Decision: Mantine**

PRD: "Build an enterprise admin panel with complex data tables"
- Enterprise: ✓
- Data-heavy: ✓
- **Decision: Ant Design**

PRD: "Build a marketing site with custom design and Tailwind CSS"
- Tailwind: ✓
- Custom design: ✓
- **Decision: ShadCN UI**

---

### Layout Selection

```typescript
function selectLayout(requirements: Requirements): LayoutChoice {
  // Tool-centric, multi-panel, power users → Mosaic
  if (requirements.toolPanels || requirements.dragAndDrop || requirements.powerUsers) {
    return { type: 'mosaic', preset: 'tool-panels' };
  }

  // Complex responsive layouts → Grid
  if (requirements.complexLayout || requirements.responsive) {
    return { type: 'grid', responsive: true };
  }

  // Simple, vertical stacking → Stack
  if (requirements.simple || requirements.mobileFirst) {
    return { type: 'stack', direction: 'vertical' };
  }

  // Default: Grid (most versatile)
  return { type: 'grid', responsive: true };
}
```

**Example PRD → Layout Decision**:

PRD: "Build a design tool with draggable panels like Photoshop"
- Tool panels: ✓
- Drag and drop: ✓
- **Decision: react-mosaic**

PRD: "Build a responsive blog with sidebar and main content"
- Responsive: ✓
- **Decision: CSS Grid**

PRD: "Build a simple mobile-first app with vertical content"
- Mobile-first: ✓
- Simple: ✓
- **Decision: Flexbox Stack**

---

### Admin Panel Selection

```typescript
function selectAdminPanel(requirements: Requirements): AdminChoice {
  // Comprehensive admin needs → React Admin
  if (requirements.comprehensiveAdmin || requirements.crudHeavy) {
    return { type: 'react-admin', version: '4.x' };
  }

  // Headless, modern patterns → Refine
  if (requirements.headless || requirements.customUI || requirements.modernPatterns) {
    return { type: 'refine', version: '4.x' };
  }

  // Minimal admin needs or maximum control → Custom
  if (requirements.minimalAdmin || requirements.customAdmin || requirements.learning) {
    return { type: 'none', custom: true };
  }

  // Default: React Admin (most complete)
  return { type: 'react-admin', version: '4.x' };
}
```

**Example PRD → Admin Decision**:

PRD: "Build a SaaS with full CRUD admin for all entities"
- CRUD-heavy: ✓
- Comprehensive admin: ✓
- **Decision: React Admin**

PRD: "Build a custom admin with unique UI requirements"
- Custom UI: ✓
- Headless: ✓
- **Decision: Refine**

PRD: "Build a simple app with minimal admin needs"
- Minimal admin: ✓
- **Decision: Custom (none)**

---

### CI/CD Selection

```typescript
function selectCICD(requirements: Requirements): CICDChoice {
  // Next.js or simple deployment → Vercel
  if (requirements.nextjs || requirements.simpleDeployment) {
    return { provider: 'vercel' };
  }

  // Full-stack with databases → Render.com
  if (requirements.fullStack || requirements.database) {
    return { provider: 'render' };
  }

  // Infrastructure control, regional requirements → Digital Ocean
  if (requirements.infrastructureControl || requirements.regionalRequirements) {
    return { provider: 'digitalocean' };
  }

  // Enterprise, AWS ecosystem → AWS CDK
  if (requirements.enterprise || requirements.awsEcosystem || requirements.compliance) {
    return { provider: 'aws-cdk' };
  }

  // Default: Vercel (simplest)
  return { provider: 'vercel' };
}
```

**Example PRD → CI/CD Decision**:

PRD: "Build a Next.js app with simple deployment needs"
- Next.js: ✓
- Simple deployment: ✓
- **Decision: Vercel**

PRD: "Build a full-stack app with PostgreSQL database"
- Full-stack: ✓
- Database: ✓
- **Decision: Render.com**

PRD: "Build an enterprise app with AWS services"
- Enterprise: ✓
- AWS ecosystem: ✓
- **Decision: AWS CDK**

---

## Example Stack Configurations

Here are complete stack configurations for common application types.

### Example 1: Simple CRUD App (Basic)

**PRD Summary**: "Build a simple task tracker with user authentication"

**Generated Stack**:
```json
{
  "projectName": "task-tracker",
  "stack": {
    "database": {
      "type": "sqlite",
      "orm": "drizzle",
      "justification": "Simple app, local dev focus"
    },
    "auth": {
      "type": "jwt",
      "provider": "jsonwebtoken",
      "justification": "Stateless, simple to implement"
    },
    "uiLibrary": {
      "type": "mantine",
      "styling": "emotion",
      "justification": "Comprehensive components, TypeScript support"
    },
    "layout": {
      "type": "stack",
      "direction": "vertical",
      "justification": "Simple vertical layout sufficient"
    },
    "adminPanel": {
      "type": "none",
      "custom": true,
      "justification": "Simple CRUD, custom forms sufficient"
    },
    "cicd": {
      "provider": "vercel",
      "justification": "Simple deployment, free tier"
    }
  },
  "agents": {
    "sqlite-drizzle-specialist": { "enabled": true, "checkpoints": [1, 2, 3, 4, 5] },
    "jwt-auth-specialist": { "enabled": true, "checkpoints": [6, 7, 8, 9, 10] },
    "mantine-ui-specialist": { "enabled": true, "checkpoints": [11, 12, 13, 14, 15] },
    "stack-layout-specialist": { "enabled": true, "checkpoints": [16, 17, 18] },
    "custom-admin-specialist": { "enabled": true, "checkpoints": [19, 20, 21, 22] },
    "vercel-deployment-specialist": { "enabled": true, "checkpoints": [23, 24, 25] },
    "stack-orchestrator": { "enabled": true, "checkpoints": "all" }
  }
}
```

---

### Example 2: Enterprise CRM (Complex)

**PRD Summary**: "Build a CRM for sales teams with customers, deals, tasks, and multi-panel workspace"

**Generated Stack**:
```json
{
  "projectName": "enterprise-crm",
  "stack": {
    "database": {
      "type": "postgres",
      "orm": "drizzle",
      "justification": "Production deployment, relational data, scalability"
    },
    "auth": {
      "type": "oauth",
      "provider": "passport",
      "strategies": ["google", "microsoft"],
      "justification": "Enterprise SSO requirements"
    },
    "uiLibrary": {
      "type": "antd",
      "styling": "cssinjs",
      "justification": "Enterprise UI, data-heavy dashboards"
    },
    "layout": {
      "type": "mosaic",
      "preset": "tool-panels",
      "justification": "Multi-panel workspace requirement"
    },
    "adminPanel": {
      "type": "react-admin",
      "version": "4.x",
      "justification": "Comprehensive CRUD for all entities"
    },
    "cicd": {
      "provider": "aws-cdk",
      "justification": "Enterprise deployment, compliance requirements"
    }
  },
  "agents": {
    "postgres-drizzle-specialist": { "enabled": true, "checkpoints": [1, 2, 3, 4, 5] },
    "oauth-passport-specialist": { "enabled": true, "checkpoints": [6, 7, 8, 9, 10] },
    "antd-ui-specialist": { "enabled": true, "checkpoints": [11, 12, 13, 14, 15] },
    "mosaic-layout-specialist": { "enabled": true, "checkpoints": [16, 17, 18, 19, 20] },
    "react-admin-specialist": { "enabled": true, "checkpoints": [21, 22, 23, 24, 25, 26] },
    "aws-cdk-deployment-specialist": { "enabled": true, "checkpoints": [27, 28, 29, 30, 31] },
    "stack-orchestrator": { "enabled": true, "checkpoints": "all" }
  }
}
```

---

### Example 3: SaaS Marketing Site (Modern)

**PRD Summary**: "Build a modern marketing site with blog, pricing page, and sign-up flow"

**Generated Stack**:
```json
{
  "projectName": "saas-marketing",
  "stack": {
    "database": {
      "type": "mongodb",
      "orm": "mongoose",
      "justification": "Flexible schema for blog content"
    },
    "auth": {
      "type": "jwt",
      "provider": "jsonwebtoken",
      "justification": "API-first for future mobile app"
    },
    "uiLibrary": {
      "type": "shadcn",
      "styling": "tailwind",
      "justification": "Modern aesthetics, Tailwind workflow"
    },
    "layout": {
      "type": "grid",
      "responsive": true,
      "justification": "Responsive marketing pages"
    },
    "adminPanel": {
      "type": "refine",
      "version": "4.x",
      "uiFramework": "shadcn",
      "justification": "Headless admin for blog content"
    },
    "cicd": {
      "provider": "vercel",
      "justification": "Next.js, simple deployment"
    }
  },
  "agents": {
    "mongodb-mongoose-specialist": { "enabled": true, "checkpoints": [1, 2, 3, 4, 5] },
    "jwt-auth-specialist": { "enabled": true, "checkpoints": [6, 7, 8, 9, 10] },
    "shadcn-ui-specialist": { "enabled": true, "checkpoints": [11, 12, 13, 14, 15] },
    "grid-layout-specialist": { "enabled": true, "checkpoints": [16, 17, 18, 19] },
    "refine-admin-specialist": { "enabled": true, "checkpoints": [20, 21, 22, 23, 24, 25] },
    "vercel-deployment-specialist": { "enabled": true, "checkpoints": [26, 27, 28, 29] },
    "stack-orchestrator": { "enabled": true, "checkpoints": "all" }
  }
}
```

---

## End of Stack Options Document
