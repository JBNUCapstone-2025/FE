// src/components/Character.jsx
import React, { useState } from "react";
import styled from "styled-components";
import dog from "../img/character/dog.png";
import cat from "../img/character/cat.png";
import brakio from "../img/character/brakio.png";
import ssen from "../img/character/ssen.png";
import sheep from "../img/character/sheep.png";
import boy from "../img/character/boy.png";

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Dialog = styled.div`
  width: 90%;
  max-width: 420px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.25);
  overflow: hidden;
`;

const Header = styled.div`
  padding: 16px 20px;
  font-weight: 700;
  border-bottom: 1px solid #eee;
  text-align: center;
  font-size: 20px;
`;

const Body = styled.div`
  padding: 20px;
`;

const AvatarList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  justify-items: center;
`;

const AvatarButton = styled.button`
  background: none;
  border: 0;
  padding: 0;
  cursor: pointer;
  border-radius: 50%;
  outline: none;
  appearance: none;
  -webkit-tap-highlight-color: transparent;

  &:focus { outline: none; }
  &:focus:not(:focus-visible) { outline: none; }

  &:focus-visible img {
    box-shadow: 0 0 0 3px rgba(46, 204, 113, 0.65);
    border-radius: 50%;
  }

  &:hover img {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.15);
  }
`;

const Avatar = styled.img`
  width: 80px;
  height: 80px;
  display: block;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid ${({ $active }) => ($active ? "#bbb" : "#eee")};
  filter: ${({ $active }) => ($active ? "grayscale(100%)" : "none")};
  opacity: ${({ $active }) => ($active ? 0.6 : 1)};
  transition: transform .15s ease, box-shadow .15s ease, filter .15s ease, opacity .15s ease, border-color .15s ease;
`;

const Footer = styled.div`
  padding: 12px 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const Button = styled.button`
  padding: 8px 12px;
  border-radius: 8px;
  border: 0;
  cursor: pointer;
  font-weight: 600;
  transition: opacity .15s ease, transform .05s ease;
  &:active { transform: translateY(1px); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const SecondaryButton = styled(Button)`
  background: #e9ecef;
  color: #333;
`;

const PrimaryButton = styled(Button)`
  background: #2ecc71;
  color: #fff;
`;

export default function Character({ onClose, onSelect }) {
  const [selected, setSelected] = useState(null);

  const avatars = [
    { id: "dog",    src: dog,    alt: "강아지 캐릭터" },
    { id: "cat",    src: cat,    alt: "고양이 캐릭터" },
    { id: "sheep",  src: sheep,  alt: "양 캐릭터" },
    { id: "brakio", src: brakio, alt: "브라키오 캐릭터" },
    { id: "ssen",   src: ssen,   alt: "쎈언니 캐릭터" },
    { id: "boy",    src: boy,    alt: "테토남 캐릭터" },
  ];

  const handleSelect = (id) => {
    setSelected(prev => (prev === id ? null : id)); // 토글
  };

  const handleConfirm = () => {
    if (!selected) return;
    // 부모에게 선택값 전달 (없으면 무시)
    onSelect?.(selected);
    onClose?.();
  };

  return (
    <Backdrop onClick={onClose}>
      <Dialog onClick={(e) => e.stopPropagation()}>
        <Header>캐릭터 선택</Header>
        <Body>
          <AvatarList>
            {avatars.map(a => (
              <AvatarButton key={a.id} onClick={() => handleSelect(a.id)} aria-label={a.alt}>
                <Avatar src={a.src} alt={a.alt} $active={selected === a.id} />
              </AvatarButton>
            ))}
          </AvatarList>
        </Body>
        <Footer>
          <SecondaryButton onClick={onClose}>닫기</SecondaryButton>
          <PrimaryButton onClick={handleConfirm} disabled={!selected}>
            선택
          </PrimaryButton>
        </Footer>
      </Dialog>
    </Backdrop>
  );
}
