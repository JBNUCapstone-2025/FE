// src/components/Chatcontent.jsx
import React, { useState, useEffect, useMemo, useRef } from "react";
import styled from "styled-components";
import colors from "../styles/colors";
import { PiAirplaneTakeoffFill } from "react-icons/pi";
import { useNavigate } from "react-router-dom";

/* ========== 레이아웃 & 공통 스타일 ========== */
export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-block: 20px;
  padding-inline: 12px;
  border-top: 1px solid ${colors.sub};
  gap: 12px;
`;

/* 페이지 컨테이너: 가로 스크롤 + 스냅 */
const PagesViewport = styled.div`
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  gap: 0;
  /* 스크롤바 숨김 */
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`;

/* 각 페이지: 뷰포트 너비 100% 고정, 스냅 포인트 */
const Page = styled.div`
  flex: 0 0 100%;
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-bottom: 6px;
`;

/* 인디케이터(도트) */
const Dots = styled.div`
  display: flex;
  align-self: center;
  gap: 10px;
  padding-top: 4px;
`;
const Dot = styled.button`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 0;
  background: ${(p) => (p.active ? "#000" : "rgba(0,0,0,0.3)")};
  cursor: pointer;
  padding: 0;
`;

/* ========== 카드 스타일 ========== */
export const Content = styled.div`
  display: grid;
  grid-template-columns: 7.5fr 2.5fr;
  align-items: stretch;
  padding-block: 5px;
`;

export const Left = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 0;
  margin-left: 2px;
`;

export const Right = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 0;
  margin-right: 2px;
`;

export const LeftTop = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: ${colors.sub};
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  color: white;
  font-size: 20px;
  padding: 6px 10px;
  box-shadow: 0 0 5px rgba(0,0,0,0.05);
`;

export const RightTop = styled.div`
  background-color: ${colors.sub};
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  text-align: center;
  color: white;
  padding: 6px 0;
  min-height: 22.5px;
  box-shadow: 0 0 10px rgba(0,0,0,0.05);
`;

export const LeftBottom = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  padding: 10px;
  box-shadow: 0 0 10px rgba(0,0,0,0.05);
  background: #fff;
`;

export const RightBottom = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  box-shadow: 0 0 10px rgba(0,0,0,0.05);
  background: #fff;
`;

const Text = styled.p`
  font-size: 15px;
  margin: 0;
  padding: 5px 20px;

  &.title { padding: 0; padding-left: 10px; }
  &.sentiment { font-size: 10px; padding: 0; margin: 5px 0 0 0; }
`;

const SentimentImg = styled.img`
  width: 50%;
  height: auto;
  display: block;
  padding-bottom: 5px;
`;

/* ========== 유틸 ========== */
function todayStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y} - ${m} - ${day}`;
}

/* ========== 컴포넌트 ========== */
export default function ChatContent({
  initialItems = [],
  onAdd,
  addImage, // 오늘 카드에 붙일 이미지 (add.png)
}) {
  const [items, setItems] = useState(initialItems);

  // 페이지 계산(4개/페이지)
  const pages = useMemo(() => {
    const chunk = [];
    for (let i = 0; i < items.length; i += 4) {
      chunk.push(items.slice(i, i + 4));
    }
    return chunk.length ? chunk : [[]];
  }, [items]);

  // 현재 페이지 인덱스 (도트 & 스크롤 연동)
  const [pageIdx, setPageIdx] = useState(0);
  const viewportRef = useRef(null);

  const navigate = useNavigate();

  // 마운트 시 "오늘" 항목 없으면 자동 생성
// ✅ 항상 오늘 카드가 1개 보장 + 새로고침/데이터 재주입에도 안정
    useEffect(() => {
    const today = todayStr();
    const hasTodayInInitial = initialItems.some((it) => it.date === today);
    const createdDate = localStorage.getItem("todayCardDate");

    // 1) 부모 데이터에 이미 오늘 카드가 있으면 그걸 그대로 사용
    if (hasTodayInInitial) {
        setItems(initialItems);
        // 기록도 오늘로 맞춰둠(다음 렌더 때 중복 생성 방지)
        localStorage.setItem("todayCardDate", today);
        return;
    }

    // 2) 부모 데이터엔 없지만, 오늘 이미 만든 적이 있으면(로컬 기록),
    //    화면에는 오늘 카드 1개를 앞에 붙여서 보여준다(중복 onAdd 호출 없음)
    if (createdDate === today) {
        const todayCard = {
        title: "",
        date: today,
        sentimentLabel: "CLASS : ??",
        rightHeader: "",
        sentimentImage: addImage,
        isQuickAdd: true,
        };
        setItems([todayCard, ...initialItems]);
        return;
    }

    // 3) 오늘 처음 생성해야 하는 경우(기록도 없고, initial에도 없음)
    const newItem = {
        title: "",
        date: today,
        sentimentLabel: "CLASS : ??",
        rightHeader: "",
        sentimentImage: addImage,
        isQuickAdd: true,
    };
    setItems([newItem, ...initialItems]);
    onAdd && onAdd(newItem);              // ← 진짜로 처음 만든 경우에만 호출
    localStorage.setItem("todayCardDate", today);
    }, [initialItems, addImage, onAdd]);


  // 스크롤 위치로 현재 페이지 계산
  const handleScroll = (e) => {
    const el = e.currentTarget;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    if (idx !== pageIdx) setPageIdx(idx);
  };

  // 도트 클릭 시 해당 페이지로 스크롤
  const scrollToPage = (idx) => {
    const el = viewportRef.current;
    if (!el) return;
    el.scrollTo({
      left: idx * el.clientWidth,
      behavior: "smooth",
    });
  };

  // 자동 생성 카드 클릭 시 /chat 이동
  const handleQuickAddClick = (it) => {
    if (it.isQuickAdd) navigate("/chat");
  };

  return (
    <ContentWrapper>
      {/* 뷰포트: 스와이프/스크롤로 페이지 이동 */}
      <PagesViewport ref={viewportRef} onScroll={handleScroll}>
        {pages.map((pageItems, p) => (
          <Page key={p}>
            {pageItems.map((it, idx) => (
              <Content key={`${p}-${idx}`} onClick={() => handleQuickAddClick(it)}>
                <Left>
                  <LeftTop>
                    <PiAirplaneTakeoffFill size={16} style={{ paddingLeft: 5 }} />
                    <Text className="title">BOARDING PASS</Text>
                  </LeftTop>
                  <LeftBottom>
                    <Text>TITLE : {it.title || "\u00A0"}</Text>
                    <Text>DATE : {it.date}</Text>
                  </LeftBottom>
                </Left>

                <Right>
                  <RightTop>{it.rightHeader}</RightTop>
                  <RightBottom
                    style={{ cursor: it.isQuickAdd ? "pointer" : "default" }}
                    role={it.isQuickAdd ? "button" : undefined}
                    tabIndex={it.isQuickAdd ? 0 : undefined}
                  >
                    <Text className="sentiment">{it.sentimentLabel}</Text>
                    {it.sentimentImage && (
                      <SentimentImg src={it.sentimentImage} alt="sentiment" />
                    )}
                  </RightBottom>
                </Right>
              </Content>
            ))}
          </Page>
        ))}
      </PagesViewport>

      {/* 페이지 도트 */}
      <Dots>
        {pages.map((_, i) => (
          <Dot key={i} active={i === pageIdx} aria-label={`page ${i + 1}`} onClick={() => scrollToPage(i)} />
        ))}
      </Dots>
    </ContentWrapper>
  );
}
