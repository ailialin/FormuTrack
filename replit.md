# Overview

This is a comprehensive cosmetics formulation management system built with React, TypeScript, Express.js, and PostgreSQL. The application helps cosmetics manufacturers manage Master Formulation Sheets (MFS), track raw materials, calculate batch productions, and perform cost analysis. It provides role-based access for different departments (R&D, Production, Finance, Admin) with features for formulation versioning, batch generation, and material management.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React with TypeScript**: Modern component-based UI using functional components and hooks
- **Routing**: Client-side routing implemented with Wouter for lightweight navigation
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Framework**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **Form Handling**: React Hook Form with Zod validation for type-safe form management
- **Build Tool**: Vite for fast development and optimized production builds

## Backend Architecture
- **Express.js Server**: RESTful API server with TypeScript support
- **Database ORM**: Drizzle ORM for type-safe database operations and migrations
- **API Structure**: Organized route handlers for authentication, MFS management, materials, and batch calculations
- **Error Handling**: Centralized error handling middleware for consistent API responses
- **Development Setup**: Hot module replacement in development with production-ready build process

## Database Design
- **PostgreSQL**: Primary database using Neon serverless PostgreSQL
- **Schema Design**: 
  - Users table with role-based access (admin, rd, production, finance)
  - Master Formulation Sheets with versioning support
  - Raw materials catalog with supplier and cost information
  - Packaging options and batch production tracking
  - JSON storage for complex formulation data and QC parameters

## Authentication & Authorization
- **Simple Token-Based Auth**: Basic authentication system with localStorage persistence
- **Role-Based Access**: Four user roles with different permission levels
- **Session Management**: Client-side session handling with user context

## Component Architecture
- **Layout System**: Sidebar navigation with header and main content areas
- **Reusable Components**: Modular UI components following atomic design principles
- **Feature-Based Organization**: Components organized by feature domains (dashboard, MFS, materials)
- **Form Components**: Specialized form components with validation and error handling

# External Dependencies

## Database & ORM
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle ORM**: Type-safe database toolkit with migration support
- **Drizzle Kit**: Database management and migration tools

## UI & Styling
- **Radix UI**: Headless UI primitives for accessibility and customization
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: For managing component variants

## Data Management
- **TanStack Query**: Server state management with caching and synchronization
- **React Hook Form**: Form state management with performance optimization
- **Zod**: Runtime type validation and schema definition

## Development Tools
- **Vite**: Build tool with HMR and optimized bundling
- **TypeScript**: Static type checking and improved developer experience
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS & Autoprefixer**: CSS processing and vendor prefixing

## Third-Party Integrations
- **Date-fns**: Date manipulation and formatting utilities
- **Embla Carousel**: Touch-friendly carousel component
- **Wouter**: Minimalist client-side routing
- **CMDK**: Command palette component for enhanced UX