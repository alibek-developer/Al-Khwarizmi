# IT-Park Khorazmi — Full-Stack Education Platform Template

A complete, production-ready education platform built with Next.js and Supabase. Includes a public marketing website, admin panel, and student panel — all connected to a real database.

**Demo:** [https://al-khwarizmi-olive.vercel.app](https://al-khwarizmi-olive.vercel.app)

**Built by:** Alibek Allaberganov

---

## What's Included

### Public Website
- Home page with hero, features, and CTA sections
- Individual course pages (Web Development, Data Science, AI & ML, English)
- Each course has: curriculum roadmap, pricing plans (Basic / Standard / Premium), and enrollment form
- Teachers page
- About and Contact pages
- Dark/light mode toggle
- English / Uzbek language support

### Admin Panel (`/admin`)
- Student management — add, edit, delete, view, export to CSV / Google Sheets
- Course management
- Mentor management
- Enrollment requests from the public website
- Statistics and overview dashboard

### Student Panel (`/student/dashboard`)
- Personal dashboard with progress tracking
- Course materials and homework submissions
- Certificate generation and download
- XP and streak system
- Games section:
  - **Daily Quiz** — JavaScript knowledge test
  - **Logic Puzzles** — Programming logic questions with 30s timer
  - **Quick Math** — Fast calculation game with combo system
  - **Word Match** — Match programming terms to definitions
  - **Memory Game** — Flip cards with Easy / Medium / Hard difficulty
- Weekly goals and statistics
- Profile settings

---

## Tech Stack

| Technology | Usage |
|------------|-------|
| Next.js 14 (App Router) | Frontend framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Shadcn UI | UI components |
| Supabase | Database + file storage |
| Framer Motion | Animations |
| Vercel | Hosting |

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/it-park-khorazmi.git
cd it-park-khorazmi
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Go to **SQL Editor**
3. Copy the contents of `schema.sql` and run it
4. Go to **Settings → API** and copy your keys

### 4. Configure environment variables

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Default Login Credentials

After running `schema.sql`, you can log in with:

### Admin Panel (`/admin/login`)
```
Email:    admin@itpark.uz
Password: admin123
```

### Student Panel (`/student/login`)
```
Email:    student@itpark.uz
Password: 123456
```

> **Important:** Change these credentials immediately after your first login.

---

## Project Structure

```
├── app/
│   ├── (public)/          # Public marketing website
│   ├── (admin)/           # Admin panel pages
│   │   ├── students/      # Student management
│   │   ├── courses/       # Course management
│   │   └── mentors/       # Mentor management
│   └── (student)/         # Student dashboard
│       └── dashboard/
│           ├── games/     # All 4 games + daily quiz
│           ├── courses/   # Course materials
│           ├── homework/  # Homework submissions
│           └── profile/   # Student profile
├── components/            # Reusable UI components
├── lib/
│   ├── api.ts             # All Supabase API functions
│   ├── supabase.ts        # Supabase client
│   └── constants.ts       # App-wide constants
└── schema.sql             # Complete database schema
```

---

## Customization

### Change branding
- Logo and name: `components/Navbar.tsx`
- Colors: `tailwind.config.ts`
- Course content: `app/(public)/courses/`

### Add a new course
1. Add a new page in `app/(public)/courses/your-course/page.tsx`
2. Add it to the Courses dropdown in `components/Navbar.tsx`
3. Insert the course into Supabase via the Admin panel

### Add game questions
All game questions are in their respective page files:
- Logic Puzzles: `app/(student)/dashboard/games/logic-puzzles/page.tsx`
- Daily Quiz: `app/(student)/dashboard/games/page.tsx`

---

## Deployment

### Deploy to Vercel (recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add environment variables in Vercel dashboard
4. Deploy

---

## License

This template is for single-use only. You may use it for one project (personal or client). Redistribution or resale is not permitted.

---

## Support

If you have questions about setup or customization, contact:

**Alibek Allaberganov**
Telegram: @alibekdev1