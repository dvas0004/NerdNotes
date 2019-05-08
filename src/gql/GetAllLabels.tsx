import gql from "graphql-tag";

const GetAllLabels = gql`
    query {
        repository(owner: "dvas0004", name: "NerdNotes"){
            labels(first: 100){
                nodes{
                    name
                }
            }
        }
    }
`

export default GetAllLabels