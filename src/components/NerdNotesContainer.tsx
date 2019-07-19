import React, { useState } from 'react'
import ApolloClient from "apollo-boost"
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from "@apollo/react-hooks";
import NerdNotesLabels from './NerdNotesLabels';
import NerdNotes from './NerdNotes';
import { Route } from 'react-router';
import { persistCache } from 'apollo-cache-persist';
import NerdNotesReddit from './NerdNotesReddit';
import NoteTypeContext from '../contexts/NoteTypeContext';

//https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/
const RO_TOKEN = "a65de533600259fae0e90a2a4630dd55be67e96b"

const cache = new InMemoryCache();

const client = new ApolloClient({
  uri: "https://api.github.com/graphql",
  cache: cache,
  headers:{
    authorization: `Bearer ${RO_TOKEN}`
  }
});

const setupCache = async () => {
  await persistCache({
    cache,
    storage: window.localStorage as any, //unfortunate workaround - no types for NormalizedCacheObject and some others
  });
}

const NerdNotesContainer = () => {

  const [noteType, changeNoteType] = useState("github")
  
  client.defaultOptions = {
    query: {
      fetchPolicy: 'cache-and-network'
    }
  };

  // await before instantiating ApolloClient, else queries might run before the cache is persisted
  setupCache()

  return <ApolloProvider client={client}>
          <Route exact path="/" component={ () => <NerdNotesLabels /> } />
          <NoteTypeContext.Provider value={{
            noteType: noteType,
            changeNoteType: (type: any) => {
              console.log("changeNoteType to "+type); 
              changeNoteType(type)
            }
          }}>
            { noteType == "github" ? 
                <Route path="/:label" component={ ({match}:{match : any} ) => {
                    return <NerdNotes label={match.params.label} /> 
                }} /> 
              :
                null
            }
            { noteType == "reddit" ? 
                <Route path="/:label" component={ ({match}:{match : any} ) => {
                    return <NerdNotesReddit label={match.params.label} /> 
                }} /> 
              :
                null
            }
          </NoteTypeContext.Provider>
      </ApolloProvider>

}

export default NerdNotesContainer