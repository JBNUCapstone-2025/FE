import React from "react";
import {Route, Routes} from 'react-router-dom'

import Main from '../pages/Main';
import Chat from '../pages/Chat';
import Test from '../pages/Test';

// test
import Character from '../components/Character';

const AppRoutes = () => {
    return(
        <Routes>
            <Route path = "/" element = {<Main/>}/>
            <Route path = "/test" element = {<Test/>}/>
            <Route path = "/character" element = {<Character/>}/>

            <Route path = "/chat" element = {<Chat apiBase="http://127.0.0.1:8000"/>}/>
        </Routes>
    );
};

export default AppRoutes;