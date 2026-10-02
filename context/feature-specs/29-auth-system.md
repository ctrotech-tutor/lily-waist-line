Read `AGENTS.md` before starting.

We are now implementing the **authentication system layer** for Lily Waist Line.

Follow strictly:

- `context/architecture-context.md`
- `context/code-standards.md`
- `context/ai-workflow-rules.md`
- Supabase Auth rules
- Prisma user synchronization rules

---

# 🎯 Goal

Implement a production-ready authentication system using Supabase Auth.

This system must support:

- User sign up
- Email verification
- User login
- User logout
- Forgot password
- Reset password
- Session management
- Role-based access control
- Prisma user synchronization

---

# 🔐 AUTH PROVIDER (SOURCE OF TRUTH)

Use:

- :contentReference[oaicite:0]{index=0} Auth

Supabase is the ONLY authentication provider.

---

# 📩 EMAIL VERIFICATION (REQUIRED)

All new users MUST verify email before full account activation.

---

## Signup Flow

### Step 1

User signs up with:

- email
- password

---

### Step 2

Supabase sends verification email automatically.

---

### Step 3

User clicks verification link.

---

### Step 4

After verification:

Create Prisma `User` record:

- id = Supabase auth user ID
- email
- fullName (optional)
- role = CUSTOMER

---

# RULE

Unverified users MUST NOT access protected customer routes.

---

# 👤 USER MODEL RULE

Prisma User:

- MUST use Supabase auth ID as primary key
- MUST NOT generate separate user IDs
- MUST stay synchronized with auth identity

---

# 🔓 LOGIN FLOW

User logs in using:

- email
- password

After login:

1. Supabase session restored
2. Prisma user profile fetched
3. Role checked

---

# RULE

Only verified users may log in fully.

Unverified users:

- must be redirected to verification flow

---

# 🔑 FORGOT PASSWORD FLOW

Users may request password reset using email.

Flow:

1. User enters email
2. Supabase sends reset link
3. User opens reset route
4. User creates new password

---

# RESET ROUTE

Use:

/reset-password

Do NOT invent custom reset token systems.

Use Supabase native flow only.

---

# PASSWORD UPDATE RULE

After password reset:

- existing sessions may be invalidated
- user must log in again

---

# 🚪 LOGOUT FLOW

Logout must:

- clear Supabase session
- clear client auth state
- redirect user safely

---

# 🛡️ ROLE SYSTEM

Roles:

```txt
CUSTOMER
ADMIN
```

---

## Role Rules

### CUSTOMER

Default for all verified users.

Access:

- /cart
- /checkout
- /orders
- /addresses
- /wishlist

---

### ADMIN

Assigned manually in database.

Access:

- /admin/*

---

# ⚙️ SESSION MANAGEMENT

Use Supabase session system.

Requirements:

- persistent sessions
- token refresh
- client + server session access

---

# 🧠 MIDDLEWARE PROTECTION

Use Next.js middleware.

Protect:

Customer routes:

- /cart
- /checkout
- /orders
- /addresses
- /wishlist

Admin routes:

- /admin/*

Rules:

Unauthenticated users:

→ redirect to /login

Non-admin users accessing admin:

→ redirect to /

Unverified users:

→ redirect to /verify-email

---

# 🔁 FULL AUTH FLOW

## Signup

User signs up
↓
Verification email sent
↓
User verifies email
↓
Prisma user record created
↓
Redirect to app

---

## Login

User logs in
↓
Session restored
↓
Verification checked
↓
Role verified
↓
Access granted

---

## Password Recovery

User requests reset
↓
Reset email sent
↓
Password updated
↓
User logs in again

---

# 🚫 OUT OF SCOPE

- No UI implementation
- No email templates
- No cart logic
- No payment logic
- No backend business actions

---

# 📌 CHECK WHEN DONE

- Signup works
- Verification email works
- Verified users sync to Prisma
- Login works
- Forgot password works
- Reset password works
- Middleware protection works
- Role system works