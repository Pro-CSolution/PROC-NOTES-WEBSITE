# Pro-C Client Work Tracker

React/Vite client, job, and note tracker with automatic Supabase cloud storage.

## Cloud Database Setup

1. Create a free project at https://supabase.com.
2. Open the project's SQL Editor and run `supabase-setup.sql`.
3. In Supabase, open the **Connect** dialog and copy the Project URL and Publishable key.
4. Copy `.env.example` to `.env.local` and fill in:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_YOUR_KEY
```

5. In Supabase Authentication URL Configuration:
   - Set the local redirect URL to `http://localhost:5175`
   - After publishing, add the production website URL.
6. Keep Email authentication enabled. For a private tracker, invite approved users and disable open sign-ups.

When Supabase variables are configured, users sign in by email magic link and all changes save automatically to the shared cloud database. Without those variables, the app falls back to browser localStorage.

## Local Development

```powershell
npm install
npm run dev
```

## Publish With Cloudflare Pages

1. Create a GitHub repository and push this project.
2. In Cloudflare, open **Workers & Pages**, create a Pages project, and connect the repository.
3. Use `npm run build` as the build command and `dist` as the output directory.
4. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in the Pages project's Environment Variables.
5. Deploy and add the resulting Pages URL to Supabase Authentication URL Configuration.

You can also deploy the built site directly from the command line:

```powershell
npm run build
npx wrangler pages deploy dist --project-name=pro-c-client-work-tracker
```

## Vercel Alternative

Vercel also supports Vite. Import the GitHub repository at https://vercel.com/new,
add the two Supabase environment variables, deploy, and add the resulting URL to
Supabase Authentication URL Configuration.
