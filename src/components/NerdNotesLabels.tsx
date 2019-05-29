import React, { useContext } from 'react'
import {Query} from 'react-apollo'
import GetAllLabels from '../gql/GetAllLabels';
import HelpIcon from '@material-ui/icons/HelpOutline';
import { Grid,Card, CardContent, Typography, Container } from '@material-ui/core';
import { Link } from "react-router-dom";

const NerdNotesLabels = () => {

    return <Query<any> query={GetAllLabels}>
        {({ loading, error, data }) => { 
                console.log(data)
                if (data.repository){
                    return <Grid container>
                                <Grid item key='labelsHeading' xs={12} style={{height: "auto", padding: 10}}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h4">
                                                Nerd Notes
                                                <HelpIcon
                                                    style={{
                                                        marginLeft: 20,
                                                        cursor: "pointer"
                                                    }} 
                                                    onClick={()=>window.location.assign('https://github.com/dvas0004/NerdNotes/blob/master/README.md')}
                                                />
                                            </Typography>
                                            
                                        </CardContent>                                        
                                    </Card>
                                </Grid>
                                {data['repository']['labels']['nodes'].map(
                                    (label:any) =>  <Grid xs={12} md={6} key={label.name}>
                                                        <Card style={{margin: 5}}>
                                                            <CardContent>
                                                                <Container>
                                                                    <Link to={label.name}>
                                                                        <Typography variant="overline">
                                                                            {label.name} >>
                                                                        </Typography>
                                                                    </Link>
                                                                </Container>                                                                
                                                            </CardContent>
                                                        </Card>                                                        
                                                    </Grid>
                                )}
                            </Grid>                         
                } else {
                    return <div>No information available</div>
                }                    
            }
        }
    </Query>

}

export default NerdNotesLabels