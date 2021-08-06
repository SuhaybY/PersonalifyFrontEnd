import React, { useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import axios from 'axios';

import play from '../assets/play.svg';
import pause from '../assets/pause.svg';
import unavailable from '../assets/unavailable.svg';

export default function Result({
  player,
  song_id,
  track,
  artists,
  images,
  preview,
  history = false,
}) {
  const [playTrack, setPlayed] = useState(false);
  const [hover, setHover] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (playTrack && player.src !== preview) {
      setPlayed(false);
    }
  }, [player.src]);

  const playSong = () => {
    if (!!preview) {
      player.src = preview;
      playTrack ? player.pause() : player.play();
      setPlayed(!playTrack);
    }
  };

  const rateSong = (rating) => {
    console.log(song_id, rating);
    setBusy(true);
    const body = {
      username: localStorage.getItem('personalifyUser'),
      song_id,
      rating,
    };
    axios
      .post(`${process.env.REACT_APP_API_URL}/ratesong`, body)
      .then((res) => {
        console.log(res);
        setBusy(false);
      })
      .catch((err) => {
        console.log(err);
        // toast.error(`Error: ${err}`);
      });
  };

  return (
    <ResultContainer>
      <ResultImages
        onClick={playSong}
        onMouseEnter={() => !!preview && setHover(true)}
        onMouseLeave={() => !!preview && setHover(false)}
        hover={!!preview ? 'pointer' : 'default'}
      >
        <AlbumImage
          src={images && images[0].url}
          onError={(e) => (e.target.src = unavailable)}
          opacity={hover ? 0.2 : 1}
        />
        {!!preview && hover && <PlayImage src={playTrack ? pause : play} />}
      </ResultImages>
      <div>
        <MovieDetails>
          <div>
            <b>{track}</b>
          </div>
          <div>{artists && artists.join(', ')}</div>
        </MovieDetails>
        {!history && (
          <MovieActions>
            <button onClick={() => rateSong(true)} disabled={busy}>
              Like
            </button>
            <button onClick={() => rateSong(false)} disabled={busy}>
              Dislike
            </button>
          </MovieActions>
        )}
      </div>
    </ResultContainer>
  );
}

const ResultContainer = styled.div`
  width: 300px;
  height: 128px;
  background: gray;
  margin: 10px;
  display: flex;
  flex-direction: row;

  > div {
    position: relative;
  }
`;

const ResultImages = styled.div`
  position: relative;
  * {
    width: 128px;
    height: 128px;
  }

  :hover {
    cursor: ${(props) => props.hover};
  }
`;

const AlbumImage = styled.img`
  opacity: ${(props) => props.opacity};
`;

const PlayImage = styled.img`
  position: absolute;
  left: 0;
  z-index: 1;
`;

const MovieDetails = styled.div`
  padding: 5px 10px;
`;

const MovieActions = styled.div`
  position: absolute;
  padding: 5px 10px;
  bottom: 0;
`;
