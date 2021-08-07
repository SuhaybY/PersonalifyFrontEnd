import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components/macro';

import shazam from '../assets/shazam.svg';
const regex = /^(https:\/\/open\.spotify\.com\/playlist\/)(\w+)\?si=(\w+)/;

const UserHome = () => {
  const history = useHistory();
  const [playlistURL, setURL] = useState('');
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
      <InputContainer>
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
            Number of recommendations <br />
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
        <GetSongs disabled={!regex.test(playlistURL) || !songCount} onClick={inputPlaylist}>
          <img src={shazam} />
        </GetSongs>
      </InputContainer>
    </HomeContainer>
  );
};

export default UserHome;

const HomeContainer = styled.div`
  width: 100%;
  height: calc(100vh - 65px);
  background-color: #e4e2ff;
`;

const InputContainer = styled.div`
  background-color: #a5b0fe;

  // Center horizontal + vertical
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: black;
  border-radius: 8px;

  h2 {
    text-align: center;
    margin: 10px;
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

const GetSongs = styled.div`
  cursor: pointer;
  width: 120px;
  height: 120px;
  background: white;
  border-radius: 65px;
  margin: 0 auto;
  margin-bottom: 10px;
  position: relative;

  img {
    width: 100px;
    height: 100px;
    margin: 50% 0 0 50%;
    position: absolute;
    top: -50px;
    left: -50px;
  }

  &[disabled] {
    color: dimgray;
    cursor: not-allowed;
  }
`;
