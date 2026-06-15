# LexAI Backend

FastAPI + Groq + pdfplumber — no Supabase, no LangChain.

## Setup

```bash
pip install -r requirements.txt

# Put your Indian law PDFs in the /pdfs folder
mkdir pdfs
# cp your-ipc.pdf ./pdfs/
# cp your-constitution.pdf ./pdfs/

# Set your Groq API key
export GROQ_API_KEY=gsk_your_key_here

# Run
uvicorn main:app --reload --port 8000
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Health check + loaded PDFs |
| GET | `/pdfs` | List indexed PDFs |
| POST | `/upload-pdf` | Upload a PDF at runtime |
| POST | `/chat` | Chat with history |

## Chat Request Format

```json
POST /chat
{
  "messages": [
    { "role": "user", "content": "What is Section 302 IPC?" }
  ],
  "model": "llama-3.3-70b-versatile"
}
```

## Response Format

```json
{
  "reply": "Section 302 of the IPC...",
  "context_used": true,
  "pdfs_loaded": ["ipc.pdf", "constitution.pdf"]
}
```

## PDF Loading

- **On startup**: all `.pdf` files in `/pdfs/` are auto-loaded
- **At runtime**: POST to `/upload-pdf` to add more

Context is retrieved via keyword matching — no embeddings needed for prototype.
