import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Main from "../pages/Main";
import Chat from "../pages/Chat";
// import Test from "../pages/Test";
import Login from "../pages/Login";
import Diary from "../pages/Diary";

const AppRoutes = () => {
  return (
    <Routes>
      {/* "/"로 접근하면 자동으로 "/login"으로 이동 */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />
      <Route path="/main" element={<Main />} />
      <Route path="/diary" element={<Diary />} />
      <Route path="/chat" element={<Chat apiBase="http://127.0.0.1:8000" />} />
      {/* <Route path="/test" element={<Test />} /> */}

      {/* 잘못된 경로는 로그인으로 */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
