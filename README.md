# Residuos Next.js - Advanced Editor Scaffold

Features:
- Rich text editor (React-Quill) with formatting similar to Word (bold, italic, underline, color, font sizes, lists, alignment, links).
- Block editor: Text blocks (rich), Image (via URL), Video (via URL/embed).
- Role-based editing: only users with role 'admin' or 'tecnico' see editor controls.
- Secure Supabase authentication and a server-side save endpoint using the Service Role key.

Setup:
1. `npm install`
2. Configure `.env.local` with your Supabase project values.
3. Create tables `paginas` and `user_roles` in Supabase (SQL provided in /sql).
4. `npm run dev`

Security notes:
- Keep SUPABASE_SERVICE_ROLE_KEY secret and only in server env (Vercel/Netlify secrets).
- The API endpoint `/api/savePage` verifies the user's access token and uses the service role to upsert content.
