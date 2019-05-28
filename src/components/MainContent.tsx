import React from 'react'
import NerdNotesContainer from './NerdNotesContainer';
import { BrowserRouter as Router} from "react-router-dom";

const MainContent = () => {
    return <Router>
        <NerdNotesContainer />
    </Router>    
}

export default MainContent