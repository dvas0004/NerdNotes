import React, {useState, Fragment, useLayoutEffect, useEffect, useRef} from 'react'
import GetNotesByLabel from '../gql/GetNotesByLabel';
import HeartIcon from '@material-ui/icons/FavoriteBorder';
import CodeIcon from '@material-ui/icons/Link';
import ReactMarkdown from 'react-markdown';
import { Grid, Typography, Card, CardContent, CardActions, Badge, Button, Chip } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import isMobile from '../utils/mobileCheck';
import animateCSS from '../utils/animations';
import LikeNoteModal from './LikeNoteModal';
//@ts-ignore
import hljs from 'highlightjs';
import NerdNotesFab from './NerdNotesFab';

interface props {
    label: string
}

const saveSwiped = (value: Set<String>) => {
    const swipedArray = Array.from(value);
    localStorage.setItem('swiped', JSON.stringify(swipedArray));
}

const saveShowSwiped = (value: Boolean) => {
    localStorage.setItem('showSwiped', JSON.stringify(value));
}

const getShowSwiped = () => {
    
    const prevSetting = localStorage.getItem('showSwiped');
    if (prevSetting != null){
        return JSON.parse( prevSetting )
    } 
    
}

const isScrollable: Function = (target: string) => {
    const clientWidth: Number = document.getElementById(target)!.querySelector(".MuiPaper-root")!.clientWidth;
    const scrollWidth: Number = document.getElementById(target)!.querySelector(".MuiPaper-root")!.scrollWidth;

    if (scrollWidth > clientWidth){
        return true;
    }

    return false;
}

