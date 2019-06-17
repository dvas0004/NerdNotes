import { gql } from "apollo-boost";

interface funcArgs {
    label: string,
    after?: string
}

const GetNotesByLabel = (args: funcArgs) => {
    
    return gql`
        query {
            repository(owner: "dvas0004", name: "NerdNotes"){
                issues(first: 15, labels: [${args.label}], 
                    ${args.after? `after: "${args.after}"` : ""}
                    orderBy:{
                        field: UPDATED_AT,
                        direction: DESC
                  }){
                    pageInfo{
                        endCursor,
                        hasNextPage
                      },
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