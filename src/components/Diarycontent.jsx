// src/components/Diarycontent.jsx
import React, { useMemo, useState, useEffect } from "react";
import styled from "styled-components";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

/* ─────────── 스타일 ─────────── */
const Wrap = styled.div`
  padding-inline: 12px;
  padding-bottom: 14px;
  border-top: 1px solid rgba(0,0,0,0.08);
`;

const Header = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 8px;
  padding-top: 12px;
  padding-bottom: 6px;
`;

const MonthLabel = styled.div`
  justify-self: start;
  font-weight: 700;
  color: #7f9db9;
  letter-spacing: .2px;
  font-size: 18px;
`;

const Nav = styled.div`
  justify-self: end;
  display: flex;
  align-items: center;
  gap: 8px;

  button{
    appearance: none;
    border: none;
    background: transparent;
    cursor: pointer;
    width: 28px;
    height: 28px;
    display: grid;
    place-items: center;
    line-height: 0;
    padding: 0;
    color: #7f9db9;
    border-radius: 8px;
  }
  button:active { transform: translateY(1px); }

  button svg{
    width: 18px; height: 18px; display: block;
  }
`;

const Weekdays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-top: 4px;
  color: #a9b7c7;
  font-size: 12px;
`;

const W = styled.div`
  text-align: center;
  padding: 6px 0 4px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  row-gap: 8px;
  padding-top: 2px;
`;

const DayCell = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  justify-items: center;
  align-items: start;
  height: 58px;
`;

const DayNum = styled.div`
  font-size: 13px;
  color: ${({ dim }) => (dim ? "transparent" : "#2F3B4A")};
  height: 18px;
`;

/* 회색 기본 알약 (미래 날짜용) */
const Pill = styled.div`
  width: 36px;
  height: 46px;
  border-radius: 12px;
  background: linear-gradient(#f6f7fb, #eef2f7);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.7),
    0 1px 2px rgba(0,0,0,.08),
    0 6px 12px rgba(0,0,0,.08);
  display: grid;
  place-items: center;
  opacity: .6;
`;

/* 이미지로 칸을 꽉 채우는 컴포넌트(오늘/과거) */
const FillImg = styled.img`
  width: 36px;
  height: 46px;
  display: block;
  object-fit: cover;    /* 비율 유지하며 꽉 채우기 */
  border-radius: 12px;  /* Pill과 동일 라운드 */
  /* 배경 없이 이미지 단독으로 보이게: 별도 배경/그림자 없음 */
  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};
`;

/* ─────────── 유틸 ─────────── */
function buildMonthMatrix(year, monthIndex /* 0~11 */) {
  const first = new Date(year, monthIndex, 1);
  const last = new Date(year, monthIndex + 1, 0);
  const daysInMonth = last.getDate();

  const jsFirstDow = first.getDay();         // Sun=0 .. Sat=6
  const monStartOffset = (jsFirstDow + 6) % 7; // Mon=0 .. Sun=6

  const cells = [];
  for (let i = 0; i < monStartOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return { cells, daysInMonth };
}

/* 날짜 비교: y/m/d가 오늘 이전인가? */
function isBefore(y, mIdx, d, ty, tmIdx, td) {
  if (y < ty) return true;
  if (y > ty) return false;
  if (mIdx < tmIdx) return true;
  if (mIdx > tmIdx) return false;
  return d < td;
}

/**
 * props:
 * - addImage: 오늘 칸에 표시할 이미지 (예: add.png)
 * - pastImage: 과거 칸에 표시할 이미지 (예: angry.png)
 */
export default function DiaryContent({
  year,
  month,           // 1~12
  addImage,
  pastImage,
  onPrevMonth,
  onNextMonth,
  onClickDay,
}) {
  const navigate = useNavigate();

  const sysToday = new Date();
  const todayY = sysToday.getFullYear();
  const todayM = sysToday.getMonth();   // 0~11
  const todayD = sysToday.getDate();

  const initYear = year ?? todayY;
  const initMonthIdx = (month ? month - 1 : todayM);

  const [curYear, setCurYear] = useState(initYear);
  const [curMonth, setCurMonth] = useState(initMonthIdx);

  useEffect(() => {
    if (year) setCurYear(year);
    if (month) setCurMonth(month - 1);
  }, [year, month]);

  const { cells } = useMemo(
    () => buildMonthMatrix(curYear, curMonth),
    [curYear, curMonth]
  );

  const label = `${curYear}년 ${curMonth + 1}월`;

  const goPrev = () => {
    let y = curYear, m = curMonth - 1;
    if (m < 0) { m = 11; y -= 1; }
    setCurYear(y); setCurMonth(m);
    onPrevMonth && onPrevMonth(y, m + 1);
  };

  const goNext = () => {
    let y = curYear, m = curMonth + 1;
    if (m > 11) { m = 0; y += 1; }
    setCurYear(y); setCurMonth(m);
    onNextMonth && onNextMonth(y, m + 1);
  };

  const isTodayCell = (d) =>
    d != null && curYear === todayY && curMonth === todayM && d === todayD;

  const isPastCell = (d) =>
    d != null && isBefore(curYear, curMonth, d, todayY, todayM, todayD);

  const handleTodayClick = (d) => {
    const dateObj = new Date(curYear, curMonth, d);
    onClickDay && onClickDay(dateObj);
    navigate("/diary");
  };

  return (
    <Wrap>
      <Header>
        <MonthLabel>{label}</MonthLabel>
        <div />
        <Nav>
          <button onClick={goPrev} aria-label="prev"><FaAngleLeft/></button>
          <button onClick={goNext} aria-label="next"><FaAngleRight/></button>
        </Nav>
      </Header>

      <Weekdays>
        {["월","화","수","목","금","토","일"].map((w) => (
          <W key={w}>{w}</W>
        ))}
      </Weekdays>

      <Grid>
        {cells.map((d, i) => {
          const blank = d == null;
          if (blank) {
            return (
              <DayCell key={i}>
                <DayNum dim>{'•'}</DayNum>
                <Pill />
              </DayCell>
            );
          }

          const today = isTodayCell(d);
          const past = isPastCell(d);

          return (
            <DayCell key={i}>
              <DayNum dim={false}>{d}</DayNum>

              {today && addImage ? (
                <FillImg
                  src={addImage}
                  alt="today-add"
                  $clickable
                  onClick={() => handleTodayClick(d)}
                />
              ) : past && pastImage ? (
                <FillImg
                  src={pastImage}
                  alt="past"
                  $clickable={false}
                />
              ) : (
                /* 미래 날짜: 회색 Pill (이미지/배경 없이) */
                <Pill />
              )}
            </DayCell>
          );
        })}
      </Grid>
    </Wrap>
  );
}
