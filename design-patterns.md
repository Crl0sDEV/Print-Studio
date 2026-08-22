Next.js + shadcn/ui + Supabase Design Patterns Guide
TL;DR: The definitive patterns for building scalable, production-ready apps with Next.js (App Router), shadcn/ui, and Supabase. Optimized for vibe coding speed and clean architecture.

FOLDER STRUCTURE (Feature-Based)
/your-project
├── /app
│ ├── /(auth) # Route group
│ │ ├── /login
│ │ └── /register
│ ├── /(dashboard) # Route group
│ │ ├── /dashboard
│ │ └── /settings
│ ├── /api # Only for webhooks (optional)
│ ├── layout.tsx
│ └── page.tsx
├── /components
│ ├── /ui # shadcn primitives (DON'T TOUCH)
│ ├── /shared # Reusable: Avatar, SearchBar, DataTable
│ └── /features # Feature-specific: auth/LoginForm, dashboard/StatsCard
├── /lib
│ ├── /supabase # Client, Server, Middleware clients
│ │ ├── client.ts
│ │ ├── server.ts
│ │ └── middleware.ts
│ ├── /validations # Zod schemas
│ └── /utils # Helpers
├── /hooks # Custom hooks: useDebounce, useLocalStorage
├── /types # Shared TypeScript types
├── middleware.ts
├── next.config.js
└── package.json

1. COMPONENT ARCHITECTURE (Atomic-ish)
Components folder breakdown:

/ui → shadcn primitives (Button, Card, Dialog) — NEVER EDIT

/shared → Compound components: UserAvatar, DataTable, SearchBar

/features → Feature-specific: LoginForm, StatsCard, PostList

Golden Rule: Pages (/app) should be THIN — just compose components. No heavy logic.

GOOD EXAMPLE:
export default function DashboardPage() {
return <DashboardShell />;
}

BAD EXAMPLE (avoid this):
export default function DashboardPage() {
// ... tons of useState, useEffect, data fetching logic here
}

2. SERVER-FIRST DATA FETCHING (RSC Pattern)
Default to Server Components for data fetching:

app/dashboard/page.tsx (Server Component):
import { createClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
const supabase = await createClient();
const { data: stats } = await supabase.from('stats').select('*');
return <StatsClient stats={stats} />;
}

Revalidation Strategies:

"use cache" (Next.js 15+) — for component-level caching

fetch(url, { next: { revalidate: 60 } }) — ISR

<Suspense> + loading.tsx — for streaming heavy data

3. CLIENT BOUNDARY PATTERN (Isolate Interactivity)
Push interactivity DOWN — only mark what's necessary as "use client":

GOOD EXAMPLE (minimal client boundary):
'use client';
export function LikeButton({ initialLikes }) {
const [likes, setLikes] = useState(initialLikes);
return <button onClick={() => updateLikes(likes + 1)}>{likes}</button>;
}

BAD EXAMPLE (avoid this):
'use client'; // DON'T DO THIS UNLESS NECESSARY
export default function DashboardPage() { ... }

Rule of thumb: Server = data + layout | Client = state + events

4. SUPABASE PATTERN: SERVER ACTIONS + RLS
NEVER use Supabase client directly for mutations in the browser. Use Server Actions:

app/actions.ts:
'use server';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createPost(formData: FormData) {
const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();

const { error } = await supabase.from('posts').insert({
title: formData.get('title'),
user_id: user.id,
});

if (error) throw new Error('Failed to create post');
revalidatePath('/dashboard');
}

Pattern Breakdown:

Reads → Server Components (direct queries)

Writes → Server Actions (protected by RLS)

Validation → Zod on both client + server

Realtime → Supabase subscriptions on client (isolated)

RLS (Row Level Security): Always set up RLS policies in Supabase — it's your last line of defense.

5. STATE MANAGEMENT PATTERN
URL State (useSearchParams) → For shareable state: filters, pagination, tabs
Zustand → For complex client state: multi-step forms, unsaved changes
useState → For UI toggles: modals, dropdowns
React Context → For dependency injection: theme, Supabase client (NOT for frequent updates)

URL state example:
const searchParams = useSearchParams();
const page = searchParams.get('page') ?? '1';

Zustand example:
const useFormStore = create((set) => ({
step: 1,
data: {},
nextStep: () => set((s) => ({ step: s.step + 1 })),
}));

6. FORM PATTERN: shadcn + RHF + Zod (The Holy Trinity)
'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormField, FormItem } from '@/components/ui/form';
import { toast } from 'sonner';

// 1. Define schema
const schema = z.object({
email: z.string().email('Invalid email'),
password: z.string().min(8, 'Min 8 characters'),
});

type FormData = z.infer<typeof schema>;

