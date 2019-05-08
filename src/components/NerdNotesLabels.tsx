import React, { useContext } from 'react'
import {Query} from 'react-apollo'
import GetAllLabels from '../gql/GetAllLabels';
import UIContext from '../contexts/UI';

const NerdNotesLabels = () => {

    const ui = useContext(UIContext)

    return <Query<any> query={GetAllLabels}>
        {({ loading, error, data }) => { 
                console.log(data)
                if (data.repository){
                    return <ul>
                        {data['repository']['labels']['nodes'].map(
                            (label:any) => <li 
                                    style={{
                                        cursor: "pointer"
                                    }}
                                    onClick={ ()=> ui.changeLabel(label.name) }
                                >
                                    {label.name}
                                </li>
                        )}
                    </ul>                         
                } else {
                    return <div>No information available</div>
                }                    
            }
        }
    </Query>

}

export default NerdNotesLabels