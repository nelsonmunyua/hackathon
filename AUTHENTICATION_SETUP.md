# Clerk Authentication Implementation

## Overview

This document describes the Clerk authentication implementation for the JiraniLink application, including user ID tracking across all pages.

## Files Created

### 1. `.env`

- Contains the Clerk publishable key
- **Important**: This file is now in `.gitignore` and should not be committed to version control
- Each developer needs to create their own `.env` file with the key

### 2. `src/hooks/useAuth.js`

Custom React hook that provides easy access to authenticated user data:

- `isLoaded`: Boolean indicating if Clerk has loaded
- `isSignedIn`: Boolean indicating if user is signed in
- `user`: Full Clerk user object
- `userId`: Clerk user ID (used throughout the app)
- `userEmail`: User's primary email address
- `userName`: User's full name or first name
- `userAvatar`: User's profile image URL

### 3. `src/pages/SignIn.jsx`

Sign-in page component using Clerk's `<SignIn />` component with:

- Routing configuration
- Redirect to sign-up page
- Post-sign-in redirect to home page

### 4. `src/pages/SignUp.jsx`

Sign-up page component using Clerk's `<SignUp />` component with:

- Routing configuration
- Redirect to sign-in page
- Post-sign-up redirect to home page

## Files Modified

### 1. `.gitignore`

Added environment variable files to prevent committing sensitive keys:

```
.env
.env.local
.env.*.local
```

### 2. `src/main.jsx`

Wrapped the entire app with `ClerkProvider`:

- Imports Clerk publishable key from environment variables
- Validates key exists before rendering
- Provides authentication context to all components

### 3. `src/App.jsx`

Added authentication routing and protected routes:

- Created `ProtectedRoute` component that redirects unauthenticated users to sign-in
- Added public routes: `/`, `/sign-in/*`, `/sign-up/*`
- Protected routes: `/catalog`, `/my-items`, `/profile`
- Uses Clerk's `SignedIn`, `SignedOut`, and `RedirectToSignIn` components

### 4. `src/components/Navbar.jsx`

Updated navigation with authentication features:

- Shows different navigation items based on authentication status
- Displays user's name with welcome message when signed in
- Includes Clerk's `<UserButton />` component for account management
- Shows "Sign In" and "Sign Up" buttons when signed out
- Uses `useAuth` hook to access user data

### 5. `src/pages/Profile.jsx`

Integrated Clerk user ID for profile management:

- Uses `useAuth` hook to get `userId`, `userName`, `userEmail`, `userAvatar`
- Filters user's items by Clerk `userId` instead of mock data
- Filters borrow history by Clerk `userId`
- Displays user's Clerk avatar or placeholder
- Shows user's email and Clerk user ID
- Loading state based on Clerk's `isLoaded`

### 6. `src/pages/MyItems.jsx`

Integrated Clerk user ID for item management:

- Uses `useAuth` hook to get `userId`
- Filters user's items by Clerk `userId`
- Filters borrow requests by Clerk `userId`
- Logs actions with user ID for tracking
- Loading state based on Clerk's `isLoaded`

### 7. `src/pages/Catalog.jsx`

Integrated Clerk user ID for borrow requests:

- Uses `useAuth` hook to get `userId`
- Assigns Clerk `userId` to all borrow requests
- Includes timestamp for request tracking
- Loading state based on Clerk's `isLoaded`

### 8. `src/App.css`

Added styling for authentication components:

- Auth page layout with gradient background
- Sign-up button styling in navbar
- Welcome text styling
- Clerk UserButton integration styles
- User avatar and placeholder styles
- User ID display styling

## User ID Tracking

The Clerk user ID is now used throughout the application:

1. **Profile Page**:

   - Displays user's Clerk ID
   - Filters items owned by the user
   - Filters borrow history for the user

2. **My Items Page**:

   - Shows only items owned by the authenticated user
   - Shows borrow requests for user's items
   - Logs actions with user ID

3. **Catalog Page**:
   - Assigns user ID to all borrow requests
   - Tracks which user is making each request

## Authentication Flow

1. **Unauthenticated User**:

   - Can access home page
   - Redirected to sign-in when accessing protected routes
   - Sees "Sign In" and "Sign Up" buttons in navbar

2. **Authenticated User**:
   - Can access all pages (home, catalog, my items, profile)
   - Sees personalized welcome message with their name
   - Has access to UserButton for account management
   - All actions are tracked with their unique Clerk user ID

## Environment Setup

To run this application, you need to:

1. Create a `.env` file in the root directory
2. Add your Clerk publishable key:
   ```
   VITE_CLERK_PUBLISHABLE_KEY=your_key_here
   ```
3. Install dependencies: `npm install`
4. Run the development server: `npm run dev`

## Security Notes

- The `.env` file is excluded from version control
- Never commit API keys or secrets to the repository
- Each developer needs their own Clerk publishable key
- The Clerk publishable key is safe to use in client-side code

## Next Steps

To fully integrate with a backend:

1. Store user data in a database with Clerk user ID as the primary key
2. Create API endpoints that validate Clerk JWT tokens
3. Update mock data references to use real database queries
4. Implement real-time updates for borrow requests
5. Add user profile editing functionality
6. Implement item creation and management with user ID tracking

## Git Commit

All changes have been committed and pushed to the `victor/dev` branch with the message:
"Add Clerk authentication with user ID tracking across all pages"