// 2. Create form
export function LoginForm() {
const form = useForm<FormData>({
resolver: zodResolver(schema),
defaultValues: { email: '', password: '' },
});

// 3. Handle submit with Server Action
const onSubmit = form.handleSubmit(async (data) => {
'use server';
const result = await signIn(data);
if (result.error) {
toast.error(result.error);
} else {
toast.success('Welcome back!');
redirect('/dashboard');
}
});

return (

<Form {...form}> <form onSubmit={onSubmit}> <FormField control={form.control} name="email" render={({ field }) => ( <FormItem> <Input {...field} /> <FormMessage /> </FormItem> )} /> <Button type="submit">Login</Button> </form> </Form> ); }
7. ERROR HANDLING & LOADING STATES
Next.js built-in files per route segment:

/app/dashboard/
├── page.tsx
├── loading.tsx → Suspense fallback
├── error.tsx → Error boundary
└── not-found.tsx → 404

Mutation Feedback Pattern:
'use client';
import { toast } from 'sonner';

const handleDelete = async (id: string) => {
try {
await deleteItem(id);
toast.success('Deleted successfully!');
revalidatePath('/items');
} catch (error) {
toast.error('Something went wrong');
}
};

8. AUTHENTICATION PATTERN: SUPABASE + MIDDLEWARE
Protect routes at the middleware level:

middleware.ts:
import { createClient } from '@/lib/supabase/middleware';
import { NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
const { supabase, response } = createClient(req);
const { data: { session } } = await supabase.auth.getSession();

// Protected routes
if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
return NextResponse.redirect(new URL('/login', req.url));
}

// Redirect logged-in users away from auth pages
if (session && req.nextUrl.pathname.startsWith('/login')) {
return NextResponse.redirect(new URL('/dashboard', req.url));
}

return response;
}

export const config = {
matcher: ['/dashboard/:path*', '/login', '/register'],
};

Server-side auth check:
app/dashboard/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();

if (!user) redirect('/login');

return <DashboardClient user={user} />;
}

9. PERFORMANCE PATTERNS
Optimistic Updates (Instant UI Feedback):
'use client';
import { useOptimistic } from 'react';

export function PostLikes({ initialLikes, postId }) {
const [optimisticLikes, addOptimisticLike] = useOptimistic(
initialLikes,
(state, newLike) => [...state, newLike]
);

const handleLike = async () => {
addOptimisticLike({ id: crypto.randomUUID(), user_id: 'me' });
await likePost(postId); // Server Action in background
};

return <button onClick={handleLike}>❤️ {optimisticLikes.length}</button>;
}

Prefetching:

<Link href="/dashboard" prefetch> {/* Prefetches on hover */} Dashboard </Link>
Image Optimization:
import Image from 'next/image';

<Image
src="/hero.png"
width={1200}
height={600}
alt="Hero"
priority // Load immediately for LCP
/>

10. REAL-TIME SUBSCRIPTIONS (Supabase Realtime)
Isolate in a client component:

'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export function LiveMessages({ initialMessages }) {
const [messages, setMessages] = useState(initialMessages);
const supabase = createClient();

useEffect(() => {
const channel = supabase
.channel('messages')
.on('postgres_changes',
{ event: 'INSERT', schema: 'public', table: 'messages' },
(payload) => setMessages(prev => [...prev, payload.new])
)
.subscribe();

return () => { supabase.removeChannel(channel); };
}, []);

return messages.map(msg => <Message key={msg.id} {...msg} />);
}

PRE-BUILD CHECKLIST
□ Pages are Server Components by default
□ Only interactive parts marked "use client"
□ Mutations wrapped in Server Actions
□ Forms use RHF + Zod + shadcn
□ Auth protected at middleware + RLS level
□ Loading/error states defined per route
□ URL state used for shareable filters
□ Optimistic updates for better UX
□ Supabase RLS policies set up correctly
□ Environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
QUICK REFERENCE COMMANDS
Install shadcn components:
npx shadcn-ui@latest add button card dialog form input toast

Install dependencies:
npm install @supabase/supabase-js @supabase/ssr
npm install react-hook-form @hookform/resolvers zod
npm install zustand sonner

Generate Supabase types:
npx supabase gen types typescript --project-id your-project-id > lib/types/supabase.ts

COMMON PITFALLS TO AVOID
DON'T: Fetch data in client components
DO: Fetch in Server Components

DON'T: Use Supabase directly in browser
DO: Use Server Actions for writes

DON'T: Mark whole page as "use client"
DO: Only mark interactive parts

DON'T: Store everything in Context
DO: Use Zustand for complex state

DON'T: Hardcode URLs
DO: Use environment variables

DON'T: Ignore loading states
DO: Use loading.tsx and Suspense

DON'T: Skip error boundaries
DO: Add error.tsx per route

USEFUL RESOURCES
Next.js App Router Docs: https://nextjs.org/docs/app
shadcn/ui Components: https://ui.shadcn.com
Supabase SSR Guide: https://supabase.com/docs/guides/auth/server-side/nextjs
React Hook Form: https://react-hook-form.com
Zod Validation: https://zod.dev