# Cast Portal Setup

This project now includes a working browser-side auth flow for the cast portal.

## Files added/updated

- `cast-portal.html`
- `login.html`
- `supabase-config.js`
- `supabase-setup.sql`

## What you must do next

### 1. Create a Supabase project
Create a project in Supabase and copy:

- Project URL
- anon public key

### 2. Update `supabase-config.js`
Replace the placeholder values:

```js
window.APP_CONFIG = {
  SUPABASE_URL: 'https://YOUR-PROJECT.supabase.co',
  SUPABASE_ANON_KEY: 'YOUR_SUPABASE_ANON_KEY'
};
```

### 3. Run `supabase-setup.sql`
In Supabase SQL Editor, run the SQL from `supabase-setup.sql`.

### 4. Create your users
In Supabase Authentication:
- create each cast/admin user
- copy their user UUID
- add matching rows in `user_profiles`
- add matching rows in `show_access`

### 5. Create destination pages
The portal redirects to pages like:
- `cast-bare.html`
- `admin-bare.html`
- `cast-fences.html`
- `admin-fences.html`
- etc.

Those files must exist for redirects to succeed.

## Current behavior

- If Supabase is not configured, login buttons are disabled.
- If a user is already signed in and clicks a show/role button, the portal checks `show_access` and redirects.
- If the user is not signed in, they are sent to `login.html`.
- The login page validates access before redirecting.
- Logout is supported.

## Important note

This setup uses the public anon key in the browser, which is normal for Supabase. Access control must be enforced by Row Level Security policies, not by hiding keys.
