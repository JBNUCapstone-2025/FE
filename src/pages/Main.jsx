// src/pages/Main.jsx
import React,{useState, useEffect} from "react";
import styled from "styled-components";
import Header from "../components/Header";
import Character from "../components/Character";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;    /* 세로 레이아웃 */
  min-height: 100vh;
  max-width: 500px;
  margin: 0 auto;
  box-shadow: 0 0 10px rgba(0,0,0,0.15);
  border-radius: 15px;
`;

// 선택 상태를 보여주고 싶을 때 사용(옵션)
const SelectedBar = styled.div`
  padding: 12px 16px;
  font-weight: 600;
`;

export default function Main(){
  // 이미 선택한 캐릭터가 있으면 팝업 안 띄우도록
  const [character, setCharacter] = useState(() => localStorage.getItem("character") || null);
  const [openCharacter, setOpenCharacter] = useState(() => !localStorage.getItem("character"));

  useEffect(() => {
    if (openCharacter) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [openCharacter]);

  // ⬇️ Character에서 넘어온 선택값을 받는 곳
  const handleSelect = (id) => {
    setCharacter(id);
    localStorage.setItem("character", id);
    setOpenCharacter(false);        // 선택 후 팝업 닫기
  };

  return(
    <Wrapper>
      <Header/>

      {openCharacter && (
        <Character
          onClose={() => setOpenCharacter(false)}
          onSelect={handleSelect}     // ⬅️ 부모로 선택값 받기
        />
      )}
    </Wrapper>
  );
}
