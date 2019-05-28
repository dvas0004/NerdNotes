import { gql } from "apollo-boost";

interface funcArgs {
    label: string
}

const GetNotesByLabel = (args: funcArgs) => {
    
    return gql`
        query {
            repository(owner: "dvas0004", name: "NerdNotes"){
                issues(first: 100, labels: [${args.label}]){
                nodes{
                    id
                    resourcePath
                    title
                    body
                    labels(first: 100){
                        nodes{
                            name
                        }
                    }
                    reactions(first:100, content: HEART){
                        totalCount
                    }
                }
                }
            }
        }
    `

}


export default GetNotesByLabel