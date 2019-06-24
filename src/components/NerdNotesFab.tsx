import React, { Fragment, useState, useContext } from "react";
import SettingsIcon from '@material-ui/icons/Settings';
import AllNotesIcon from '@material-ui/icons/Inbox';
import { Fab } from '@material-ui/core';
import { ReactComponent as RedditIcon } from './custom_icons/reddit.svg';
import { ReactComponent as GithubIcon } from './custom_icons/github.svg';
import NoteTypeContext from "../contexts/NoteTypeContext";
interface props {
    toggleShowSwipedNotes: any, 
    type: String
}

const NerdNotesFab = (props: props) => {

    const [showFABOptions, changeShowFABOptions] = useState(false);
    const toggleShowFABOptions = () => changeShowFABOptions(!showFABOptions);
    const noteTypeContext = useContext(NoteTypeContext);

    return <Fragment>
        <Fab color="primary" onClick={toggleShowFABOptions} style={{
            position: "fixed",
            bottom: 20,
            right: 20
        }}>
            <SettingsIcon />
        </Fab>
        { showFABOptions ? 
            <Fragment>
                { props.type == "reddit" ? 
                    <Fab variant="extended" color="primary" size="small" onClick={()=> noteTypeContext.changeNoteType("github")} style={{
                        position: "fixed",
                        bottom: 130,
                        right: 20
                    }}>
                        
                        <GithubIcon style={{marginRight: 5, fill: 'white'}}/>
                        Switch to GitHub

                    </Fab>
                    : 
                    <Fab variant="extended" color="primary" size="small" onClick={()=> noteTypeContext.changeNoteType("reddit")} style={{
                        position: "fixed",
                        bottom: 130,
                        right: 20
                    }}>
                        
                        <RedditIcon style={{marginRight: 5, fill: 'white'}}/>
                        Switch to Reddit
                    
                    </Fab>
                    }
                <Fab variant="extended" color="primary" size="small" onClick={props.toggleShowSwipedNotes} style={{
                    position: "fixed",
                    bottom: 86,
                    right: 20
                }}>
                    <AllNotesIcon style={{marginRight: 5}} />
                    Toggle swiped notes
                </Fab>
            </Fragment>                                
            : null 
        }
    </Fragment>
}

export default NerdNotesFab