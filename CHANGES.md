# All Changes Made

## 1. `client/src/pages/patient/AppointmentHistory.jsx`

### Change A: Added missing EmptyState import
```jsx
// BEFORE (caused blank page crash)
import Badge from '../../components/ui/Badge';

// AFTER
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
```

### Change B: Fixed API URL that sent empty status parameter
```jsx
// BEFORE (sent ?status=&limit=50 - backend rejected empty status "")
queryFn: () => API.get(`/appointments/my?status=${filter}&limit=50`),

// AFTER (only includes status when a filter is selected)
queryFn: () => API.get(`/appointments/my?limit=50${filter ? `&status=${filter}` : ''}`),
```

## 2. `client/src/pages/patient/UpcomingAppointments.jsx`

### Change A: Added missing EmptyState import
```jsx
import EmptyState from '../../components/ui/EmptyState';
```

### Change B: Fixed React Query v5 API syntax
```jsx
// BEFORE (old v4 API)
queryClient.invalidateQueries(['upcomingAppointments'])

// AFTER (correct v5 API)
queryClient.invalidateQueries({ queryKey: ['upcomingAppointments'] })
```

## 3. `vercel.json` (NEW FILE - at repo root)

```json
{
  "buildCommand": "cd client && npm install && npm run build",
  "outputDirectory": "client/dist",
  "installCommand": "cd client && npm install",
  "framework": "vite",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

## Why the page is still broken

The error logs show Vercel is still serving the **old cached version** (`index-CrwabOdS.js`). The root `vercel.json` was just added, so Vercel needs to:

1. Detect the new `vercel.json` at repo root
2. Rebuild using the `client/` directory
3. Deploy the new build

**You need to manually redeploy Vercel:**
1. Go to https://vercel.com/dashboard
2. Find your "medi-book" project
3. Go to **Deployments** tab
4. Click **"Redeploy"** on the latest deployment
5. OR click **"Deploy" → "Deploy Hooks"** and trigger it

The new build should produce a different JS filename (not `index-CrwabOdS.js`) once the `vercel.json` is picked up.