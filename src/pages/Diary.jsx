// src/pages/Diary.jsx
import React,{useState} from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import logo from "../logo/logo.png";
import colors from "../styles/colors";
import { FaAngleLeft } from "react-icons/fa";
import { FaRegBell } from "react-icons/fa";

import add from "../icon/add.png";
import ClassModal from "../components/ClassModal"; // ✅ 방금 만든 모달 컴포넌트

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

const Container = styled.div`
  display: flex;
  justify-content: space-around;
  border-bottom: 1px solid ${colors.text};
  line-height: 0px;
  padding: 30px 0;

  &.info{
    border: none;
    padding: 10px 0;
    align-items: center;
    gap: 12px;
  }
  &.class{
    justify-content: space-evenly;
    border: none;
    padding: 10px 0;
    align-items: center;
    gap: 6px;
    cursor: pointer;
  }
`;

const Header = styled.img`
  width: calc(30%);
`;

const TopLeft = styled(FaAngleLeft)`
  width: 20px;
  height: auto;
  color: ${colors.text};
  cursor: pointer;
  &:hover { color: ${colors.hover}; }
`;

const TopRight = styled(FaRegBell)`
  width: 20px;
  height: auto;
  color: ${colors.text};
  cursor: pointer;
  &:hover { color: ${colors.hover}; }
`;

const Text = styled.p`
  font-size: 15px;
  margin: 0;
  line-height: 1.2;
`;

const ClassThumb = styled.img`
  width: 30px;
  height: 30px;
  object-fit: contain;
  display: block;
`;

const MoodUnder = styled.span`
  font-size: 12px;
  color: ${colors.text};
`;

export default function Diary(){
  const navigate = useNavigate();

  // 날짜 표기
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const dateString = `${year}-${month}-${day}`;

  // 선택된 클래스(이미지+라벨)
  const [selectedClass, setSelectedClass] = useState(null); 
  // { key, label, src }

  // 모달 오픈 상태
  const [open, setOpen] = useState(false);

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  const handleSelect = (item) => {
    setSelectedClass(item);
    closeModal();
  };

  return(
    <Wrapper>
      <Container>
        <TopLeft onClick={() => navigate("/main")}/>
        <Header src={logo} alt="logo"/>
        <TopRight/>
      </Container>

      <Container className="info">
        <Text>{dateString}</Text>

        {/* class 영역 - 클릭 시 모달 */}
        <Container className="class" onClick={openModal} title="클래스 선택">
          <Text>class :</Text>
          <div style={{display:"flex", flexDirection:"column", alignItems:"center", gap:4}}>
            <ClassThumb src={selectedClass?.src || add} alt="class" />
          </div>
        </Container>
      </Container>

      {/* 모달 렌더링 */}
      {open && (
        <ClassModal
          onSelect={handleSelect}
          onClose={closeModal}
        />
      )}
    </Wrapper>
  )
};
