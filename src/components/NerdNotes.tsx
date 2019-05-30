import React, {useState} from 'react'
import { Query } from 'react-apollo';
import GetNotesByLabel from '../gql/GetNotesByLabel';
import HeartIcon from '@material-ui/icons/FavoriteBorder';
import CodeIcon from '@material-ui/icons/Link';
import ReactMarkdown from 'react-markdown';
import { Grid, Typography, Card, CardContent, CardActions, Badge, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import isMobile from '../utils/mobileCheck';

interface props {
    label: string
}

const NerdNotes = (props: props) => {


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
            targetID.style.display="none";
        }
    }

    const mouseDownHandler = (mouseDownEvent :any) => {
        setXStart(mouseDownEvent.clientX)
    }
    const mouseUpHandler = (mouseUpEvent :any) => {
        const xDiff = (mouseUpEvent.clientX - xStart)
        if (Math.abs(xDiff) > swipeThreshold) {
            const target = mouseUpEvent.target || mouseUpEvent.srcElement;
            const targetID = target.closest(".MuiGrid-item");
            targetID.style.display="none";
        }
    }

    return <Query<any> query={GetNotesByLabel({label: props.label})}>
        {
            ({loading, error, data})=>{
                console.log(data)
                if (data.repository){
                    return <Grid container>
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
                            data.repository.issues.nodes.map( (node: any) => 
                                <Grid item xs={12} md={6} key={node.id}>
                                    <Card style={{margin: 5}} onMouseDown={mouseDownHandler} onMouseUp={mouseUpHandler} onTouchStart={touchStartHandler} onTouchEnd={touchEndHandler}>
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
                                                    <Badge>
                                                        <CodeIcon style={{
                                                            cursor: "pointer",
                                                            fontSize: 30
                                                        }} onClick={()=>window.location.assign(`https://github.com/${node.resourcePath}`)}/>
                                                    </Badge>
                                                </span>
                                                <span>
                                                    <Badge badgeContent={node.reactions.totalCount} color="secondary">
                                                        <HeartIcon style={{fontSize: 30}}/>
                                                    </Badge>
                                                </span>                                                
                                            </div>                                            
                                        </CardActions>
                                    </Card>
                                </Grid> 
                            )
                        }
                        <Grid key={props.label} xs={2} style={{height: "auto"}}>
                            <Button variant="contained" color="primary">
                                <Link to="/" style={{textDecoration: "none", color: "white"}}>
                                    {`<< Back`}
                                </Link>
                            </Button>
                        </Grid>
                    </Grid>
                } else {
                    return <div>Loading...</div>
                }                
            }
        }
    </Query>

}

export default NerdNotes