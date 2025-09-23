import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * Chat.jsx — A pretty chat UI wired to FastAPI (/api/chat)
 * - Pure React + TailwindCSS (no extra UI libs required)
 * - Message bubbles, typing indicator, error states
 * - Mobile-friendly, dark-mode friendly
 *
 * Usage:
 * 1) Ensure Tailwind is configured in your Vite project.
 * 2) Drop this file at: src/components/Chat.jsx
 * 3) Import and render: <Chat apiBase="http://localhost:8000" />
 *    (or omit apiBase to use relative path "/api")
 */

function classNames(...xs) {
  return xs.filter(Boolean).join(" ");
}

function Avatar({ role }) {
  const isUser = role === "user";
  const bg = isUser
    ? "bg-gradient-to-br from-indigo-500 to-sky-500"
    : "bg-gradient-to-br from-emerald-500 to-teal-500";
  const label = isUser ? "U" : "A";
  return (
    <div
      className={classNames(
        "flex h-9 w-9 shrink-0 select-none items-center justify-center rounded-full text-white shadow-md",
        bg
      )}
      aria-label={isUser ? "User avatar" : "Assistant avatar"}
    >
      <span className="font-semibold">{label}</span>
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="inline-block h-2 w-2 animate-bounce rounded-full bg-gray-400 dark:bg-gray-500"
          style={{ animationDelay: `${i * 120}ms` }}
        />
      ))}
    </div>
  );
}

function useAutoResizeTextarea(dep) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "0px";
    const newH = el.scrollHeight;
    el.style.height = Math.min(200, newH) + "px"; // cap height
  }, [dep]);
  return ref;
}

export default function Chat({ apiBase = "" }) {
  const [messages, setMessages] = useState([
    {
      id: crypto.randomUUID(),
      role: "assistant",
      content:
        "안녕하세요! 편하게 메시지를 보내보세요. 백엔드(FastAPI)와 연결되어 있어요.",
      ts: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const listRef = useRef(null);
  const textareaRef = useAutoResizeTextarea(input);

  const apiUrl = useMemo(() => {
    const base = apiBase?.trim?.() || ""; // e.g., "http://localhost:8000"
    return base ? `${base}/api/chat` : "/api/chat";
  }, [apiBase]);

  useEffect(() => {
    // auto-scroll to bottom when messages change
    const wrap = listRef.current;
    if (!wrap) return;
    wrap.scrollTo({ top: wrap.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;
    setError("");

    const userMsg = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      ts: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sentence: text }),
      });

      if (!res.ok) {
        throw new Error(`서버 오류 (${res.status})`);
      }
      const data = await res.json();
      const answer = data?.answer ?? "응답을 파싱할 수 없어요.";

      const botMsg = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: answer,
        ts: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (e) {
      console.error(e);
      setError(e.message || "네트워크 오류가 발생했어요.");
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e) {
    if ((e.key === "Enter" && !e.shiftKey)) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="mx-auto flex h-[100dvh] max-w-3xl flex-col bg-white/60 p-0 text-gray-900 backdrop-blur dark:bg-neutral-900/60 dark:text-gray-100 sm:h-[90dvh] sm:rounded-2xl sm:border sm:border-gray-200 sm:p-0 dark:sm:border-neutral-800">
      {/* Header */}
      <header className="relative overflow-hidden rounded-t-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 p-5 text-white shadow">
        <div className="pointer-events-none absolute inset-0 opacity-20 [background:radial-gradient(closest-side,white,transparent)]" />
        <h1 className="relative z-10 text-xl font-bold sm:text-2xl">감정 케어 챗봇</h1>
        <p className="relative z-10 mt-1 text-sm text-white/90">
          FastAPI ↔︎ React 연결 데모. Shift+Enter로 줄바꿈, Enter로 전송.
        </p>
      </header>

      {/* Messages */}
      <main
        ref={listRef}
        className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6"
      >
        {messages.map((m) => (
          <MessageBubble key={m.id} role={m.role} ts={m.ts}>
            {m.content}
          </MessageBubble>
        ))}

        {loading && (
          <div className="flex items-end gap-3">
            <Avatar role="assistant" />
            <div className="max-w-[80%] rounded-2xl rounded-tl-none bg-gray-100 p-3 text-sm leading-relaxed shadow dark:bg-neutral-800">
              <TypingDots />
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-red-700 dark:border-red-700/50 dark:bg-red-900/20 dark:text-red-300">
            {error}
          </div>
        )}
      </main>

      {/* Composer */}
      <footer className="sticky bottom-0 border-t border-gray-200 bg-white/70 p-3 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/70 sm:rounded-b-2xl">
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="오늘 기분이 어떤가요?"
            className="min-h-[48px] w-full resize-none rounded-xl border border-gray-300 bg-white px-3 py-3 text-[15px] shadow-sm outline-none placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:border-indigo-400"
          />
          <button
            onClick={sendMessage}
            disabled={loading || input.trim().length === 0}
            className={classNames(
              "inline-flex h-[48px] shrink-0 items-center justify-center rounded-xl px-4 text-sm font-semibold shadow-sm transition",
              "bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 disabled:cursor-not-allowed disabled:bg-gray-300",
              "dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:active:bg-indigo-700 dark:disabled:bg-neutral-700"
            )}
            aria-label="Send message"
            title="전송 (Enter)"
          >
            <SendIcon className="mr-2 h-4 w-4" />
            전송
          </button>
        </div>
        <div className="mt-1 px-1 text-[11px] text-gray-500 dark:text-gray-400">
          Enter: 전송 · Shift+Enter: 줄바꿈
        </div>
      </footer>
    </div>
  );
}

function MessageBubble({ role, ts, children }) {
  const isUser = role === "user";
  const time = useMemo(() => new Date(ts).toLocaleTimeString(), [ts]);

  return (
    <div className={classNames("flex gap-3", isUser ? "justify-end" : "justify-start")}>      
      {!isUser && <Avatar role={role} />}
      <div
        className={classNames(
          "max-w-[80%] rounded-2xl p-3 text-[15px] leading-relaxed shadow",
          isUser
            ? "rounded-tr-none bg-indigo-600 text-white"
            : "rounded-tl-none bg-gray-100 text-gray-900 dark:bg-neutral-800 dark:text-gray-100"
        )}
      >
        <div className="whitespace-pre-wrap">{children}</div>
        <div
          className={classNames(
            "mt-2 select-none text-[10px]",
            isUser ? "text-indigo-100" : "text-gray-500 dark:text-gray-400"
          )}
        >
          {time}
        </div>
      </div>
      {isUser && <Avatar role={role} />}
    </div>
  );
}

function SendIcon({ className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
  );
}
