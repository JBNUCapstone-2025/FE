// src/pages/Main.jsx
import React,{useState, useEffect, useRef, useMemo} from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import logo from "../logo/logo.png";
import colors from "../styles/colors";
import { FaAngleLeft } from "react-icons/fa";
import { FaRegBell } from "react-icons/fa";
import { FaCircleArrowUp } from "react-icons/fa6";

// ✅ avatars 폴더의 png를 한 번에 import (Vite)
const avatarModules = import.meta.glob("../img/character/*.png", { eager: true, import: "default" });

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  max-width: 500px;
  margin: 0 auto;
  box-shadow: 0 0 10px rgba(0,0,0,0.15);
  border-radius: 15px;
  background-color: white;
`;

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  border-bottom: 1px solid ${colors.text};
  line-height: 0px;
  padding: 30px 0;
`;

const Header = styled.img`
  width: calc(30%);
`;

const MessageList = styled.div`
  flex: 1;
  padding: 16px;
  background: white;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Row = styled.div`
  display: flex;
  justify-content: ${p => (p.me ? "flex-end" : "flex-start")};
`;

const RowInner = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 8px;
  max-width: 85%;
`;

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid ${colors.text};
  padding: 5px;
  flex: 0 0 32px;
  object-fit: cover;
  background: transparent;
  user-select: none;
  transform: scaleX(-1);
  margin-right: 10px;
`;

const Bubble = styled.div`
  max-width: 100%;
  padding: 10px 14px;
  border-radius: 12px;
  background: ${p => (p.me ? "#dddddd" : colors.main)};
  color: #000;
  font-size: 13px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  word-break: break-word;
  white-space: pre-wrap;
`;

const ChatWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  width: calc(100%);
  line-height: 0;
  padding-bottom: 20px;
`;

const ChatInput = styled.input`
  width: calc(80%);
  height: 30px;
  background-color: ${colors.chatinput};
  border-radius: 15px;
  border: none;
  margin-top: auto;
  font: bold 13px 'arial';
  color: black;
  padding: 10px 0;
  padding-left: 20px;
`;

// icon
const TopLeft = styled(FaAngleLeft)`
  width: 20px;
  height: auto;
  color: ${colors.text};
  cursor: pointer;

  &:hover {
    color: ${colors.hover};
  }
`;

const TopRight = styled(FaRegBell)`
  width: 20px;
  height: auto;
  color: ${colors.text};
  cursor: pointer;

  &:hover {
    color: ${colors.hover};
  }
`;

const Send = styled(FaCircleArrowUp)`
  width: 30px;
  height: auto;
  color: ${colors.text};
  cursor: pointer;
  &:hover{
    color: ${colors.hover};
  }
`

export default function Test({ apiBase = "" }){
  const [messages, setMessages] = useState([
    {id:1, role:"other", text:"반갑다 멍! 오늘 하루는 어땠나? 멍!"},
  ]);

  const navigate = useNavigate();

  const composingRef = useRef(false);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [, setError] = useState("");

  const listRef = useRef(null);

  const apiUrl = useMemo(() => {
    const base = (apiBase || "").trim();
    return base ? `${base}/api/chat` : "/api/chat";
  }, [apiBase]);

  // ✅ 현재 선택된 캐릭터 이름 (localStorage → state)
  const [character, setCharacter] = useState(() => {
    return localStorage.getItem("character") || "dog";
  });

  // ✅ 다른 탭에서 character가 바뀌어도 동기화
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "character") {
        setCharacter(e.newValue || "dog");
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // ✅ character명 → 실제 이미지 경로
  const avatarSrc = useMemo(() => {
    const key = `../img/character/${character}.png`;
    const fallback = `../img/character/dog.png`;
    return avatarModules[key] || avatarModules[fallback] || "";
  }, [character]);

  // 새 메시지마다 자동 스크롤
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

  // Enter로 전송
  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      if (e.isComposing || composingRef.current) return;
      e.preventDefault();
      sendMessage();
    }
  };

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    setError("");

    // 나의 메시지 추가
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
      const answer = data?.answer ?? "미안하다멍! 서버에 문제가 있다 멍!";

      // LLM 메시지 추가 (상대)
      const botMsg = { id: crypto.randomUUID(), role: "other", text: answer };
      setMessages(prev => [...prev, botMsg]);
    } catch (e) {
      const msg = e?.message || "네트워크 오류가 발생했다멍!";
      setError(msg);
      setMessages(prev => [
        ...prev,
        { id: crypto.randomUUID(), role: "other", text: `⚠️ ${msg}` },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return(
    <Wrapper>
      <HeaderWrapper>
        <TopLeft onClick={() => navigate("/main")}/>
        <Header src={logo} alt="logo"/>
        <TopRight/>
      </HeaderWrapper>

      {/* 대화창 영역 */}
      <MessageList ref={listRef}>
        {messages.map(m => {
          const isMe = m.role === "me";
          if (isMe) {
            // 나의 말풍선 (오른쪽, 아바타 없음)
            return (
              <Row key={m.id} me>
                <Bubble me>{m.text}</Bubble>
              </Row>
            );
          }
          // 상대 말풍선 (왼쪽, 아바타 표시)
          return (
            <Row key={m.id}>
              <RowInner>
                <Avatar src={avatarSrc} alt={`${character} avatar`} />
                <Bubble>{m.text}</Bubble>
              </RowInner>
            </Row>
          );
        })}

        {/* 타이핑 인디케이터 */}
        {loading && (
          <Row>
            <RowInner>
              <Avatar src={avatarSrc} alt={`${character} avatar`} />
              <Bubble>…</Bubble>
            </RowInner>
          </Row>
        )}
      </MessageList>

      {/* 입력창 */}
      <ChatWrapper>
        <ChatInput
          placeholder="오늘 하루 어땠어?"
          value={input}
          onChange={(e)=>setInput(e.target.value)}
          onKeyDown = {onKeyDown}
          onCompositionStart = {() => (composingRef.current = true)}
          onCompositionEnd = {() => (composingRef.current = false)}
        />
        <Send
          onClick={sendMessage}
        />
      </ChatWrapper>
    </Wrapper>
  );
}
