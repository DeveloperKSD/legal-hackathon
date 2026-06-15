# LexAI — Indian Legal Assistant Chatbot / later themis

A prototype AI chatbot that answers questions about Indian law. It reads uploaded legal PDFs and uses them as context when answering user queries — no vector database, no embeddings, just fast keyword-based retrieval.

---

## What it does

- Answers questions on Indian law (IPC, Constitution, CrPC, Companies Act, Labour laws, etc.)
- Reads your PDF documents at startup and uses them to ground its answers
- Maintains conversation history in the browser (sessionStorage — clears on tab close)
- Shows when PDF context was used in a response
- Lets you upload additional PDFs at runtime via the UI

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Tailwind (or plain HTML for quick testing) |
| Backend | FastAPI (Python) |
| LLM | Groq API — `llama-3.3-70b-versatile` |
| PDF Parsing | pdfplumber |
| Env Management | python-dotenv |
| Server | Uvicorn |

---

## Architecture

```
Browser (React / test.html)
        │
        │  POST /chat  { messages: [...] }
        ▼
FastAPI Backend (main.py)
        │
        ├── on startup: reads all PDFs from /pdfs folder
        │              stores text in memory (pdf_store dict)
        │
        ├── on /chat request:
        │     1. keyword-match user query against pdf_store
        │     2. inject top matching paragraphs into system prompt
        │     3. call Groq API with full conversation history
        │     4. return reply + metadata
        │
        └── /upload-pdf: parse new PDF and add to pdf_store live

No database. No embeddings. All PDF text lives in memory.
```

---

## Project Structure

```
LexAI/
├── main.py           # FastAPI backend
├── requirements.txt  # Python dependencies
├── .env              # Your API key (never commit this)
├── test.html         # Standalone browser test UI
├── LexAIChat.jsx     # React component for your frontend
└── pdfs/             # Drop your Indian law PDFs here
    ├── ipc_act.pdf
    ├── COI.pdf
    └── ...
```

---

## Setting up the `.env` file

Create a file named `.env` in the same folder as `main.py`:

```
GROQ_API_KEY=your_key_here
```

### Getting your Groq API key

1. Go to [https://console.groq.com](https://console.groq.com)
2. Sign up / log in
3. Click **API Keys** in the sidebar
4. Click **Create API Key**, copy it
5. Paste it in your `.env` file like this:

```
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

> ⚠️ Never share your `.env` file or push it to GitHub. Add `.env` to your `.gitignore`.

---

## Running the backend

```bash
# Install dependencies
pip install -r requirements.txt

# Add your PDFs to the /pdfs folder
# Then start the server
python -m uvicorn main:app --reload --port 8000
```

You should see:
```
[startup] Loaded: ipc_act.pdf (451105 chars)
[startup] Loaded: COI.pdf (823066 chars)
INFO:     Application startup complete.
```

Open `http://localhost:8000/pdfs` in your browser to confirm PDFs are loaded.

---

## Testing without React

Open `test.html` directly in Chrome while the backend is running. No setup needed.

## Integrating with React

```jsx
import LexAIChat from "./LexAIChat";

function App() {
  return <LexAIChat backendUrl="http://localhost:8000" />;
}
```
