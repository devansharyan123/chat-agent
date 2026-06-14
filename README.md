# AI Chat Support Agent

A production-ready AI-powered customer support chat application for **Spur Demo Store** — a fictional e-commerce store. Built with a clean separation of concerns between frontend and backend, this application lets users chat with an AI support agent powered by **DeepSeek** (via OpenAI-compatible API).

---

## Architecture

```
chat-agent/
├── frontend/          # Next.js 15 (App Router) + Tailwind CSS
│   ├── src/
│   │   ├── app/       # Pages, layouts, providers
│   │   ├── components/# UI & chat components
│   │   ├── hooks/     # React Query & custom hooks
│   │   ├── lib/       # Utilities
│   │   └── types/     # TypeScript types
│   └── ...
│
├── backend/           # Express + Prisma + DeepSeek AI
│   ├── src/
│   │   ├── lib/
│   │   │   ├── ai/    # AI service layer (DeepSeek)
│   │   │   ├── db/    # Prisma client
│   │   │   └── validations/  # Zod schemas
│   │   ├── routes/    # Express route handlers
│   │   └── index.ts   # Server entry point
│   ├── prisma/        # Database schema & migrations
│   └── ...
│
└── README.md
```

### Frontend
- **Next.js 15** with App Router for server-side rendering and routing
- **Tailwind CSS** for utility-first styling with dark mode support
- **Framer Motion** for smooth message animations
- **TanStack Query (React Query)** for server state management
- **Sonner** for toast notifications
- **shadcn/ui**-inspired component design

### Backend
- **Express.js** REST API server
- **Prisma ORM** for PostgreSQL database management
- **Zod** for request validation
- **DeepSeek API** via OpenAI-compatible SDK for AI responses

### Database
- **PostgreSQL** with Prisma ORM
- Tables: `Conversation` and `Message` with cascade delete
- Messages stored with sender type (USER/AI) and timestamps

---

## Features

- 💬 Real-time AI chat interface with typing indicators
- 🌙 Dark/light mode toggle
- 📱 Fully responsive mobile and desktop design
- 💾 Persistent conversations via PostgreSQL
- 🔄 Auto-restore messages on page refresh
- 📋 Copy AI responses with one click
- 🔁 Retry failed AI requests
- 💡 Suggested questions for new users
- 🏷️ Conversation metadata (ID, message count)
- ⏳ Loading skeletons for better UX
- 🛡️ Comprehensive error handling with friendly messages

---

## Setup

### Prerequisites
- Node.js 18+
- PostgreSQL database (local or [Neon](https://neon.tech))
- DeepSeek API key

### 1. Clone & Install

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 2. Configure Environment

**Backend** (`backend/.env`):
```env
DATABASE_URL="postgresql://user:password@host:5432/chat-agent"
DEEPSEEK_API_KEY="sk-your-deepseek-api-key"
PORT=4000
FRONTEND_URL="http://localhost:3000"
```

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 3. Database Setup

```bash
cd backend
npx prisma migrate dev --name init
```

### 4. Run

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Visit **http://localhost:3000** to use the application.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/chat/conversation` | Create a new conversation |
| `POST` | `/api/chat/message` | Send a message and get AI reply |
| `GET` | `/api/chat/history/:conversationId` | Get conversation history |
| `GET` | `/api/health` | Health check |

### POST /api/chat/message

```json
{
  "message": "What is your return policy?",
  "conversationId": "uuid"
}
```

Response:
```json
{
  "reply": "We offer a 30-day return window...",
  "conversationId": "uuid",
  "success": true
}
```

---

## AI Service Layer

The AI logic is cleanly abstracted in `backend/src/lib/ai/`:

- **`systemPrompt.ts`** — Professional support agent system prompt
- **`knowledgeBase.ts`** — Structured store policies (shipping, returns, payments, support hours)
- **`generateReply.ts`** — DeepSeek API integration with context window management

The context window includes:
- System prompt
- Knowledge base
- Last 10 messages from conversation history
- Latest user message

---

## Design Decisions

### Why Prisma?
- Type-safe database queries with auto-generated TypeScript types
- Declarative migrations for schema versioning
- Excellent DX with Prisma Studio for data browsing

### Why Service Layer?
- AI logic is decoupled from route handlers
- Makes it easy to swap AI providers (OpenAI, Anthropic, etc.)
- Testable in isolation

### Why Conversation Persistence?
- Users can refresh without losing context
- Enables future features like conversation history browsing
- Essential for multi-channel support (WhatsApp, Instagram, etc.)

---

## Trade-offs

- **Limited context window**: Only last 10 messages are sent to the AI to manage token usage
- **Hardcoded knowledge base**: Store policies are embedded in code; a production version would use a database or CMS
- **No authentication**: Currently single-user; auth would be needed for multi-tenant support
- **Single model**: Uses `deepseek-chat`; future versions could support model selection

---

## Future Improvements

- **RAG (Retrieval Augmented Generation)**: Connect to a vector database for dynamic knowledge retrieval
- **Vector database**: Store product catalogs and documentation as embeddings
- **Multi-channel integrations**: WhatsApp, Instagram, Facebook Messenger, live chat widgets
- **Agent tools**: Order lookup, refund processing, inventory checks
- **Human handoff**: Escalate to human agents when AI can't resolve
- **Analytics dashboard**: Track conversations, response times, customer satisfaction
- **Streaming responses**: Real-time token-by-token AI responses

---

## Deployment

### Frontend → Vercel
```bash
cd frontend
npx vercel
```

### Backend → Railway / Render / Fly.io
Deploy the `backend/` directory as a Node.js service with the `DATABASE_URL` and `DEEPSEEK_API_KEY` environment variables set.

### Database → Neon PostgreSQL
Create a free database at [neon.tech](https://neon.tech) and use the connection string as `DATABASE_URL`.
