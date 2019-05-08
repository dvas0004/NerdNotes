import React, { useState, useEffect } from 'react'
import ApolloClient from "apollo-boost"
import { ApolloProvider } from "react-apollo";
import NerdNotesLabels from './NerdNotesLabels';
import UIContext from '../contexts/UI';
import NerdNotes from './NerdNotes';

//https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/
const RO_TOKEN = "a65de533600259fae0e90a2a4630dd55be67e96b"


const client = new ApolloClient({
  uri: "https://api.github.com/graphql",
  headers:{
    authorization: `Bearer ${RO_TOKEN}`
  }
});

const NerdNotesContainer = () => {

    const [label, changeLabel] = useState("")
    const [view, changeView] = useState(<NerdNotesLabels />)

    useEffect(()=>{
        if (label !== ""){
            changeView(<NerdNotes label={label} />)
        }
    },[label])

    return <UIContext.Provider value={{
        label: label,
        changeLabel: changeLabel
    }}>
        <ApolloProvider client={client}>
            {view}
        </ApolloProvider>
    </UIContext.Provider>

}

export default NerdNotesContainer