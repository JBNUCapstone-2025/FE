import React from "react";
import styled from "styled-components";
import colors from "../styles/colors";
import { useNavigate } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { IoChatbubblesSharp } from "react-icons/io5";
import { FaCalendarAlt } from "react-icons/fa";

// Header 영역
const Container = styled.header`
  width: 100%;
  background: ${colors.header};
  height: 50px;
  margin-top: auto;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`;


const Icon = styled.div`
  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto 0;
  svg {
    width: 100%;
    height: 100%;
  }
`;

const Header = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Icon onClick={() => navigate("/chat")}><IoChatbubblesSharp /></Icon>
      <Icon><FaCalendarAlt/></Icon>
      <Icon><FaRegUser /></Icon>
      <Icon><FaShoppingCart /></Icon>
    </Container>
  );
};

export default Header;
