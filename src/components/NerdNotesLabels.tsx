import React, { useContext } from 'react'
import {Query} from 'react-apollo'
import GetAllLabels from '../gql/GetAllLabels';
import { GridList, GridListTile, Card, CardContent, Typography, Container } from '@material-ui/core';
import { Link } from "react-router-dom";

const NerdNotesLabels = () => {

    return <Query<any> query={GetAllLabels}>
        {({ loading, error, data }) => { 
                console.log(data)
                if (data.repository){
                    return <GridList cellHeight={180}>
                                <GridListTile key="labelsHeading" cols={2} style={{height: "auto"}}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h4">
                                                Nerd Notes Labels
                                            </Typography>
                                        </CardContent>                                        
                                    </Card>
                                </GridListTile>
                                {data['repository']['labels']['nodes'].map(
                                    (label:any) =>  <GridListTile key={label.name} 
                                                        style={{
                                                            height: "auto",
                                                            cursor: "pointer"
                                                        }}
                                                    >
                                                        <Card>
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
                                                    </GridListTile>
                                )}
                            </GridList>                         
                } else {
                    return <div>No information available</div>
                }                    
            }
        }
    </Query>

}

export default NerdNotesLabels