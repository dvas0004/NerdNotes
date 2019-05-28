import React from 'react'
import Container from '@material-ui/core/Container'
import MainContent from './components/MainContent'

const App: React.FC = () => {
  return (
    <div className="App">
      <Container maxWidth="xl">
        <MainContent />
      </Container>
    </div>
  );
}

export default App;
