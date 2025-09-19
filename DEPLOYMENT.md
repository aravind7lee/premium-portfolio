# Portfolio Deployment Guide

## 404 Error Fix for Netlify and Vercel

This guide explains how to fix the 404 error that occurs when refreshing pages in your Single Page Application (SPA) after deployment.

### Problem
When users navigate to routes like `/about`, `/projects`, etc., and then refresh the page, they get a 404 error because the server doesn't know how to handle these client-side routes.

### Solution
The following files have been created to fix this issue:

#### 1. Netlify Configuration (`public/_redirects`)
```
/*    /index.html   200
```
This tells Netlify to serve `index.html` for all routes, allowing React Router to handle client-side routing.

#### 2. Vercel Configuration (`vercel.json`)
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
This tells Vercel to rewrite all routes to `index.html` for client-side routing.

#### 3. Vite Configuration (`vite.config.js`)
Updated to include proper SPA handling with `historyApiFallback: true`.

### Deployment Steps

#### For Netlify:
1. Build your project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. The `_redirects` file will be automatically included in the build

#### For Vercel:
1. Connect your repository to Vercel
2. Vercel will automatically detect the `vercel.json` configuration
3. Deploy normally - the configuration will handle SPA routing

### Testing
After deployment:
1. Navigate to any route (e.g., `/about`, `/projects`)
2. Refresh the page
3. The page should load correctly without 404 errors

### Additional Notes
- The `_redirects` file must be in the `public` folder to be included in the build
- The `vercel.json` file should be in the root directory
- Both configurations ensure that all routes are handled by your React application
