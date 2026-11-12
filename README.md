# AI Intrvu Platform

An AI-powered mock interview platform built with **Next.js 15**, **Vapi Voice AI**, **Groq LLM**, **Prisma**, and **PostgreSQL**. Candidates can configure tailored technical, behavioral, or system design interviews, practice in real time with an AI voice recruiter, and receive structured per-question and overall feedback with PDF export.

---

## Features

- **Authentication & Email Verification**
  - Sign up and sign in with **Credentials** (hashed with `bcryptjs`), **Google**, or **GitHub** via NextAuth.js.
  - Email verification flow using **Nodemailer** (Zoho SMTP) and **React Email** templates.
- **Customizable Interview Setup**
  - Configure interview type (`technical`, `behavioral`, `system_design`), job position, experience level, difficulty (`easy`, `medium`, `hard`), duration (`10`–`60` min), mode (`voice`, `text_chat`, `video`), tech stack, and job description.
  - Form validation powered by **React Hook Form** and **Zod**.
- **AI Question Generation**
  - Dynamically generates role- and stack-specific interview questions via **Groq SDK** (`openai/gpt-oss-20b`), with resilient JSON parsing via `jsonrepair` and automatic DB rollback if generation fails.
- **Real-Time Voice Interview**
  - Live voice conversation orchestrated by **Vapi Web SDK** (`@vapi-ai/web`) using **Deepgram** (`nova-2`) for speech-to-text, **OpenAI** (`gpt-4`) for conversational interviewing, and **PlayHT** for voice synthesis.
  - Explicit microphone permission checks, live call status (`INACTIVE`, `CONNECTING`, `ACTIVE`, `FINISHED`), and real-time transcript streaming.
- **Automated AI Feedback & Scoring**
  - Upon call completion, the conversation transcript is evaluated by **Groq** to produce an overall rating, summary, strengths, areas for improvement, and per-question grading (`correctAnswer`, `userAnswer`, `isCorrect`, `rating`, `feedback`).
- **Dashboard, History & PDF Reports**
  - Dashboard overview with interview stats and recent sessions (`/api/dashboard`).
  - Full interview history and detailed report pages (`/dashboard/interview-history/[interviewId]`) with **PDF export** (`jspdf` / `html2canvas` / `react-to-print`) and sharing support.
- **Profile Management**
  - Manage candidate bio, resume, industry, target roles, experience level, target company size, and focus areas.

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 15 (App Router), React 19, TypeScript 5 |
| **Styling & UI** | Tailwind CSS 4, Radix UI, Lucide Icons, Sonner |
| **State Management** | Redux Toolkit (`interviewSlice` persisted to `localStorage`) |
| **Forms & Validation** | React Hook Form, Zod |
| **Authentication** | NextAuth.js v4 (Credentials, Google, GitHub) |
| **Database & ORM** | PostgreSQL, Prisma ORM |
| **AI Question & Feedback** | Groq SDK (`openai/gpt-oss-20b`), `jsonrepair` |
| **Voice AI** | Vapi Web SDK (`@vapi-ai/web`), Deepgram (`nova-2`), PlayHT, OpenAI (`gpt-4`) |
| **Email** | Nodemailer (Zoho SMTP), React Email |
| **PDF Export** | jsPDF, html2canvas, react-to-print |

---

## Architecture Diagram

```mermaid
flowchart TD
    User["Candidate Browser"]

    subgraph NextApp["Next.js 15 App Router"]
        UI["UI Pages\n(Landing, Auth, Dashboard, Setup, Live Interview, History, Profile)"]
        Redux["Redux Store\n(interviewSlice + localStorage)"]
        Actions["Server Actions\n(src/actions/auth.ts, src/actions/interview.ts)"]
        API["API Routes\n(/api/auth, /api/dashboard, /api/interviews)"]
    end

    subgraph External["External Services"]
        Vapi["Vapi Voice AI\n(Deepgram STT + GPT-4 + PlayHT TTS)"]
        Groq["Groq LLM API\n(Question Gen & Feedback Eval)"]
        OAuth["OAuth Providers\n(Google & GitHub)"]
        SMTP["Zoho SMTP\n(Verification Emails)"]
    end

    DB[("PostgreSQL\nvia Prisma ORM")]

    User <--> UI
    UI <--> Redux
    UI --> Actions
    UI --> API
    User <-->|"WebRTC Audio & Transcripts"| Vapi

    Actions -->|"Create Session & Generate Questions / Feedback"| Groq
    Actions --> DB
    Actions --> SMTP

    API -->|"NextAuth"| OAuth
    API --> DB
```

---

## How It Works (End-to-End Flow)

```mermaid
sequenceDiagram
    actor Candidate
    participant Setup as /dashboard/interview-setup
    participant Server as Server Action (createInterviewSession)
    participant Groq as Groq LLM
    participant DB as PostgreSQL (Prisma)
    participant Redux as Redux + localStorage
    participant Live as /dashboard/live-interview
    participant Vapi as Vapi Voice AI

    Candidate->>Setup: Configure role, stack, difficulty & duration
    Setup->>Server: Submit validated form data
    Server->>DB: Create InterviewSession (IN_PROGRESS)
    Server->>Groq: Generate tailored interview questions
    Groq-->>Server: JSON array of questions & expected answers
    Server-->>Setup: Return { interview, questions }
    Setup->>Redux: Dispatch setInterviewData(response.data)
    Setup->>Live: Redirect to /dashboard/live-interview

    Candidate->>Live: Click Start Interview (grant mic access)
    Live->>Vapi: vapi.start(assistantOptions + questions)
    Vapi-->>Candidate: Real-time voice Q&A
    Vapi-->>Live: Stream transcript messages
    Candidate->>Live: End interview (or call ends naturally)

    Live->>Server: generateFeedbackForInterview(messages, sessionId)
    Server->>Groq: Evaluate transcript against questions
    Groq-->>Server: Structured rating, summary & per-question feedback
    Server->>DB: Update InterviewSession & create Question records
    Live-->>Candidate: Report generated; viewable in Interview History & PDF
```

