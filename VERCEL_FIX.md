# Fix for Vercel Build Error: "Cannot use 'import.meta' outside a module"

## Problem
Vercel automatically detects analytics and injects `@nuxtjs/web-vitals` module during build, which uses ESM syntax (`import.meta`) incompatible with Nuxt 2.

## Solution (TWO STEPS REQUIRED)

### Step 1: Code Changes (Already Applied)
✅ Removed `@nuxtjs/web-vitals` from `buildModules` in nuxt.config.js
✅ Removed it from `build.transpile` array
✅ Created `.nuxtrc` with `webVitals.disabled=true`
✅ Added `VERCEL_ANALYTICS_ID` environment variable in vercel.json

### Step 2: Disable Vercel Analytics in Dashboard (REQUIRED)

The code changes alone won't work because Vercel forcibly injects the module during build. You MUST disable analytics in your Vercel project settings:

1. Go to **Vercel Dashboard**: https://vercel.com/dashboard
2. Select your project: **self-promo-nuxt**
3. Click on **Settings** tab
4. Click on **Analytics** in the left sidebar
5. Toggle OFF **"Enable Vercel Analytics"**
6. Save changes

### Step 3: Redeploy

After disabling analytics in the dashboard:
```bash
git add .
git commit -m "Fix Vercel build: Remove web-vitals and disable analytics"
git push
```

Vercel will now rebuild without injecting @nuxtjs/web-vitals, and the build should succeed.

## Why This Happens
- Vercel's build process automatically detects if analytics can be enabled
- It modifies `.nuxtrc` file during build to add `@nuxtjs/web-vitals`
- This module uses modern ESM syntax (`import.meta.dev`) that Nuxt 2's jiti loader can't handle
- The only way to prevent this is to disable analytics at the platform level

## Alternative Solution (If You Want Analytics)
If you want to keep Vercel Analytics, you would need to:
1. Upgrade to Nuxt 3 (which supports ESM modules properly)
2. Or use a different analytics solution compatible with Nuxt 2
