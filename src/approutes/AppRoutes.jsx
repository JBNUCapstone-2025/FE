import React from "react";
import {Route, Routes} from 'react-router-dom'

import Main from '../pages/Main';
import Character from '../components/Character';

const AppRoutes = () => {
    return(
        <Routes>
            <Route path = "/" element = {<Main/>}/>
            <Route path = "/test" element = {<Character/>}/>
        </Routes>
    );
};

export default AppRoutes;