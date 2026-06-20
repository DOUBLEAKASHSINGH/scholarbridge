This is a great structure! To make it "copy-paste ready" for your GitHub README, I have cleaned it up, added the architecture diagram, and professionalized the tone.

---

# ScholarBridge

ScholarBridge is an intelligent, full-stack SaaS platform designed to eliminate the information gap between students and life-changing financial aid. By leveraging autonomous AI agents, we discover, structure, and match opportunities with student potential.

## 1. Project Overview

ScholarBridge solves the "discovery problem" where millions in scholarships, internships, and grants go unspent due to poor visibility and bureaucratic complexity.

The platform provides three core capabilities:

* **AI Web Discovery Engine**: An admin-facing pipeline that utilizes Tavily for intent-based web retrieval and Gemini for structured data extraction, turning messy web content into verified database entries.
* **Personalized Match Scoring**: A student-facing engine that cross-references a user’s academic profile, financial need, and demographic tags against the opportunity database to provide a "Match Score" with tailored reasoning.
* **AI Mentorship Coach**: A zero-hallucination, context-aware chat interface that assists students in drafting essays and optimizing resumes by injecting their unique profile data directly into the AI's prompt.

## 2. Architecture & Tech Stack

The platform uses a modern Next.js 16/Tailwind 4 stack, leveraging Server Actions to bridge the gap between secure database operations and LLM-powered intelligence.

| Layer | Technology | Purpose |
| --- | --- | --- |
| **Frontend** | Next.js 16, React 19, Tailwind CSS 4 | Fast, server-rendered, and responsive SaaS UI. |
| **Database/Auth** | Firebase (Auth, Firestore, Storage) | Secure multi-user sessions, persistence, and PDF storage. |
| **AI Engine** | Google Gemini (2.0-flash/3.5) | Web content parsing, match reasoning, and coaching. |
| **Search/Ingestion** | Tavily AI API | Intelligent, application-focused web search. |
| **Deployment** | Vercel | Instant, zero-config CI/CD. |

## 3. Core Logic Flow

The data flow follows a secure path from external search engines to the internal Firestore database:

1. **Ingestion (`ingest.ts`)**: Admins input a query. The system refines the search to prioritize "apply" pages, scrapes results, and forces Gemini to return a strict `JSON` schema.
2. **Matching (`match.ts`)**: Student profiles are pulled from Firestore and sent alongside opportunity tags to Gemini to calculate personalized alignment.
3. **Coaching (`chatCoach.ts`)**: User-uploaded PDFs (via Firebase Storage) and profile details are injected into the LLM context to ensure advice is specific to the student's actual career path.

## 4. Repository Structure

```shell
scholarbridge/
├── src/
│   ├── app/
│   │   ├── actions/            # Server-side AI and Ingestion logic
│   │   ├── dashboard/          # Student-facing workspace
│   │   ├── admin/              # Admin discovery & ingestion
│   │   └── api/                # Route handlers for chat/AI
│   ├── components/             # Reusable UI (AICoach, Sidebar, etc.)
│   ├── contexts/               # Firebase Auth & User state
│   ├── lib/                    # Firebase and API initialization
│   └── types/                  # TypeScript interfaces
├── public/                     # Static assets
└── tailwind.config.ts          # Styling configuration

```

## 5. Getting Started

To run this repository locally, you must configure the following environment variables:

* `GEMINI_API_KEY`: API key for Gemini models.
* `TAVILY_API_KEY`: API key for web discovery.
* `NEXT_PUBLIC_FIREBASE_...`: Configuration keys for Firebase Auth/Firestore/Storage.

---

*Built for Hackathon 1.0 by **Akash Singh***
