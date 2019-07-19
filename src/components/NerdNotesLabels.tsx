import React, { Fragment } from 'react'
import {Query} from 'react-apollo'
import GetAllLabels from '../gql/GetAllLabels';
import HelpIcon from '@material-ui/icons/HelpOutline';
import { Grid,Card, CardContent, Typography, Container } from '@material-ui/core';
import { Link } from "react-router-dom";
import { useQuery } from '@apollo/react-hooks';

const NerdNotesLabels = () => {

    const { data } = useQuery(GetAllLabels);
    let view = <Fragment />;

    if (data.repository){
        view = <Grid container>
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
                    <Grid item xs={12} md={6} key="all_notes">
                        <Card style={{margin: 5}}>
                            <CardContent>
                                <Container>
                                    <Link to="all_notes">
                                        <Typography variant="overline">
                                            {`All Notes >>`}
                                        </Typography>
                                    </Link>
                                </Container>                                                                
                            </CardContent>
                        </Card>                                                        
                    </Grid>
                    {data['repository']['labels']['nodes'].map(
                        (label:any) =>  <Grid item xs={12} md={6} key={label.name}>
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
        view = <div>Loading...</div>
    }

    return <Fragment>
        {
            view
        }
    </Fragment>

}

export default NerdNotesLabels