import React from 'react'
import {Grid} from '@material-ui/core'
import MainContent from './components/MainContent'

const App: React.FC = () => {
  return (
    <div className="App">
      <Grid container style={{padding: 20}}>
        <MainContent />
      </Grid>
    </div>
  );
}

export default App;
