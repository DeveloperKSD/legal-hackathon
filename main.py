import os
import pdfplumber
from pathlib import Path
from contextlib import asynccontextmanager
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

# ── PDF Store ─────────────────────────────────────────────────────────────────
pdf_store: dict[str, str] = {}
PDF_DIR = Path("pdfs")

SYSTEM_PROMPT = """You are LexAI, an expert Indian legal assistant. You help users understand Indian laws, 
their rights, legal procedures, and court processes.

Guidelines:
- Answer clearly and in plain language
- Cite relevant sections of Indian law (IPC, CPC, CrPC, Constitution, etc.) when applicable
- Always clarify you are providing legal information, not legal advice
- If you have PDF context provided, prioritize that information
- For serious matters, recommend consulting a qualified advocate
- Be concise but thorough

If PDF context is available, use it to ground your answers."""

groq_client = Groq(api_key=os.environ.get("GROQ_API_KEY", ""))


# ── PDF helpers ───────────────────────────────────────────────────────────────
def extract_pdf_text(path) -> str:
    text_parts = []
    with pdfplumber.open(path) as pdf:
        for i, page in enumerate(pdf.pages):
            t = page.extract_text()
            if t:
                text_parts.append(f"[Page {i+1}]\n{t}")
    return "\n\n".join(text_parts)


def load_pdfs_from_disk():
    if not PDF_DIR.exists():
        PDF_DIR.mkdir()
        return
    for pdf_path in PDF_DIR.glob("*.pdf"):
        text = extract_pdf_text(pdf_path)
        pdf_store[pdf_path.name] = text
        print(f"[startup] Loaded: {pdf_path.name} ({len(text)} chars)")


def build_context(query: str, max_chars: int = 4000) -> str:
    if not pdf_store:
        return ""
    keywords = [w.lower() for w in query.split() if len(w) > 3]
    scored: list[tuple[float, str, str]] = []
    for fname, text in pdf_store.items():
        paragraphs = text.split("\n\n")
        for para in paragraphs:
            para_lower = para.lower()
            score = sum(1 for kw in keywords if kw in para_lower)
            if score > 0:
                scored.append((score, fname, para))
    scored.sort(key=lambda x: x[0], reverse=True)
    context_parts = []
    total = 0
    for _, fname, para in scored:
        if total + len(para) > max_chars:
            break
        context_parts.append(f"[From {fname}]\n{para}")
        total += len(para)
    return "\n\n".join(context_parts)


# ── Lifespan ──────────────────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app):
    load_pdfs_from_disk()
    yield


# ── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(title="LexAI Backend", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Models ────────────────────────────────────────────────────────────────────
class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    model: Optional[str] = "llama-3.3-70b-versatile"

class ChatResponse(BaseModel):
    reply: str
    context_used: bool
    pdfs_loaded: list[str]


# ── Routes ────────────────────────────────────────────────────────────────────
@app.get("/")
def root():
    return {"status": "ok", "pdfs_loaded": list(pdf_store.keys())}

@app.get("/pdfs")
def list_pdfs():
    return {"pdfs": list(pdf_store.keys()), "count": len(pdf_store)}

@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(400, "Only PDF files accepted")
    path = PDF_DIR / file.filename
    PDF_DIR.mkdir(exist_ok=True)
    content = await file.read()
    path.write_bytes(content)
    text = extract_pdf_text(path)
    pdf_store[file.filename] = text
    return {"message": f"Uploaded and indexed: {file.filename}", "chars": len(text)}

@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    if not groq_client.api_key:
        raise HTTPException(500, "GROQ_API_KEY not set")
    user_query = ""
    for msg in reversed(req.messages):
        if msg.role == "user":
            user_query = msg.content
            break
    context = build_context(user_query)
    system = SYSTEM_PROMPT
    if context:
        system += f"\n\n--- Relevant PDF Context ---\n{context}\n--- End Context ---"
    groq_messages = [{"role": "system", "content": system}]
    for m in req.messages:
        groq_messages.append({"role": m.role, "content": m.content})
    response = groq_client.chat.completions.create(
        model=req.model,
        messages=groq_messages,
        max_tokens=1024,
        temperature=0.3,
    )
    reply = response.choices[0].message.content
    return ChatResponse(
        reply=reply,
        context_used=bool(context),
        pdfs_loaded=list(pdf_store.keys()),
    )
