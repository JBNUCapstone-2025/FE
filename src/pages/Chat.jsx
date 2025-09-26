// src/pages/Main.jsx
import React,{useState, useEffect, useRef, useMemo} from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  max-width: 500px;
  margin: 0 auto;
  box-shadow: 0 0 10px rgba(0,0,0,0.15);
  border-radius: 15px;
`;

const Header = styled.div`
  height: 50px;
  background: #adf1ad;
  font-size: 32px;
  font-weight: bold;
  text-align: center;
  line-height: 50px;
  border-top-left-radius : 15px;
  border-top-right-radius : 15px;
`;

const MessageList = styled.div`
  flex: 1; /* 나머지 공간 차지 */
  padding: 16px;
  background: #f0f0f0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Row = styled.div`
  display: flex;
  justify-content: ${p => (p.me ? "flex-end" : "flex-start")};
`;

const Bubble = styled.div`
  max-width: 70%;
  padding: 10px 14px;
  border-radius: 12px;
  /* 노란색: 나 / 파란색: LLM */
  background: ${p => (p.me ? "#ffe55c" : "#dbeafe")};
  color: #000;
  font-size: 15px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
`;

const ChatInput = styled.input`
  width: calc(100);
  height: 100px;
  background-color: white;
  border-radius: 15px;
  border: none;
  margin-top: auto;
  text-align: center;
  font: bold 15px 'arial';
  color: black;
`;

export default function Test({ apiBase = "" }){
  const [messages, setMessages] = useState([
    {id:1, role:"other", text:"안녕하세요! 메시지를 보내보세요."},
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const listRef = useRef(null);

  const apiUrl = useMemo(() => {
    const base = (apiBase || "").trim();
    return base ? `${base}/api/chat` : "/api/chat";
  }, [apiBase]);

  // 새 메시지마다 자동 스크롤
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

  // Enter로 전송
  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    setError("");

    // 나의 메시지 추가 (노란)
    const myMsg = { id: crypto.randomUUID(), role: "me", text };
    setMessages(prev => [...prev, myMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sentence: text }),
      });
      if (!res.ok) throw new Error(`서버 오류 (${res.status})`);
      const data = await res.json();
      const answer = data?.answer ?? "응답을 파싱할 수 없어요.";

      // LLM 메시지 추가 (파란)
      const botMsg = { id: crypto.randomUUID(), role: "other", text: answer };
      setMessages(prev => [...prev, botMsg]);
    } catch (e) {
      setError(e.message || "네트워크 오류가 발생했어요.");
      // 오류도 파란 말풍선으로 알려주기 (선택)
      setMessages(prev => [
        ...prev,
        { id: crypto.randomUUID(), role: "other", text: `⚠️ ${error || "오류가 발생했습니다."}` },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return(
    <Wrapper>
      <Header>너감보</Header>

      {/* 대화창 영역 */}
      <MessageList ref={listRef}>
        {messages.map(m => (
          <Row key={m.id} me={m.role==="me"}>
            <Bubble me={m.role==="me"}>{m.text}</Bubble>
          </Row>
        ))}

        {/* 타이핑 인디케이터 */}
        {loading && (
          <Row>
            <Bubble>…</Bubble>
          </Row>
        )}
      </MessageList>

      {/* 입력창 */}
      <ChatInput
        placeholder="오늘 하루 어땠어?"
        value={input}
        onChange={(e)=>setInput(e.target.value)}
        onKeyDown={onKeyDown}
      />

      {/* 에러 띄우기 (옵션) */}
      {error && (
        <div style={{padding:"6px 12px", color:"#b91c1c", fontSize:12}}>
          {error}
        </div>
      )}
    </Wrapper>
  );
}
