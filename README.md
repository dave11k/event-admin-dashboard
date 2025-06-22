# Event Admin Dashboard

A modern, full-stack event management dashboard built with Next.js 15, demonstrating enterprise-level architecture patterns and modern web development practices.

![Event Admin Dashboard](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=flat-square&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=flat-square&logo=tailwind-css)

## 🎯 Project Overview

This project showcases my ability to architect and implement a comprehensive event management system from the ground up. Built as a portfolio piece to demonstrate full-stack development capabilities, it incorporates modern development practices, robust testing strategies, and scalable architecture patterns.

### Live Demo

- **Demo URL**: https://event-admin-dashboard.vercel.app/
- **Demo Credentials**: Use the green "Try Demo" button on the login page
- **Features**: Complete event lifecycle management, user administration, real-time analytics

## 🏗 Architecture & Technical Decisions

### Frontend Architecture

- **Framework**: Next.js 15 with App Router for optimal performance and SEO
- **Language**: TypeScript for type safety and developer experience
- **Styling**: Tailwind CSS with shadcn/ui component system for consistent design
- **State Management**: React Server Components with strategic client components
- **Form Handling**: React Hook Form with Zod validation for robust form management

### Backend & Database

- **Database**: Supabase (PostgreSQL) with Row-Level Security (RLS)
- **Authentication**: Supabase Auth with custom role-based access control
- **API Layer**: Server Actions for type-safe server-client communication
- **Data Fetching**: Optimized queries with proper caching strategies

### Key Technical Decisions & Rationale

#### 1. Next.js 15 App Router Choice

**Decision**: Chose App Router over Pages Router
**Rationale**:

- Better performance with React Server Components
- Simplified data fetching patterns
- Future-proof architecture aligned with React's direction
- Enhanced developer experience with file-based routing

#### 2. Supabase Integration Strategy

**Decision**: Direct Supabase client usage with Server Actions
**Rationale**:

- Eliminates need for custom API routes
- Type-safe database operations
- Built-in real-time capabilities
- Simplified authentication flow
- Cost-effective for MVP development

#### 3. Component Architecture

**Decision**: shadcn/ui + Custom Components hybrid approach
**Rationale**:

- Accelerated development with pre-built, accessible components
- Full customization control (components are copied, not imported)
- Consistent design system
- Easy theming with CSS variables

## 🔧 Development Challenges & Solutions

### Challenge 1: Row-Level Security Implementation

**Problem**: Complex permission system needed for multi-role access control
**Solution**:

- Implemented comprehensive RLS policies for profiles, events, and registrations
- Created role-based permissions (admin/organiser) with proper inheritance
- Added automated profile creation for demo users with verification steps

### Challenge 2: Type Safety Across Database Operations

**Problem**: Maintaining type safety between database schema and TypeScript
**Solution**:

- Generated TypeScript types from Supabase schema
- Created custom type helpers for complex queries
- Implemented strict typing for Server Actions

### Challenge 3: Performance Optimization

**Problem**: Dashboard with multiple data sources causing loading delays
**Solution**:

- Implemented parallel data fetching with Promise.all()
- Used React Suspense for progressive loading
- Optimized database queries with proper indexing

```typescript
// Parallel data fetching example
const [metrics, eventsWithCounts, eventStatusCounts] = await Promise.all([
  getDashboardMetrics(),
  getEventsWithRegistrationCounts(),
  getEventStatusCounts(),
]);
```

## 🧪 Testing Strategy

### Unit Testing

- **Framework**: Jest + React Testing Library
- **Coverage**: Components, hooks, and utility functions
- **Focus**: User interactions and component behavior

### End-to-End Testing

- **Framework**: Playwright
- **Coverage**: Critical user journeys
- **Configuration**: Multi-browser testing (Chrome, Firefox, Safari)

### Quality Assurance

- **ESLint**: Custom configuration for Next.js and TypeScript
- **Prettier**: Consistent code formatting
- **Husky**: Pre-commit hooks for quality gates
- **TypeScript**: Strict mode for maximum type safety

## 📊 Features Implemented

### Core Functionality

- ✅ **Event Management**: Create, edit, delete events with rich metadata
- ✅ **User Administration**: Role-based user management (admin/organiser)
- ✅ **Registration System**: Event registration with capacity management
- ✅ **Dashboard Analytics**: Real-time metrics and visualizations
- ✅ **Authentication**: Secure login with role-based access control
- ✅ **Search & Filtering**: Advanced filtering across events and users
- ✅ **Data Visualization**: Charts and metrics using Recharts
- ✅ **Demo Mode**: One-click demo access with automated setup
- ✅ **Real-time Updates**: Live data synchronization

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/event-admin-dashboard.git
   cd event-admin-dashboard
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   cp .env.local.example .env.local
   # Add your Supabase credentials
   ```

4. **Database Setup**

   ```bash
   # Run the SQL files in order:
   # 1. database/schema.sql
   # 2. database/rls-policies.sql
   # 3. database/seed-data.sql (optional)
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run test         # Run unit tests
npm run test:e2e     # Run Playwright tests
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run typecheck    # TypeScript type checking
npm run check        # Run all quality checks
```

## 🔧 Configuration

### Database Schema

The application uses a normalized PostgreSQL schema with three main entities:

- **profiles**: User information extending Supabase auth.users
- **events**: Event details with creator relationships
- **event_registrations**: Many-to-many relationship for event attendance

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

This project follows modern development practices:

1. **Feature Development**: Feature branch workflow with descriptive commits
2. **Code Review**: PR-based development with automated checks
3. **Quality Gates**: Pre-commit hooks ensure code quality
4. **Testing**: Unit and E2E tests for critical functionality
5. **Deployment**: Automated CI/CD pipeline (when configured)

### Key Learnings

- **Server Components**: Significant performance benefits when used correctly
- **RLS Complexity**: Database-level security requires careful planning
- **Type Safety**: Investment in types pays off in development speed
- **Component Libraries**: shadcn/ui strikes the right balance between speed and control

## 🛠 Built With

### Core Technologies

- **Next.js 15** - React framework with App Router
- **TypeScript 5** - Type-safe JavaScript
- **Supabase** - Database and authentication
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Component library

### Development Tools

- **Jest** - Unit testing framework
- **Playwright** - End-to-end testing
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks

### UI/UX Libraries

- **Radix UI** - Headless component primitives
- **Lucide React** - Icon library
- **Recharts** - Data visualization
- **React Hook Form** - Form management
- **Sonner** - Toast notifications
