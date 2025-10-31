# Research Project Tracker - Frontend

A modern, professional React + TypeScript frontend for the Research Project Tracker system. Built with beautiful animations, responsive design, and role-based access control.

## Features

- **Authentication**: Secure login and registration with JWT tokens
- **Dashboard**: Role-based dashboard with sidebar navigation
- **Projects Management**: Create, read, update, and delete research projects
- **Milestones Tracking**: Timeline view of project milestones with completion tracking
- **Documents Management**: Upload, download, and manage research documents
- **Admin Panel**: User management and system statistics
- **Modern UI/UX**: Beautiful animations, gradients, and smooth transitions
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Role-Based Access Control**: ADMIN, PI, MEMBER, and VIEWER roles

## Technology Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **Framer Motion** - Animations
- **Axios** - HTTP client
- **JWT Decode** - Token decoding
- **Date-fns** - Date formatting
- **Wouter** - Lightweight routing
- **shadcn/ui** - Component library
- **Sonner** - Toast notifications

## Project Structure

```
client/
├── public/          # Static assets
├── src/
│   ├── components/  # Reusable UI components
│   ├── contexts/    # React contexts (Auth, Theme)
│   ├── hooks/       # Custom React hooks
│   ├── lib/         # Utilities and types
│   ├── pages/       # Page components
│   ├── App.tsx      # Main app component
│   ├── main.tsx     # Entry point
│   └── index.css    # Global styles
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Install dependencies
pnpm install

# Set environment variables
cp .env.example .env.local

# Update VITE_API_URL to your backend URL
# VITE_API_URL=http://localhost:8080/api
```

### Development

```bash
# Start development server
pnpm dev

# The app will be available at http://localhost:3000
```

### Build

```bash
# Create production build
pnpm build

# Preview production build
pnpm preview
```

## Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_API_URL=http://localhost:8080/api
```

## Key Components

### Authentication Context
Manages user authentication state, login, signup, and logout functionality.

### Protected Route
Enforces role-based access control for pages and features.

### Dashboard Layout
Main layout component with sidebar navigation and header.

### API Client
Configured Axios instance with JWT interceptors for secure API communication.

## Pages

- **Login** (`/login`) - User authentication
- **Register** (`/register`) - New user registration
- **Projects** (`/projects`) - Project management
- **Milestones** (`/milestones`) - Milestone tracking
- **Documents** (`/documents`) - Document management
- **Admin** (`/admin`) - Admin panel (ADMIN only)

## User Roles

- **ADMIN**: Full system access, user management
- **PI**: Manage own projects and team members
- **MEMBER**: Create and update milestones and documents
- **VIEWER**: Read-only access to public project data

## Styling

The project uses Tailwind CSS with a custom dark theme. Key color variables:

- Primary: Blue (#3B82F6)
- Background: Dark (#0F172A)
- Card: Dark Gray (#1E293B)
- Accent: Slate (#334155)

## Animations

Smooth animations powered by Framer Motion:
- Page transitions
- Card hover effects
- Form animations
- Loading states
- Modal animations

## API Integration

The frontend connects to the Spring Boot backend API with the following endpoints:

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/projects` - List projects
- `POST /api/projects` - Create project
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project
- `GET /api/projects/{id}/milestones` - List milestones
- `POST /api/projects/{id}/milestones` - Create milestone
- `PUT /api/milestones/{id}` - Update milestone
- `DELETE /api/milestones/{id}` - Delete milestone
- `GET /api/projects/{id}/documents` - List documents
- `POST /api/projects/{id}/documents` - Upload document
- `DELETE /api/documents/{id}` - Delete document
- `GET /api/users` - List users (Admin only)
- `DELETE /api/users/{id}` - Delete user (Admin only)

## Performance

- Optimized bundle size with tree-shaking
- Lazy loading of pages
- Efficient re-renders with React hooks
- Responsive images and assets
- CSS-in-JS optimization

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues or questions, please contact the development team or submit an issue on GitHub.
