// src/pages/Main.jsx
import React,{useState, useEffect} from "react";
import styled from "styled-components";
import Header from "../components/Header";
import Character from "../components/Character";
import ChatContent from "../components/Chatcontent";
import DiaryContent from "../components/Diarycontent";

import colors from "../styles/colors";
import logo from '../logo/logo.png';
import { PiAirplaneTakeoffFill } from "react-icons/pi";

// test
import angry from '../icon/red.png';
import add from '../icon/add.png';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  max-width: 450px;
  margin: 0 auto;
  box-shadow: 0 0 10px rgba(0,0,0,0.15);
  border-radius: 15px;
  padding-inline: 15px;
`;


const CenterViewport = styled.div`
  flex: 1;           /* 남은 공간을 모두 차지 */
  min-height: 0;     /* 내부 스크롤/페이징이 가능하도록 */
  display: flex;
  flex-direction: column;
`;

const Title = styled.img`
  width: calc(30%);
  margin-block: 40px;
  align-self: center;
`;

const ContentSelectWrapper = styled.div`
  display: flex;
  min-height: 30px;
`;

const ContentSelect = styled.p`
  font-size: 20px;
  margin: 0;
  padding-block: 10px;
  padding-inline: 10px;
  cursor: pointer;
  user-select: none;
  transition: color .15s ease, opacity .15s ease;
  color: ${colors.deactivate};
  opacity: 0.9;

  &.active {
    color: ${colors.text};
    font-weight: 700;
    opacity: 1;
  }
`;

const Divider = styled.p`
  font-size: 20px;
  margin: 0;
  padding-block: 10px;
  padding-inline: 10px;
  color: ${colors.text}; 
`;

export default function Main(){
  const [selectedTab, setSelectedTab] = useState("chat");

  // 캐릭터 선택 관련
  const [, setCharacter] = useState(() => localStorage.getItem("character") || null);
  const [openCharacter, setOpenCharacter] = useState(() => !localStorage.getItem("character"));

  useEffect(() => {
    if (openCharacter) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [openCharacter]);

  const handleSelect = (id) => {
    setCharacter(id);
    localStorage.setItem("character", id);
    setOpenCharacter(false);
  };

  return(
    <Wrapper>
      <Title src={logo} alt="logo"/>
      <ContentSelectWrapper>
        <ContentSelect 
          className={selectedTab === "chat" ? "active" : ""}
          onClick={() => setSelectedTab("chat")}
        >
          챗봇
        </ContentSelect>
        <Divider>|</Divider>
        <ContentSelect 
          className={selectedTab === "diary" ? "active" : ""}
          onClick={() => setSelectedTab("diary")}
        >
          일기
        </ContentSelect>
      </ContentSelectWrapper>

      {/* 탭에 따라 다른 콘텐츠 표시 */}
      <CenterViewport>
              {selectedTab === "chat" && (
        <ChatContent
          addImage={add}
          initialItems={[
            {
              title: "행복하다!!",
              date: "2025 - 09 - 28",
              sentimentLabel: "CLASS : 분노",
              rightHeader: "",
              sentimentImage: angry,   // ← 이미지 전달
            },{
              title: "행복하다!!",
              date: "2025 - 09 - 28",
              sentimentLabel: "CLASS : 분노",
              rightHeader: "",
              sentimentImage: angry,   // ← 이미지 전달
            },{
              title: "행복하다!!",
              date: "2025 - 09 - 28",
              sentimentLabel: "CLASS : 분노",
              rightHeader: "",
              sentimentImage: angry,   // ← 이미지 전달
            },{
              title: "행복하다!!",
              date: "2025 - 09 - 28",
              sentimentLabel: "CLASS : 분노",
              rightHeader: "",
              sentimentImage: angry,   // ← 이미지 전달
            },{
              title: "행복하다!!",
              date: "2025 - 09 - 28",
              sentimentLabel: "CLASS : 분노",
              rightHeader: "",
              sentimentImage: angry,   // ← 이미지 전달
            },{
              title: "행복하다!!",
              date: "2025 - 09 - 28",
              sentimentLabel: "CLASS : 분노",
              rightHeader: "",
              sentimentImage: angry,   // ← 이미지 전달
            }
          ]}
        />
      )}

      {selectedTab === "diary" && (
        <DiaryContent
          addImage={add}
          pastImage={angry}
          onClickDay={(date) => console.log("clicked:", date)}
        />
      )}
      </CenterViewport>

      <Header/>

      {openCharacter && (
        <Character
          onClose={() => setOpenCharacter(false)}
          onSelect={handleSelect}
        />
      )}
    </Wrapper>
  );
}
