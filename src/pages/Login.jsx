import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import colors from "../styles/colors";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  max-width: 500px;
  margin: 0 auto;
  box-shadow: 0 0 10px rgba(0,0,0,0.15);
  border-radius: 15px;
`;

const Container = styled.div`
  width: 90%;
  min-height: 400px;
  box-shadow: 0 0 10px rgba(0,0,0,0.15);
  border-radius: 15px;
  margin: auto auto;
  display: flex;
  flex-direction: column;
`;

const Title = styled.p`
  font-size: 30px;
  text-align: center;
`;

const Input = styled.input`
  width: 80%;
  height: 50px;
  margin: 10px auto;
  border-radius: 15px;
  padding-left: 20px;
  color: black;
  border: none;
  background-color: white;
  box-shadow: 0 0 10px rgba(0,0,0,0.15);
`;

const Util = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin: auto 0;
`;

const Link = styled.p`
  padding: 0 15px;
  font-size: 13px;
  cursor: pointer;
`;

const Button = styled.button`
  margin: auto auto;
  padding: 12px 20px;
  border-radius: 10px;
  border: none;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background: ${({ disabled }) => (disabled ? "#ccc" : colors.button)};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
`;

export default function Login() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const isDisabled = id.trim() === "" || password.trim() === "";

  const handleLogin = () => {
    if (!isDisabled) {
      // 여기에 실제 로그인 로직(API 호출 등) 넣을 수 있음
      navigate("/main"); // 로그인 성공 시 홈('/')으로 이동
    }
  };

  return (
    <Wrapper>
      <Container>
        <Title>너감보</Title>
        <Input
          className="id"
          placeholder="아이디"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <Input
          className="password"
          placeholder="비밀번호"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Util>
          <Link>회원가입</Link>
          <Link>아이디 찾기</Link>
          <Link>비밀번호 찾기</Link>
        </Util>
        <Button disabled={isDisabled} onClick={handleLogin}>
          로그인
        </Button>
      </Container>
    </Wrapper>
  );
}
