import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import styled from 'styled-components/macro';

import Start from './views/Start';
import UserHome from './views/UserHome';
import Results from './views/Results';
import Header from './components/Header';

const App = () => {
  const [player] = useState(new Audio(null));

  return (
    <AppContainer>
      <Router>
        <Switch>
          <Route path='/home'>
            <Header />
            <UserHome />
          </Route>
          <Route path='/results/:playlist_url?/:song_count?'>
            <Header player={player} />
            <Results player={player} />
          </Route>
          <Route path='/'>
            <Start />
          </Route>
        </Switch>
      </Router>
      {/* <ToastContainer position='bottom-center' autoClose={5000} /> */}
    </AppContainer>
  );
};

export default App;

const AppContainer = styled.div`
  min-height: 100vh;
  height: 100%;
  background: #fff;
`;
