# shadcn Form Pattern Skill

Use this skill whenever building a page with a form (Signup, Login, Post creation, Profile edit).

## Pattern
1. Use shadcn's Form component wrapping React Hook Form
2. Define a validation schema per field before writing JSX
3. Wire inline error messages using the Form's built-in FormMessage component
4. Submit button shows a loading/disabled state during async calls
5. Never bypass the Form component with raw <input> + manual state unless explicitly required

# Next.js Code Review Skill

Use this skill whenever reviewing, auditing, or being asked to check the 
quality of any Next.js code (App Router or Pages Router).

## What to check, in order

### 1. Rendering strategy correctness
- Is this component a Server Component by default, or does it actually need 
  "use client"? Flag unnecessary "use client" directives — they bloat the 
  client bundle for no reason if the component has no interactivity, state, 
  or browser-only APIs.
- Data fetching should happen in Server Components or Route Handlers, not 
  fetched client-side with useEffect unless there's a real reason 
  (e.g. depends on client-only state).

### 2. File and folder structure (App Router)
- Routes should live under app/, with page.jsx, layout.jsx, loading.jsx, 
  error.jsx named correctly — flag any misnamed route files.
- Shared UI belongs in components/, not duplicated inside route folders.
- API routes should be in app/api/ using route.js with named exports 
  (GET, POST, etc.), not a single default export handling all methods.

### 3. Data fetching
- Server-side fetch calls should use appropriate caching: 
  { cache: 'force-cache' } for static data, { cache: 'no-store' } for 
  always-fresh data, or revalidate: <seconds> for ISR — flag fetches with 
  no caching strategy specified.
- Database calls (Mongoose, Prisma, etc.) should happen directly in Server 
  Components or Route Handlers, never through an internal fetch to your own API.

### 4. Environment variables
- Anything prefixed NEXT_PUBLIC_ is exposed to the browser — flag any 
  secret, token, or API key mistakenly given that prefix.
- Server-only env vars (DB connection strings, JWT secrets, payment tokens) 
  must never be imported into a "use client" file.

### 5. Auth and middleware
- Protected routes should be gated in middleware.js or via a server-side 
  session check at the top of the page/layout, not just hidden via 
  client-side conditional rendering (that's not real protection).
- API routes handling sensitive data must verify the session/token 
  server-side before processing, never trust a client-sent role or user ID.

### 6. Performance basics
- Images should use next/image, not raw <img> tags, unless there's a 
  specific reason not to.
- Fonts should use next/font, not a manual <link> to Google Fonts.
- Flag any large client-side bundle risk: heavy libraries imported into a 
  "use client" component that could instead be used server-side.

### 7. Error and loading states
- Every route with async data should have a loading.js and error.js, or an 
  explicit loading/error UI handled in the component — flag routes missing 
  both.

## Output format when reviewing
For each issue found, report:
- File and line/section
- What's wrong
- Why it matters (one sentence)
- The specific fix

Do not rewrite the entire file unless asked — list issues first so they can 
be reviewed before applying fixes.

# JWT Authentication Flow Skill

Use this skill when building or debugging any authentication-related code.

## Standard flow
1. Signup/Login hashes/compares password with bcrypt
2. On success, sign a JWT with { id: user._id }, expiresIn: '30d'
3. Frontend stores token (localStorage or httpOnly cookie — prefer httpOnly for production)
4. Every protected request sends Authorization: Bearer {token}
5. authMiddleware verifies token, attaches req.user, rejects with 401 if invalid
6. adminMiddleware checks req.user.role === 'admin' after authMiddleware runs

# Campay Payment Integration Skill

Use this skill whenever building or modifying payment-related features.

## Knowledge
- Campay sandbox base URL: https://demo.campay.net/api
- Production base URL: https://www.campay.net/api
- Auth via Token header: Authorization: Token {CAMPAY_TOKEN}
- Collection endpoint: POST /collect/ — initiates a MoMo prompt on user's phone
- Status check: GET /transaction/{reference}/
- Webhooks are the source of truth for payment confirmation, not the initial response

## Standard pattern
1. Controller initiates payment, saves a Transaction as "pending"
2. Webhook route updates Transaction status and unlocks the user's plan
3. Never mark a plan active from the initiate response alone — always wait for webhook confirmation

# Meta Graph API Fetch Skill

Use this skill when building features that pull Instagram/Facebook data.

## Knowledge
- Requires OAuth-connected access token per user, stored on SocialAccount model
- Rate limits apply — batch requests where possible, don't loop individual calls
- Store fetched data as timestamped snapshots (for growth charts), don't overwrite in place
- Wrap all external API calls in try/catch with clear error logging, since token expiry is common