const NerdNotes = (props: props) => {

    const [cursor, changeCursor] = useState({
        start: undefined,
        after: undefined
    });

    let swiped : Set<String> = new Set([]);
    if (localStorage.getItem('swiped') != null){
        const previouslySwiped = localStorage.getItem('swiped') as string;
        swiped = new Set(JSON.parse(previouslySwiped));
    }

    const [swipedNotes, changeSwipedNotes] = useState(swiped);
    const [showSwipedNotes, changeShowSwipedNotes] = useState(getShowSwiped());
    const toggleShowSwipedNotes = () => {
        saveShowSwiped(!showSwipedNotes);
        changeShowSwipedNotes(!showSwipedNotes);
    };
       

    const [likeNoteModalOpen, changeLikeNoteModalOpen] = useState(false);
    const [modalNoteID, changeModalNoteID] = useState("");

    const openLikeNoteModal = (modalNoteID: string) => {
        changeModalNoteID(modalNoteID);
        changeLikeNoteModalOpen(true);
    };

    const closeLikeNoteModal = () => {
        changeLikeNoteModalOpen(false);
    }

    const [xStart, setXStart] = useState(0)
    const swipeThreshold = 100

    const touchStartHandler = (touchStartEvent :any ) => {
        setXStart(touchStartEvent.touches[0].clientX)
    }
    const touchEndHandler = (touchEndEvent :any) => {
        const xDiff = (touchEndEvent.changedTouches[0].clientX - xStart)
        if (Math.abs(xDiff) > swipeThreshold) {
            const target = touchEndEvent.target || touchEndEvent.srcElement;
            const targetID = target.closest(".MuiGrid-item");
            let animation = '';
            if (xDiff < 0){
                animation = 'bounceOutLeft'
            } else {
                animation = 'bounceOutRight'
            }
            animateCSS(targetID, animation, function() {
                // Do after animation
                targetID.style.display="none";
                swipedNotes.add(targetID.id);
                changeSwipedNotes(swipedNotes);
                saveSwiped(swipedNotes)
              })
        }
    }

    const mouseDownHandler = (mouseDownEvent :any) => {
        setXStart(mouseDownEvent.clientX)
    }
    const mouseUpHandler = (mouseUpEvent :any) => {
        const xDiff = (mouseUpEvent.clientX - xStart)
        if (Math.abs(xDiff) > swipeThreshold) {
            console.log("swipe detected");
            const target = mouseUpEvent.target || mouseUpEvent.srcElement;
            const targetID = target.closest(".MuiGrid-item");
            let animation = '';
            if (xDiff < 0){
                animation = 'bounceOutLeft'
            } else {
                animation = 'bounceOutRight'
            }
            animateCSS(targetID, animation, function() {
                // Do after animation
                targetID.style.display="none";
                swipedNotes.add(targetID.id);
                changeSwipedNotes(swipedNotes);
                saveSwiped(swipedNotes)
              })
        }
    }

    const { data } = useQuery(GetNotesByLabel({label: props.label, after: cursor.after}));
    let view = <div />;

    const viewRef = useRef(null);

    if (data.repository){
                    
        view = <Grid container ref={viewRef}>
            <Grid item key={props.label} xs={12} style={{height: "auto", padding: 10}}>
                <Card>
                    <CardContent>
                        <Typography variant="h4">
                            {props.label}
                        </Typography>
                        { isMobile() ? 
                            <Typography variant="subtitle2">
                                HINT: swipe left or right to dismiss cards
                            </Typography>
                        :
                            null
                        }
                    </CardContent>
                </Card>
            </Grid>
            {
                data.repository.issues.nodes.filter( (node: any) => showSwipedNotes ? true : !( swipedNotes.has(node.id) ) ).map( (node: any) => 
                    <Grid item xs={12} md={12} key={node.id} id={node.id}>
                        <Card   style={{
                                    margin: 5,
                                    overflowX: "auto"
                                }} 
                                onMouseDown={mouseDownHandler} 
                                onMouseUp={mouseUpHandler} 
                                // onTouchStart={(e) => isScrollable(node.id) ? null : touchStartHandler(e)} 
                                // onTouchEnd={(e) => isScrollable(node.id) ? null : touchEndHandler(e)}
                                onTouchStart={(e) => touchStartHandler(e)} 
                                onTouchEnd={(e) => touchEndHandler(e)}
                        >
                        <CardContent>
                                <Typography variant="overline" style={{fontSize: 20}}>
                                    {node.title} 
                                </Typography>
                                <Typography variant="body1">
                                    <ReactMarkdown source={node.body} /> 
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <div style={{marginLeft:"auto", marginRight: 20}}>
                                    <span>
                                        { node.labels.nodes.map ((label :any) => 
                                            <Chip
                                                // avatar={<Avatar>MB</Avatar>}
                                                label={label.name}
                                                style={{margin: 1}}
                                            />
                                        )}                                                    
                                    </span>
                                    <span>
                                        <Badge>
                                            <CodeIcon style={{
                                                cursor: "pointer",
                                                fontSize: 30
                                            }} onClick={()=>window.location.assign(`https://github.com/${node.resourcePath}`)}/>
                                        </Badge>
                                    </span>
                                    <span>
                                        <Badge badgeContent={node.reactions.totalCount} color="secondary">
                                            <HeartIcon style={{fontSize: 30}} onClick={() => openLikeNoteModal(node.resourcePath)}/>
                                        </Badge>
                                    </span>                                                
                                </div>                                            
                            </CardActions>
                        </Card>
                    </Grid> 
                )
            }
            <Grid item key={props.label} xs={12} style={{height: "auto"}}>
                <Button variant="contained" color="primary">
                    <Link to="/" style={{textDecoration: "none", color: "white"}}>
                        Home
                    </Link>
                </Button>
            
                {cursor.after ? 
                    <Button variant="contained" 
                        color="primary" 
                        style={{marginLeft: 5}}
                        onClick={()=>changeCursor({
                                start: undefined,
                                after: cursor.start
                        })}>
                        {`<< Back`}
                    </Button>
                :
                    null
                }
                
                
                {data.repository.issues.pageInfo.hasNextPage ? <Button variant="contained" 
                    color="primary" 
                    style={{marginLeft: 5}}
                    onClick={()=> {
                        changeCursor({
                            start: cursor.after,
                            after: data.repository.issues.pageInfo.endCursor
                        });
                    }}>
                        {`Next >>`}
                </Button>: null}
                <LikeNoteModal isOpen={likeNoteModalOpen} handleClose={closeLikeNoteModal} modalNoteID={modalNoteID}/>
                <NerdNotesFab toggleShowSwipedNotes={toggleShowSwipedNotes} type="github" />
            </Grid>
        </Grid>
    } else {
        view = <div>Loading...</div>
    }   


    useEffect(()=>{
        if (viewRef.current !== null){
            console.log("hljs fired");
            (viewRef.current! as Element).querySelectorAll('pre code').forEach((block) => {
                hljs.highlightBlock(block);
                block.addEventListener('mousedown', e=> e.stopPropagation())
                block.addEventListener('mouseup', e=> e.stopPropagation())
                block.addEventListener('touchstart', e=> e.stopPropagation())
                block.addEventListener('touchend', e=> e.stopPropagation())
            });
        }
        window.scrollTo(0, 0);
    }, [props.label, cursor.after, data]);

    return <Fragment>
        {
            view
        }
    </Fragment>

}

export default NerdNotes