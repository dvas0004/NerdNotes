import React from 'react'
import { Query } from 'react-apollo';
import GetNotesByLabel from '../gql/GetNotesByLabel';
import HeartIcon from '@material-ui/icons/FavoriteBorder';
import CodeIcon from '@material-ui/icons/Link';
import ReactMarkdown from 'react-markdown';
import { Grid, Typography, Card, CardContent, CardActions, Badge, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';

interface props {
    label: string
}

const NerdNotes = (props: props) => {

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
                                </CardContent>
                            </Card>                            
                        </Grid>
                        {
                            data.repository.issues.nodes.map( (node: any) => 
                                <Grid xs={6} key={node.id}>
                                    <Card style={{margin: 5}}>
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
                    return <div>No Information Available</div>
                }                
            }
        }
    </Query>

}

export default NerdNotes