u7tu6u7u6756# 🎙️ LiveInterview — AI-Powered Virtual Interview Platform

> **An AI-powered recruitment platform that automates candidate screening through personalized interview generation, real-time voice-based interviews, candidate management, and interview tracking.**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)](https://www.prisma.io/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Clerk](https://img.shields.io/badge/Clerk-Authentication-6C47FF)](https://clerk.com/)
[![Vapi](https://img.shields.io/badge/Vapi-Voice%20AI-111827)](https://vapi.ai/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com/)

---

## 🌐 Live Demo

🚀 **Live Application:** `ADD_YOUR_VERCEL_URL_HERE`

📂 **GitHub Repository:**  
https://github.com/Harsh121415/liveinterview

> The live demo requires the configured authentication and third-party AI services. For a complete demonstration, use the recruiter dashboard to create an interview and generate a candidate interview link.

---

## 📌 Overview

**LiveInterview** is a web-based AI interview platform designed to simplify the initial candidate screening process.

Instead of requiring recruiters to manually conduct repetitive first-round interviews, the platform allows recruiters to create role-specific interviews and invite candidates to complete an AI-powered voice interview.

The platform combines:

- AI-generated interview questions
- Real-time voice interaction
- Candidate management
- Interview invitations
- Interview timing
- Transcript storage
- Interview attempt tracking
- Credit-based interview creation
- Recruiter authentication

The goal is to make the first stage of recruitment **faster, more consistent, and easier to scale**.

---

# ✨ Key Features

## 👨‍💼 Recruiter Dashboard

Recruiters can manage their complete interview workflow from a centralized dashboard.

### Capabilities

- Secure recruiter authentication
- Create and manage interviews
- View available credits
- View interview details
- Copy interview links
- Manage candidates
- Track interview attempts

---

## 🤖 AI-Powered Interview Generation

Recruiters provide:

- Job position
- Job description
- Interview duration
- Interview categories

The platform uses an LLM through **OpenRouter** to generate role-specific interview questions.

### Example

```text
Job Position:
Frontend Developer

Job Description:
Looking for a developer with experience in React,
JavaScript, REST APIs and modern frontend development.

Interview Types:
Technical
Behavioral
Experience
```

The AI then generates an interview question set based on the provided requirements.

---

## 🎙️ Real-Time AI Voice Interview

Candidates can participate in an interactive voice interview instead of typing answers.

The voice interview workflow uses:

```text
Candidate
    ↓
Microphone
    ↓
Vapi
    ↓
Speech Recognition
    ↓
AI Interviewer
    ↓
Voice Response
    ↓
Candidate
```

The platform integrates voice services to create a conversational interview experience.

---

## 👤 Candidate Management

Recruiters can:

- Add candidates manually
- Import candidates using CSV
- Store candidate information
- Associate candidates with interviews
- Send interview invitations
- Track candidate interview attempts

---

## 📧 Email Interview Invitations

Candidates can receive interview invitations containing their interview information and interview link.

The application uses **Nodemailer/Gmail SMTP** for email delivery.

---

## ⏱️ Interview Timer

Recruiters can configure interview duration.

Supported durations include:

- 15 minutes
- 30 minutes
- 45 minutes
- 60 minutes

The candidate interview room automatically tracks the remaining interview time.

---

## 📝 Interview Transcript & Attempt Tracking

After an interview, the system stores information associated with the candidate's attempt, including:

- Interview ID
- Candidate ID
- Voice call ID
- Transcript
- Completion status
- Time-up status
- Completion timestamp

This provides the foundation for recruiter-side interview review and AI-based candidate evaluation.

---

## 💳 Credit-Based Interview Creation

The platform uses a credit-based model for interview creation.

New companies receive an initial credit balance, and interview creation consumes credits.

This architecture can later be extended into a complete SaaS billing system.

---

# 🏗️ System Architecture

```text
                         ┌───────────────────┐
                         │     Recruiter     │
                         └─────────┬─────────┘
                                   │
                                   ▼
                         ┌───────────────────┐
                         │     Next.js       │
                         │  React + App Router│
                         └─────────┬─────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              │                    │                    │
              ▼                    ▼                    ▼
        ┌───────────┐        ┌────────────┐       ┌───────────┐
        │   Clerk   │        │ Next.js API│       │ OpenRouter│
        │   Auth    │        │   Routes   │       │    AI     │
        └───────────┘        └─────┬──────┘       └───────────┘
                                   │
                                   ▼
                            ┌─────────────┐
                            │   Prisma    │
                            │     ORM     │
                            └──────┬──────┘
                                   │
                                   ▼
                            ┌─────────────┐
                            │   MongoDB   │
                            │    Atlas    │
                            └─────────────┘


                    Candidate Interview Flow

Candidate
    │
    ▼
Interview Link
    │
    ▼
Next.js Interview Room
    │
    ▼
Vapi Voice AI
    │
    ├───────────────┐
    ▼               ▼
Speech-to-Text    AI Model
    │               │
    └───────┬───────┘
            ▼
       AI Response
            │
            ▼
       Voice Response
            │
            ▼
         Candidate
            │
            ▼
        Transcript
            │
            ▼
         MongoDB
```

---

# 🛠️ Technology Stack

## Frontend

| Technology | Purpose |
|---|---|
| Next.js 15 | Full-stack React framework |
| React 19 | User interface |
| JavaScript | Application development |
| Tailwind CSS | Styling |
| Radix UI | UI primitives |
| Lucide React | Icons |
| Zustand | Client-side state |
| Formik | Form management |
| Yup | Validation |

## Backend

| Technology | Purpose |
|---|---|
| Next.js API Routes | Backend APIs |
| Prisma | Database ORM |
| MongoDB | Database |
| Clerk | Authentication |
| Nodemailer | Email delivery |
| Axios | HTTP requests |

## AI & Voice

| Technology | Purpose |
|---|---|
| OpenRouter | AI model access |
| GPT-4o-mini | Interview question generation |
| Vapi | Real-time voice AI |
| Deepgram | Speech recognition |

## Payments

| Technology | Purpose |
|---|---|
| PayPal | Credit purchasing |

## Deployment

| Technology | Purpose |
|---|---|
| Vercel | Application hosting |
| MongoDB Atlas | Cloud database |

---

# 📂 Project Structure

```text
liveinterview/
│
├── app/
│   ├── api/
│   │   ├── candidates/
│   │   ├── interview/
│   │   ├── generateInterview/
│   │   ├── user/
│   │   ├── user-attempts/
│   │   └── add-credits/
│   │
│   ├── dashboard/
│   ├── interview/
│   ├── sign-in/
│   ├── sign-up/
│   └── ...
│
├── components/
│   ├── dashboard/
│   ├── interview/
│   ├── ui/
│   └── ...
│
├── context/
│
├── hooks/
│
├── lib/
│   ├── prisma/
│   ├── email/
│   └── ...
│
├── prisma/
│   └── schema.prisma
│
├── public/
│   └── assets/
│
├── scripts/
│   └── test-email.js
│
├── middleware.js
├── next.config.mjs
├── package.json
└── README.md
```

---

# 🔄 Application Workflow

## Recruiter Workflow

```text
Recruiter Signup/Login
        ↓
Dashboard
        ↓
Create Interview
        ↓
Enter Job Position
        ↓
Enter Job Description
        ↓
Select Duration
        ↓
Select Interview Types
        ↓
AI Generates Questions
        ↓
Interview Created
        ↓
Add Candidates
        ↓
Send Interview Invitation
```

---

## Candidate Workflow

```text
Receive Interview Invitation
        ↓
Open Interview Link
        ↓
Read Interview Instructions
        ↓
Allow Microphone Access
        ↓
Start AI Interview
        ↓
Answer Questions
        ↓
AI Responds
        ↓
Interview Timer
        ↓
Complete / Time Expires
        ↓
Transcript Stored
        ↓
Interview Attempt Recorded
```

---

# 🗄️ Database Design

The application uses MongoDB through Prisma ORM.

Core entities include:

```text
Company
   │
   ├───────────────┐
   │               │
   ▼               ▼
Interview       Candidate
   │               │
   └───────┬───────┘
           ▼
         Attempt
```

### Company

Stores recruiter/company information and credit balance.

### Interview

Stores:

- Job position
- Job description
- Interview duration
- Interview types
- Generated questions
- Company relationship

### Candidate

Stores:

- Candidate name
- Email
- Profile information
- Company relationship

### Attempt

Stores:

- Candidate
- Interview
- Transcript
- Voice call ID
- Completion state
- Time-up state
- Completion timestamp

---

# 🔐 Environment Variables

Create a `.env.local` file in the project root.

```env
# =========================================
# Database
# =========================================

DATABASE_URL="your_mongodb_connection_string"


# =========================================
# Clerk Authentication
# =========================================

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"


# =========================================
# Application
# =========================================

NEXT_PUBLIC_BASE_URL="http://localhost:3000"


# =========================================
# AI - OpenRouter
# =========================================

OPENROUTER_KEY="your_openrouter_api_key"


# =========================================
# Vapi Voice AI
# =========================================

NEXT_PUBLIC_VAPI_API_KEY="your_vapi_public_key"

NEXT_PRIVATE_VAPI_API_KEY="your_vapi_private_key"


# =========================================
# Email
# =========================================

NEXT_EMAIL_APP_PASSWORD="your_gmail_app_password"


# =========================================
# PayPal
# =========================================

NEXT_PUBLIC_PAYPAL_CLIENT_ID="your_paypal_client_id"

PAYPAL_CLIENT_SECRET="your_paypal_client_secret"


# =========================================
# Application Security
# =========================================

NEXT_PUBLIC_JWT_SECRET="your_random_secret"
```

> ⚠️ Never commit `.env.local` or any API keys/secrets to GitHub.

---

# 🚀 Local Development

## 1. Clone the repository

```bash
git clone https://github.com/Harsh121415/liveinterview.git
cd liveinterview
```

## 2. Install dependencies

Because one of the legacy PayPal packages has an older React peer-dependency requirement, the current project may require:

```bash
npm install --legacy-peer-deps
```

## 3. Configure environment variables

Create:

```text
.env.local
```

and add the required credentials.

## 4. Generate Prisma Client

```bash
npx prisma generate
```

## 5. Sync the database

```bash
npx prisma db push
```

## 6. Start development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# 🌐 Deployment

The application can be deployed using **Vercel**.

## Deploy to Vercel

1. Push the repository to GitHub.
2. Open Vercel.
3. Import the GitHub repository.
4. Select the project.
5. Configure environment variables.
6. Deploy the application.

The production environment should use:

```env
NEXT_PUBLIC_BASE_URL="https://your-production-domain.vercel.app"
```

After deployment, verify:

- Authentication
- Database connection
- AI question generation
- Candidate creation
- Email invitations
- Voice interview
- Transcript storage
- Interview attempts

---

# 🔒 Security Considerations

The application handles sensitive candidate and interview information.

Production deployments should ensure:

- API secrets remain server-side.
- Authentication is enforced on protected resources.
- Recruiters can only access their own company data.
- Candidate interview links use secure identifiers.
- Payment transactions are verified server-side.
- Candidate transcripts are protected.
- Environment variables are never committed.
- Rate limiting is applied to sensitive APIs.

---

# 🧪 Testing Checklist

Before sharing the application with recruiters:

### Authentication

- [ ] Recruiter can sign up.
- [ ] Recruiter can sign in.
- [ ] Recruiter can sign out.

### Interview Creation

- [ ] Interview can be created.
- [ ] AI generates questions.
- [ ] Interview is stored in MongoDB.
- [ ] Credits are deducted correctly.

### Candidates

- [ ] Candidate can be added.
- [ ] CSV import works.
- [ ] Invitation can be sent.

### Interview

- [ ] Candidate can open the interview.
- [ ] Microphone permission works.
- [ ] AI interviewer starts.
- [ ] Candidate can answer questions.
- [ ] Timer works.
- [ ] Interview can be completed.

### Data

- [ ] Transcript is stored.
- [ ] Attempt is stored.
- [ ] Completed status is updated.

### Production

- [ ] Vercel deployment works.
- [ ] Environment variables are configured.
- [ ] MongoDB Atlas connection works.
- [ ] Clerk production configuration works.

---

# 🚧 Current Limitations

The current version focuses primarily on:

- Interview creation
- AI question generation
- Candidate management
- Voice-based interviewing
- Transcript/attempt tracking

The following areas can be further enhanced:

- Advanced candidate scoring
- AI-powered candidate evaluation
- Candidate comparison
- Recruiter analytics
- Interview expiration
- Advanced notification system
- Secure invitation-token architecture
- Production-grade payment verification
- Detailed hiring recommendations

---

# 🚀 Future Improvements

## Phase 1 — AI Evaluation

Implement automatic evaluation of interview transcripts.

Possible metrics:

```text
Technical Knowledge
Communication
Problem Solving
Relevant Experience
Confidence
Overall Score
```

---

## Phase 2 — Candidate Ranking

Automatically rank candidates:

```text
Candidate A → 91
Candidate B → 86
Candidate C → 78
Candidate D → 64
```

---

## Phase 3 — Recruiter Analytics

Add:

- Interview completion rate
- Average candidate score
- Candidate funnel
- Interview statistics
- Hiring recommendations

---

## Phase 4 — Adaptive AI Interviews

Allow the AI interviewer to dynamically choose follow-up questions based on candidate responses.

```text
Candidate Answer
       ↓
AI Analysis
       ↓
Determine Difficulty
       ↓
Follow-up Question
       ↓
Candidate Answer
```

This can make interviews more conversational and personalized.

---

# 💡 Why LiveInterview?

Traditional first-round interviews require recruiters to spend significant time conducting repetitive screening calls.

LiveInterview aims to automate this initial screening stage while maintaining a structured and consistent interview experience.

### Traditional Process

```text
Job Application
      ↓
Recruiter Screening
      ↓
Manual Interview
      ↓
Evaluation
      ↓
Shortlisting
```

### LiveInterview

```text
Job Description
      ↓
AI Interview Generation
      ↓
Candidate Invitation
      ↓
AI Voice Interview
      ↓
Transcript
      ↓
AI Evaluation
      ↓
Candidate Ranking
```

---

# 👨‍💻 About the Developer

## Harsh Raj

**B.Tech — Computer Science & Engineering**

I am a software developer interested in building scalable applications, AI-powered products, and modern full-stack systems.

My primary development interests include:

- Android Development
- Kotlin
- Jetpack Compose
- Java
- Spring Boot
- Full-Stack Development
- AI/LLM Applications
- Firebase
- REST APIs
- Database Systems
- Cloud Deployment

This project is part of my practical development portfolio and demonstrates my experience working with modern web technologies, third-party APIs, authentication, databases, AI services, and cloud deployment.

---

# 📫 Connect With Me

**GitHub:**  
https://github.com/Harsh121415

**Project Repository:**  
https://github.com/Harsh121415/liveinterview

---

# 📄 License

This project is intended for educational, portfolio, and demonstration purposes.

---

## ⭐ If you find this project interesting

Consider giving the repository a ⭐ on GitHub.

Built with ❤️ by **Harsh Raj**