/**
 * LexAIChat.jsx
 * Drop this into your existing React frontend.
 * Uses sessionStorage for chat history (clears on tab close).
 * Calls your FastAPI backend at BACKEND_URL.
 *
 * Props:
 *   backendUrl  — string, default "http://localhost:8000"
 *   storageKey  — string, default "lexai_chat_history"
 */

import { useState, useEffect, useRef } from "react";

const BACKEND_URL = "http://localhost:8000";
const STORAGE_KEY = "lexai_chat_history";

// ── Tiny storage helpers (sessionStorage = browser tab only) ─────────────────
const storage = {
  get: (key) => {
    try {
      return JSON.parse(sessionStorage.getItem(key)) ?? [];
    } catch {
      return [];
    }
  },
  set: (key, value) => {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch {}
  },
  clear: (key) => sessionStorage.removeItem(key),
};

// ── Icons (inline SVG, no dep) ───────────────────────────────────────────────
const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
  </svg>
);

const ScaleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 8C8 10 5.9 16.17 3.82 21L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20c4 0 4-2 8-2s4 2 8 2v-2c-4 0-4-2-8-2-1.13 0-1.9.16-2.53.33C14.28 12.17 16 10 17 8zM11 8a4 4 0 1 0-8 0l4 7 4-7z" />
  </svg>
);

const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
  </svg>
);

const UploadIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" />
  </svg>
);

// ── Suggested questions ──────────────────────────────────────────────────────
const SUGGESTIONS = [
  "What is Section 302 IPC?",
  "What are my rights if arrested?",
  "How do I file an FIR?",
  "Explain Article 21 of the Constitution",
];