### Step-by-Step Breakdown

1. **Authentication (`/auth`, `/auth/verify`)**
   - Users register with email/password (receiving a verification code via Nodemailer) or sign in via Google/GitHub OAuth.
   - NextAuth manages JWT/session state, attaching `user.id` to the session for server-side authorization.
2. **Interview Setup (`/dashboard/interview-setup`)**
   - The candidate selects job position, experience level, interview type, difficulty, duration, mode, and tech stack.
   - Submitting calls the `createInterviewSession` server action, which authenticates the user, creates an `InterviewSession` row in PostgreSQL, and prompts **Groq** to generate a tailored set of questions.
   - The returned `{ interview, questions }` payload is stored in **Redux** (`interviewSlice`) and mirrored to `localStorage` (`interview_state`), then the user is redirected to `/dashboard/live-interview`.
3. **Live Voice Interview (`/dashboard/live-interview`)**
   - The page reads the active `interview` and `questions` from Redux (redirecting back to setup if missing).
   - Clicking **Start Interview** requests microphone access via `navigator.mediaDevices.getUserMedia` and starts a **Vapi** voice session configured with the candidate's job context and generated questions.
   - Real-time transcript events (`transcriptType === 'final'`) are collected in state.
4. **Feedback Generation & Persistence**
   - When the call ends (either via the **End Interview** button or Vapi's `call-end` event), `generateFeedbackForInterview` sends the recorded transcript to **Groq**.
   - Groq returns structured JSON containing an overall rating, summary, strengths, improvements, and per-question evaluations, which are saved to `InterviewSession` and `Question` tables in PostgreSQL.
5. **History, Analytics & PDF Export (`/dashboard`, `/dashboard/interview-history`)**
   - `/dashboard` fetches aggregate stats (total/completed interviews, average rating, accuracy, recent sessions) from `/api/dashboard`.
   - `/dashboard/interview-history/[interviewId]` displays the full breakdown and allows exporting the report as a PDF.

---

## Database Schema Overview

Defined in [`prisma/schema.prisma`](prisma/schema.prisma):

- **`User`**: Stores account credentials, verification state (`verifyCode`, `isVerified`), OAuth provider info, and career profile fields (`industry`, `targetRoles`, `experienceLevel`, `targetCompanySize`, `focusArea`).
- **`InterviewSession`**: Stores interview configuration (`interviewType`, `difficultyLevel`, `duration`, `interviewMode`, `jobPosition`, `jobDescription`, `experienceLevel`, `techStack`), status (`IN_PROGRESS`, `COMPLETED`, `ABANDONED`), and overall feedback (`rating`, `summary`, `strengths`, `improvements`).
- **`Question`**: Linked to `InterviewSession` (cascade delete); stores `question`, `correctAnswer`, `userAnswer`, `isCorrect`, `rating`, `feedback`, `strengths`, and `improvements`.

---

## Project Structure

```text
├── prisma/
│   ├── schema.prisma          # PostgreSQL schema & enums
│   └── migrations/            # Prisma migration history
├── src/
│   ├── actions/
│   │   ├── auth.ts            # Signup & verification server actions
│   │   └── interview.ts       # Session creation & feedback generation
│   ├── app/
│   │   ├── (auth)/auth/       # Sign-in, sign-up & verification pages
│   │   ├── (main)/
│   │   │   ├── dashboard/     # Dashboard, setup, live interview, history
│   │   │   └── profile/       # Candidate profile page
│   │   ├── api/
│   │   │   ├── auth/          # NextAuth [...nextauth] route
│   │   │   ├── dashboard/     # Dashboard stats endpoint
│   │   │   └── interviews/    # Interview list & detail endpoints
│   │   └── page.tsx           # Landing page
│   ├── components/            # Shared UI & landing components
│   ├── context/               # NextAuth & Redux providers
│   ├── lib/                   # Prisma, Vapi SDK, Groq/mail/PDF helpers
│   ├── redux/                 # Store & interviewSlice
│   ├── schema/                # Zod validation schemas
│   └── types/                 # TypeScript enums & NextAuth types
└── package.json
```

---

## Getting Started

### Prerequisites

- **Node.js** 20+
- **PostgreSQL** database
- API keys for **Groq**, **Vapi**, **Zoho SMTP** (for email verification), and optionally **Google / GitHub OAuth**

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ai_intrvu"

# NextAuth
NEXTAUTH_SECRET="your-nextauth-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# AI & Voice
GROQ_API_KEY="your-groq-api-key"
NEXT_PUBLIC_VAPI_PUBLIC_KEY="your-vapi-public-key"

# Email (Zoho SMTP)
ZOHO_SMTP_HOST="smtp.zoho.in"
ZOHO_SMTP_PORT="465"
ZOHO_SMTP_USER="your-email@domain.com"
ZOHO_SMTP_PASS="your-smtp-password"
```

### 3. Set Up the Database

```bash
npm run generate
npm run migrate:dev
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

| Script | Description |
| :--- | :--- |
| `npm run dev` | Start Next.js development server |
| `npm run build` | Build production bundle |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run generate` | Generate Prisma client |
| `npm run migrate:dev` | Run Prisma migrations in development |
| `npm run migrate:prod` | Deploy Prisma migrations in production |
| `npm run studio` | Open Prisma Studio |
