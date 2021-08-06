import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components/macro';
import axios from 'axios';

const Start = () => {
  const history = useHistory();
  const [username, setCode] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('personalifyUser')) {
      history.replace('/home');
      return;
    }
  }, []);

  const loginUser = () => {
    setBusy(true);
    axios
      .post(`${process.env.REACT_APP_API_URL}/login`, {
        username,
      })
      .then((res) => {
        localStorage.setItem('personalifyUser', username);
        history.push('/home');
      })
      .catch((err) => {
        console.log(err);
        setBusy(false);
        // toast.error(`Error: ${err}`);
      });
  };

  return (
    <HomeContainer>
      <About>
        <h1>Personalify</h1>
        <p>Expand your music boundaries</p>
      </About>
      <Login>
        <TextInput>
          <input
            value={username}
            onChange={(e) => setCode(e.target.value)}
            placeholder='John Doe'
            onKeyPress={(e) => {
              if (e.key === 'Enter') loginUser();
            }}
          ></input>
        </TextInput>
        <Button disabled={busy || username.length < 3} onClick={loginUser}>
          Join
        </Button>
      </Login>
    </HomeContainer>
  );
};

export default Start;

const HomeContainer = styled.div`
  // margin: 0 auto;
  // // padding: 20px 0;
  // position: relative;
  // width: 980px;

  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  width: 900px;
`;

const About = styled.div`
  display: inline-block;
  padding-right: 320px;

  h1 {
    color: #212132;
    font-size: 44px;
    margin: 0;
  }
`;

const Login = styled.div`
  width: 300px;
  display: inline-block;
  background-color: #eeccff;
  padding: 10px;
  border-radius: 6px;
  vertical-align: top;
`;

const TextInput = styled.div`
  line-height: 48px;

  input {
    height: 30px;
    width: calc(100% - 20px);
    font-size: 14px;
    outline: none;
    border: none;
    padding: 2px 10px;
    margin: 10px 0;
    border-radius: 6px;
  }
`;

const Button = styled.button`
  background-color: #161748;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 15px 30px;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  align-self: center;
  width: 100%;
  line-height: 12px;

  &:disabled {
    background-color: silver;
    color: dimgray;
    cursor: not-allowed;
  }
`;
