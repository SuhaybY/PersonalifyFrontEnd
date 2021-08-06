import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components/macro';

const regex = /^(https:\/\/open\.spotify\.com\/playlist\/)(\w+)\?si=(\w+)$/;

const UserHome = () => {
  const history = useHistory();
  const [playlistURL, setURL] = useState(
    'https://open.spotify.com/playlist/37i9dQZF1EtaOgfrY9qD5t?si=8b561d7cfd224817'
  );
  // const [playlistURL, setURL] = useState('');
  const [songCount, setCount] = useState(10);

  useEffect(() => {
    if (!localStorage.getItem('personalifyUser')) {
      history.replace('/');
      return;
    }
  }, []);

  const inputPlaylist = () => {
    if (regex.test(playlistURL) && songCount) {
      history.push(`/results/${encodeURIComponent(playlistURL)}/${songCount}`);
    } else {
      console.log('Input error');
      // toast.error(`Error: ${err}`);
    }
  };

  return (
    <HomeContainer>
      <h2>Discover new songs!</h2>
      <InputData>
        <div>
          Playlist URL <br />
          <TextInput
            value={playlistURL}
            onChange={(e) => setURL(e.target.value)}
            placeholder='https://open.spotify.com/playlist/37i9dQZF1EtaOgfrY9qD5t?si=8b561d7cfd224817'
            onKeyPress={(e) => {
              if (e.key === 'Enter') inputPlaylist();
            }}
          ></TextInput>
        </div>
        <div>
          Recommendation # <br />
          <TextInput
            type='number'
            min='5'
            max='50'
            value={songCount}
            onChange={(e) => setCount(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') inputPlaylist();
            }}
          ></TextInput>
        </div>
      </InputData>
      <Button disabled={!regex.test(playlistURL) || !songCount} onClick={inputPlaylist}>
        Get Songs
      </Button>
    </HomeContainer>
  );
};

export default UserHome;

const HomeContainer = styled.div`
  background-color: #626262;

  // Center horizontal + vertical
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: black;

  h2 {
    text-align: center;
  }
`;

const InputData = styled.div`
  display: flex;

  div {
    padding: 5px 10px;
  }
`;

const TextInput = styled.input`
  height: 30px;
  font-size: 14px;
  outline: none;
  border: none;
  padding: 2px 10px;
  margin: 10px 0;
  text-align: center;

  width: calc(100% - 20px);
`;

const Button = styled.button`
  background: #f75990;
  border: none;
  padding: 15px 30px;
  cursor: pointer;
  font-size: 20px;
  font-weight: bold;
  align-self: center;
  width: calc(100% - 20px);
  margin: 10px;

  &:disabled {
    background-color: silver;
    color: dimgray;
    cursor: not-allowed;
  }
`;
