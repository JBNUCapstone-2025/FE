import React from "react";
import {Route, Routes} from 'react-router-dom'

import Main from '../pages/Main';
import Character from '../components/Character';
import Chat from '../pages/Chat';

const AppRoutes = () => {
    return(
        <Routes>
            <Route path = "/" element = {<Main/>}/>
            <Route path = "/test" element = {<Character/>}/>
            <Route path = "/chat" element = {<Chat apiBase="http://127.0.0.1:8000"/>}/>
        </Routes>
    );
};

export default AppRoutes;