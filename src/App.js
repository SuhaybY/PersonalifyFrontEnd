import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import styled from 'styled-components/macro';
import axios from 'axios';

import Start from './views/Start';
import UserHome from './views/UserHome';
import Results from './views/Results';
import Header from './components/Header';

const App = () => {
  const [player] = useState(new Audio(null));
  const [historyList, setHistory] = useState([]);

  useEffect(() => {
    let body = {
      username: localStorage.getItem('personalifyUser'),
    };
    axios
      .post(`${process.env.REACT_APP_API_URL}/history`, body)
      .then((res) => {
        setHistory(res.data.history);
      })
      .catch((err) => {
        console.log(err);
        // toast.error(`Error: ${err}`);
      });
  }, []);

  return (
    <AppContainer>
      <Router>
        <Switch>
          <Route path='/home'>
            <Header player={player} historyList={historyList} />
            <UserHome />
          </Route>
          <Route path='/results/:playlist_url?/:song_count?'>
            <Header player={player} historyList={historyList} />
            <Results player={player} historyList={historyList} setHistory={setHistory} />
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
  background: #a5b0fe;
`;
