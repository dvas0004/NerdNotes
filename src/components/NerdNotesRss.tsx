import React, {useState, useEffect} from 'react'
import HeartIcon from '@material-ui/icons/FavoriteBorder';
import CodeIcon from '@material-ui/icons/Link';
import { Grid, Typography, Card, CardContent, CardActions, Badge, Button, Fab, Chip } from '@material-ui/core';
import { Link } from 'react-router-dom';
import isMobile from '../utils/mobileCheck';
import animateCSS from '../utils/animations';
import Parser from 'rss-parser';
import Axios from 'axios';
import ReactHtmlParser from 'react-html-parser';
//@ts-ignore

import NerdNotesFab from './NerdNotesFab';

interface props {
    label: string
}

function htmlDecode(input: string) : string|null {
    var e = document.createElement('textarea');
    e.innerHTML = input;
    // handle case of empty input
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
  }

  
const parser = new Parser()   

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



const GithubToRss = (label: string) : string[] => {
    // Deprecating the below - unfortunately we cannot access GOOGLE ALERTS RSS directly since
    // they restrict access via origin. Instead we found a service that unifies a bunch of feeds
    // and allows access

    // TODO: seperate the unified feeds and re-introduce th below?
    // const mappings: {[label: string] : [string]} = {
    //     InfoSec: ["17077260672311818736/17578478168077360942"],
    //     Java_and_Spring: ["Java"],
    //     JavaScript: ["Javascript"],
    //     SQL: ["SQL"]
    // }

    // return mappings[label];

    return ['https://zapier.com/engine/rss/1676320/feed-1/', 'https://zapier.com/engine/rss/1676320/feed-2/']
}

const NerdNotesRss = (props: props) => {

    const defaultData : Parser.Item[] = []
    const [data, changeData] = useState(defaultData);

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

    useEffect(() => {
        const fetchRequests = GithubToRss(props.label).map(rssUrl => Axios.get(rssUrl))
        let rssEntries : Parser.Item[] = []
        Axios.all(fetchRequests).then(responses => responses.map( async(resp) => {
            const rssData = resp.data
            const rssJson = await parser.parseString(rssData)
            const rssItems = rssJson.items!
            return rssItems
        }).forEach( elem => elem.then( results => {
            rssEntries = rssEntries.concat(results)
            changeData(rssEntries)
        }))
    )},[])


    let view = <div>Loading...</div>;
    if (data != null){
        view = <Grid container>
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
                data.filter( (node: Parser.Item) => showSwipedNotes ? true : !( swipedNotes.has(node.link!) ) ).map( (node: Parser.Item) => 
                    <Grid item xs={12} md={6} key={node.guid!} id={node.link!}>
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
                                    {ReactHtmlParser(htmlDecode(node.content!)!)}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <div style={{marginLeft:"auto", marginRight: 20}}>
                                    <span>
                                        <Badge>
                                            <CodeIcon style={{
                                                cursor: "pointer",
                                                fontSize: 30
                                            }} onClick={()=>window.location.assign(node.link!)}/>
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
{/*                 
                
                {data.data.after ? <Button variant="contained" 
                    color="primary" 
                    style={{marginLeft: 5}}
                    onClick={()=> {
                        changeCursor({
                            start: cursor.after,
                            after: data.data.after
                        });
                    }}>
                        {`Next >>`}
                </Button>: null} */}
                <NerdNotesFab toggleShowSwipedNotes={toggleShowSwipedNotes} type="news" />
            </Grid>
        </Grid>
    }

    return view

}

export default NerdNotesRss