// ── Main Component ────────────────────────────────────────────────────────────
export default function LexAIChat({
  backendUrl = BACKEND_URL,
  storageKey = STORAGE_KEY,
}) {
  const [messages, setMessages] = useState(() => storage.get(storageKey));
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pdfs, setPdfs] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);
  const fileRef = useRef(null);
  const textareaRef = useRef(null);

  // persist to sessionStorage on every change
  useEffect(() => {
    storage.set(storageKey, messages);
  }, [messages, storageKey]);

  // scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // fetch loaded PDFs on mount
  useEffect(() => {
    fetch(`${backendUrl}/pdfs`)
      .then((r) => r.json())
      .then((d) => setPdfs(d.pdfs ?? []))
      .catch(() => {});
  }, [backendUrl]);

  const sendMessage = async (text) => {
    const userText = text ?? input.trim();
    if (!userText || loading) return;
    setInput("");
    setError(null);

    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch(`${backendUrl}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();

      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: data.reply,
          meta: { contextUsed: data.context_used, pdfsLoaded: data.pdfs_loaded },
        },
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch(`${backendUrl}/upload-pdf`, {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      setPdfs((prev) => [...new Set([...prev, file.name])]);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `📄 **${file.name}** has been uploaded and indexed (${data.chars?.toLocaleString()} chars). I can now answer questions from it.`,
          meta: { isSystem: true },
        },
      ]);
    } catch {
      setError("PDF upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const clearChat = () => {
    setMessages([]);
    storage.clear(storageKey);
  };

  const isEmpty = messages.length === 0;

  return (
    <div style={styles.wrapper}>
      {/* ── Header ── */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.logo}>
            <ScaleIcon />
          </div>
          <div>
            <div style={styles.headerTitle}>LexAI</div>
            <div style={styles.headerSub}>Indian Legal Assistant</div>
          </div>
        </div>
        <div style={styles.headerRight}>
          {pdfs.length > 0 && (
            <div style={styles.pdfBadge} title={pdfs.join(", ")}>
              📄 {pdfs.length} PDF{pdfs.length > 1 ? "s" : ""}
            </div>
          )}
          <button
            style={styles.iconBtn}
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            title="Upload PDF"
          >
            <UploadIcon />
          </button>
          <button style={styles.iconBtn} onClick={clearChat} title="Clear chat">
            <TrashIcon />
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf"
            style={{ display: "none" }}
            onChange={handleUpload}
          />
        </div>
      </div>

      {/* ── Messages ── */}
      <div style={styles.messages}>
        {isEmpty && (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>⚖️</div>
            <div style={styles.emptyTitle}>Ask me about Indian law</div>
            <div style={styles.emptySubtitle}>
              IPC · Constitution · CrPC · Consumer Rights · RTI and more
            </div>
            <div style={styles.suggestions}>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  style={styles.suggestion}
                  onClick={() => sendMessage(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              ...styles.msgRow,
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            {msg.role === "assistant" && (
              <div style={styles.avatar}>⚖️</div>
            )}
            <div
              style={{
                ...styles.bubble,
                ...(msg.role === "user" ? styles.userBubble : styles.aiBubble),
              }}
            >
              <MessageContent content={msg.content} />
              {msg.meta?.contextUsed && (
                <div style={styles.ctxTag}>📄 used PDF context</div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ ...styles.msgRow, justifyContent: "flex-start" }}>
            <div style={styles.avatar}>⚖️</div>
            <div style={{ ...styles.bubble, ...styles.aiBubble }}>
              <TypingDots />
            </div>
          </div>
        )}

        {error && (
          <div style={styles.error}>⚠️ {error} — is the backend running?</div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Disclaimer ── */}
      <div style={styles.disclaimer}>
        LexAI provides legal information, not legal advice. Consult a qualified
        advocate for your specific situation.
      </div>

      {/* ── Input ── */}
      <div style={styles.inputRow}>
        <textarea
          ref={textareaRef}
          style={styles.textarea}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about Indian law… (Enter to send, Shift+Enter for newline)"
          rows={1}
        />
        <button
          style={{
            ...styles.sendBtn,
            opacity: loading || !input.trim() ? 0.5 : 1,
          }}
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────
function MessageContent({ content }) {
  // basic bold (**text**) and line breaks
  const parts = content.split(/\*\*(.*?)\*\*/g);
  return (
    <div style={{ lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
      {parts.map((p, i) =>
        i % 2 === 1 ? <strong key={i}>{p}</strong> : p
      )}
    </div>
  );
}

function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 4, padding: "2px 0" }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "#94a3b8",
            animation: `bounce 1s ease-in-out ${i * 0.15}s infinite`,
          }}
        />
      ))}
      <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}`}</style>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    maxWidth: 800,
    margin: "0 auto",
    fontFamily: "'Inter', system-ui, sans-serif",
    background: "#0f172a",
    color: "#e2e8f0",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 20px",
    borderBottom: "1px solid #1e293b",
    background: "#0f172a",
  },
  headerLeft: { display: "flex", alignItems: "center", gap: 10 },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 8,
    background: "#1e3a5f",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#60a5fa",
  },
  headerTitle: { fontWeight: 700, fontSize: 16, color: "#f1f5f9" },
  headerSub: { fontSize: 11, color: "#64748b" },
  headerRight: { display: "flex", alignItems: "center", gap: 8 },
  pdfBadge: {
    fontSize: 11,
    background: "#1e3a5f",
    color: "#60a5fa",
    padding: "3px 8px",
    borderRadius: 20,
    cursor: "default",
  },
  iconBtn: {
    background: "transparent",
    border: "none",
    color: "#64748b",
    cursor: "pointer",
    padding: 6,
    borderRadius: 6,
    display: "flex",
    alignItems: "center",
    transition: "color 0.15s",
  },
  messages: {
    flex: 1,
    overflowY: "auto",
    padding: "20px 16px",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  empty: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "60px 20px",
    gap: 8,
  },
  emptyIcon: { fontSize: 48, marginBottom: 8 },
  emptyTitle: { fontSize: 20, fontWeight: 600, color: "#f1f5f9" },
  emptySubtitle: { fontSize: 13, color: "#64748b", marginBottom: 20 },
  suggestions: { display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" },
  suggestion: {
    background: "#1e293b",
    border: "1px solid #334155",
    color: "#94a3b8",
    borderRadius: 20,
    padding: "6px 14px",
    fontSize: 13,
    cursor: "pointer",
    transition: "all 0.15s",
  },
  msgRow: { display: "flex", gap: 8, alignItems: "flex-end" },
  avatar: { fontSize: 20, flexShrink: 0, marginBottom: 2 },
  bubble: {
    maxWidth: "78%",
    padding: "10px 14px",
    borderRadius: 14,
    fontSize: 14,
    lineHeight: 1.6,
  },
  userBubble: {
    background: "#1d4ed8",
    color: "#f1f5f9",
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    background: "#1e293b",
    color: "#e2e8f0",
    borderBottomLeftRadius: 4,
    border: "1px solid #334155",
  },
  ctxTag: {
    marginTop: 6,
    fontSize: 11,
    color: "#60a5fa",
    opacity: 0.8,
  },
  error: {
    background: "#450a0a",
    border: "1px solid #7f1d1d",
    color: "#fca5a5",
    padding: "8px 14px",
    borderRadius: 8,
    fontSize: 13,
    textAlign: "center",
  },
  disclaimer: {
    fontSize: 11,
    color: "#475569",
    textAlign: "center",
    padding: "6px 16px",
    borderTop: "1px solid #1e293b",
  },
  inputRow: {
    display: "flex",
    gap: 8,
    padding: "12px 16px",
    background: "#0f172a",
    borderTop: "1px solid #1e293b",
  },
  textarea: {
    flex: 1,
    background: "#1e293b",
    border: "1px solid #334155",
    borderRadius: 10,
    color: "#e2e8f0",
    padding: "10px 14px",
    fontSize: 14,
    resize: "none",
    fontFamily: "inherit",
    outline: "none",
    lineHeight: 1.5,
  },
  sendBtn: {
    background: "#1d4ed8",
    border: "none",
    borderRadius: 10,
    color: "#fff",
    width: 42,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "opacity 0.15s",
  },
};
