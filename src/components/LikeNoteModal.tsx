import { Typography, Dialog, Button } from "@material-ui/core";
import React, { useState, useEffect } from "react";

interface props {
    isOpen: boolean,
    handleClose: Function,
    modalNoteID: string
}

const LikeNoteModal = (props: props) => {

    const [open, changeOpen] = useState(props.isOpen);

    useEffect(()=>{ 
        changeOpen(props.isOpen) 
        console.log("use effect fired")
    },[props.isOpen]);

    const handleClose = () => {
        props.handleClose();
    }

    return <Dialog
        open={open}
        onClose={handleClose}       
        fullWidth={true} 
    >
        <div style={{
            padding: 25
        }}>
            <Typography variant="subtitle1" id="simple-modal-description">
                To like a note, react with a heart (❤️) in Github!
            </Typography>
            <img src="./img/heart_react.gif" style={{
                margin: 5,
                width: "100%"
            }}/>
            <Button variant="contained" color="primary" onClick={()=>window.location.assign(`https://github.com/${props.modalNoteID}`)}>
                Like On Github >>
            </Button>
        </div>
    </Dialog>

}

export default LikeNoteModal;