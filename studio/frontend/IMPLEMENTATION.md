# Frontend Implementation Guide

## Architecture Overview

This frontend follows React best practices with a clean, scalable architecture:

```
studio/frontend/
├── app/                    # Next.js App Router pages
│   ├── threats/           # Threat feed page
│   └── layout.tsx         # Root layout with API config
├── hooks/                 # Custom React hooks
│   ├── useProjects.ts    # Projects data management
│   └── useThreats.ts     # Threats data management with polling
├── lib/                   # Utility libraries
│   └── api/
│       ├── config.ts     # API client configuration
│       └── threats.ts    # Threats API service
├── contexts/              # React contexts
│   └── AuthContext.tsx   # Authentication context (placeholder)
└── generated/             # Auto-generated API client
    ├── models/           # TypeScript types
    └── services/         # API service classes
```

---

## Key Features

### 1. Custom Hooks Pattern
Encapsulates data fetching logic for reusability and testability.

**useProjects Hook:**
```typescript
const { projects, loading, error, refetch } = useProjects({ userId });
```

**useThreats Hook:**
```typescript
const { threats, loading, error, refetch } = useThreats({
  projectId: selectedProjectId,
  pollingInterval: 5000, // Auto-refresh every 5 seconds
});
```

### 2. Type-Safe API Client
Uses generated TypeScript types from OpenAPI spec:
- `ProjectsService` - Generated from backend
- `ThreatsAPI` - Custom service for threats endpoint

### 3. Real-time Updates
Automatic polling with configurable intervals:
```typescript
pollingInterval: 5000 // Refresh threats every 5 seconds
```

### 4. Error Handling
Comprehensive error states at every level:
- Loading states
- Error messages
- Empty states

---

## Setup Instructions

### 1. Configure Environment Variables

Create `.env.local`:
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

### 4. Configure User ID

In `app/threats/page.tsx`, replace:
```typescript
const userId = "YOUR_USER_ID_HERE";
```

With actual user ID from your auth system.

---

## API Integration

### Endpoints Used

1. **Get User Projects**
   ```typescript
   ProjectsService.readUserProjectsApiV1ProjectsUserUserIdGet(userId)
   ```
   - Fetches all projects for the authenticated user
   - Called once on page load

2. **Get Threats for Project**
   ```typescript
   ThreatsAPI.getThreatsForProject(projectId, limit, skip)
   ```
   - Fetches threats for selected project
   - Polls every 5 seconds for updates

---

## Component Flow

```
ThreatFeed Page
    ↓
useProjects Hook → Fetch user's projects
    ↓
User selects project from dropdown
    ↓
useThreats Hook → Fetch threats for selected project
    ↓
Auto-refresh every 5 seconds
    ↓
Display threats in real-time feed
```

---

## State Management

### Projects State
- Loaded once on mount
- Cached in component state
- First project auto-selected

### Threats State
- Depends on selected project
- Auto-refreshes via polling
- Clears when project changes

---

## Customization

### Change Polling Interval
```typescript
const { threats } = useThreats({
  projectId: selectedProjectId,
  pollingInterval: 10000, // 10 seconds instead of 5
});
```

### Add Pagination
```typescript
const { threats } = useThreats({
  projectId: selectedProjectId,
  limit: 50,
  skip: page * 50,
});
```

### Add Filtering
Extend the `useThreats` hook to accept additional filters:
```typescript
interface UseThreatsOptions {
  projectId: string | null;
  minRiskScore?: number;
  country?: string;
  // ... other filters
}
```

---

## Authentication Integration

### Step 1: Implement Auth Context

Replace the placeholder in `contexts/AuthContext.tsx` with your auth provider:

```typescript
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(null);
  
  // Your auth logic here
  
  return (
    <AuthContext.Provider value={{ userId: user?.id }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### Step 2: Wrap App with Provider

In `app/layout.tsx`:
```typescript
import { AuthProvider } from '@/contexts/AuthContext';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

### Step 3: Use in Components

In `app/threats/page.tsx`:
```typescript
import { useAuth } from '@/contexts/AuthContext';

export default function ThreatFeed() {
  const { userId } = useAuth();
  // ... rest of component
}
```

---

## Performance Optimizations

1. **Memoization**: Hooks use `useCallback` to prevent unnecessary re-renders
2. **Polling Cleanup**: Intervals are properly cleaned up on unmount
3. **Conditional Fetching**: Only fetches when projectId is available
4. **Type Safety**: Full TypeScript coverage prevents runtime errors

---

## Testing

### Test Custom Hooks
```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useThreats } from '@/hooks/useThreats';

test('fetches threats for project', async () => {
  const { result } = renderHook(() => 
    useThreats({ projectId: 'test-id' })
  );
  
  await waitFor(() => {
    expect(result.current.threats).toHaveLength(5);
  });
});
```

---

## Troubleshooting

### API Connection Issues
1. Check `.env.local` has correct `NEXT_PUBLIC_API_URL`
2. Verify backend is running on specified port
3. Check browser console for CORS errors

### No Projects Showing
1. Verify `userId` is correct
2. Check backend has projects for that user
3. Look for errors in browser console

### Threats Not Updating
1. Verify project is selected
2. Check polling interval is set
3. Ensure backend `/threats` endpoint is working

---

## Next Steps

1. Implement real authentication
2. Add user profile management
3. Add threat filtering UI
4. Implement WebSocket for real-time updates
5. Add threat details modal
6. Export threats to CSV/JSON
