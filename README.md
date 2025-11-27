# SkillMatchHub Frontend

React frontend for SkillMatchHub - a skill-based job matching platform.

## Tech Stack

- **Framework**: React 18 + Vite
- **Routing**: React Router v6
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: Sonner

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Backend API running on `http://localhost:8000`

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   copy .env.example .env
   ```
   
   Edit `.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   VITE_WS_BASE_URL=ws://localhost:8000
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   
   App will run at `http://localhost:3000`

## Project Structure

```
frontend/
├── src/
│   ├── api/                    # API client and endpoints
│   │   ├── client.js          # Axios instance with interceptors
│   │   └── index.js           # API functions (auth, jobs, profiles, etc.)
│   ├── components/
│   │   ├── auth/              # Auth components (PrivateRoute)
│   │   └── layout/            # Layout components (Header, Footer)
│   ├── pages/                 # Page components
│   │   ├── auth/              # Login, Register, ForgotPassword
│   │   ├── dashboard/         # Job seeker dashboard
│   │   ├── employer/          # Employer pages
│   │   ├── profile/           # Profile pages
│   │   ├── applications/      # Applications pages
│   │   ├── matches/           # Matching pages
│   │   ├── messages/          # Messaging pages
│   │   ├── admin/             # Admin pages
│   │   ├── HomePage.jsx       # Landing page
│   │   ├── JobSearchPage.jsx  # Job search & filters
│   │   └── JobDetailPage.jsx  # Job details
│   ├── stores/                # Zustand stores
│   │   └── authStore.js       # Auth state management
│   ├── utils/                 # Utility functions
│   │   ├── helpers.js         # General helpers
│   │   └── websocket.js       # WebSocket service
│   ├── App.jsx                # Root component with routes
│   ├── main.jsx               # Entry point
│   └── index.css              # Global styles
├── public/                    # Static assets
├── index.html                 # HTML template
├── vite.config.js             # Vite configuration
├── tailwind.config.js         # Tailwind configuration
└── package.json               # Dependencies
```

## Features Implemented

### ✅ Completed
- Authentication (Login, Register, Forgot Password)
- JWT token management with auto-refresh
- Protected routes (Private, Employer, Admin)
- Responsive layout (Header, Footer)
- Home page with hero and features
- Job search with filters
- API client with interceptors
- Auth store (Zustand)
- WebSocket service for real-time messaging
- Helper utilities
- Tailwind CSS styling system

### 🚧 To Be Implemented
- Job detail page with application form
- User dashboard (job seeker)
- Profile pages (view/edit)
- Skill management UI
- Applications tracking
- Matching jobs display
- Real-time messaging UI
- Employer dashboard
- Job posting form
- Candidate matching view
- Admin dashboard

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code
- `npm test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Generate coverage report

## API Integration

The frontend communicates with the Django backend via REST API:

### Authentication Endpoints
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/token/` - Login (get JWT tokens)
- `POST /api/auth/token/refresh/` - Refresh access token
- `GET /api/auth/profile/` - Get current user

### Job Endpoints
- `GET /api/jobs/` - List jobs with filters
- `GET /api/jobs/:id/` - Get job details
- `POST /api/jobs/:id/apply/` - Apply to job

### Profile Endpoints
- `GET /api/profiles/me/` - Get current user profile
- `PUT /api/profiles/me/` - Update profile
- `GET /api/profiles/skills/` - List skills

### Matching Endpoints
- `GET /api/matching/jobs/` - Get matching jobs
- `GET /api/matching/candidates/:jobId/` - Get matching candidates

### Messaging Endpoints
- `GET /api/messages/conversations/` - List conversations
- `WS /ws/chat/:id/` - WebSocket for real-time chat

## State Management

### Auth Store (Zustand)
```javascript
const { user, isAuthenticated, login, logout, register } = useAuthStore()
```

### React Query
```javascript
const { data, isLoading } = useQuery({
  queryKey: ['jobs'],
  queryFn: () => jobsApi.getJobs()
})
```

## Styling

Built with Tailwind CSS. Custom utility classes:

- `.btn` - Base button
- `.btn-primary` - Primary button
- `.btn-secondary` - Secondary button
- `.btn-outline` - Outline button
- `.input` - Input field
- `.card` - Card container
- `.badge` - Badge/tag
- `.badge-primary` - Primary badge

## WebSocket for Real-Time Messaging

```javascript
import { wsService } from '@/utils/websocket'

// Connect
wsService.connect(conversationId)

// Listen for messages
wsService.onMessage((data) => {
  console.log('New message:', data)
})

// Send message
wsService.sendMessage({ content: 'Hello!' })

// Disconnect
wsService.disconnect()
```

## Environment Variables

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_WS_BASE_URL=ws://localhost:8000
VITE_APP_NAME=SkillMatchHub
VITE_ENABLE_ANALYTICS=false
```

## Building for Production

```bash
# Build
npm run build

# Preview build
npm run preview
```

The build output will be in `dist/` directory.

## Deployment

### Static Hosting (Netlify, Vercel, etc.)

1. Build the app: `npm run build`
2. Deploy the `dist/` folder
3. Configure environment variables on the hosting platform
4. Set up redirects for SPA routing

Example `_redirects` file for Netlify:
```
/*  /index.html  200
```

### Docker

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Next Steps

1. **Complete core pages**: Implement Dashboard, Profile, Job Detail pages
2. **Build messaging UI**: Complete real-time chat interface
3. **Implement employer features**: Job posting form, candidate matching
4. **Add tests**: Unit tests for components and integration tests
5. **Optimize performance**: Code splitting, lazy loading
6. **Add analytics**: Track user interactions
7. **Implement SEO**: Meta tags, sitemap

## Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Submit a pull request

## License

MIT License
