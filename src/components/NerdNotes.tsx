import React from 'react'
import { Query } from 'react-apollo';
import GetNotesByLabel from '../gql/GetNotesByLabel';

interface props {
    label: string
}

const NerdNotes = (props: props) => {

    return <Query<any> query={GetNotesByLabel({label: props.label})}>
        {
            ({loading, error, data})=>{
                console.log(data)
                if (data.repository){
                    return <ul>
                        {data.repository.issues.nodes.map( (node: any) => <li>{node.body} ({node.reactions.totalCount})</li> )}
                    </ul>
                } else {
                    return <div>No Information Available</div>
                }                
            }
        }
    </Query>

}

export default NerdNotes