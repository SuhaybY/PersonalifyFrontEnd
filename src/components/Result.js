import React, { useEffect, useState } from 'react';
import styled from 'styled-components/macro';

import play from '../assets/play.svg';
import pause from '../assets/pause.svg';
import unavailable_sample from '../assets/unavailable_sample.svg';
import unavailable_image from '../assets/unavailable_image.svg';

export default function Result({
  idx,
  player,
  track,
  artists,
  images,
  preview,
  ratings,
  setRatings,
  history = false,
}) {
  const [playTrack, setPlayed] = useState(false);
  const [hover, setHover] = useState(false);
  const [liked, setLiked] = useState(0);

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
    const updated = ratings;
    updated[idx] = rating;
    setRatings([...updated]);
  };

  return (
    <ResultContainer>
      <ResultImages
        onClick={playSong}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        hover={!!preview ? 'pointer' : 'default'}
      >
        <AlbumImage
          src={!!images ? images[0].url : unavailable_image}
          onError={(e) => (e.target.src = unavailable_image)}
          opacity={hover ? 0.2 : 1}
        />
        {hover && <PlayImage src={preview ? (playTrack ? pause : play) : unavailable_sample} />}
      </ResultImages>
      <div>
        <SongDetails>
          <div>
            <b>{track}</b>
          </div>
          <div>{artists && artists.join(', ')}</div>
        </SongDetails>
        {!history && (
          <SongActions>
            <Button
              bColor={liked === 1 ? 'green' : '#1a1a1d'}
              onClick={() => {
                rateSong(true);
                setLiked(1);
              }}
            >
              Like
            </Button>
            <Button
              bColor={liked === 2 ? 'red' : '#1a1a1d'}
              onClick={() => {
                rateSong(false);
                setLiked(2);
              }}
            >
              Dislike
            </Button>
          </SongActions>
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

  > div:nth-child(2) {
    display: flex;
    flex-direction: column;
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

const SongDetails = styled.div`
  padding: 5px 10px;
  height: calc(100% - 20px);
  overflow-y: auto;
`;

const SongActions = styled.div`
  padding: 5px 10px;
`;

const Button = styled.button`
  background: ${(props) => props.bColor};
  border: none;
  padding: 15px 30px;
  margin-right: 5px;
  cursor: pointer;
  font-size: 20px;
  font-weight: bold;
  align-self: center;
  border-radius: 8px;

  padding: 8px 15px;
  font-size: 12px;
  color: white;
`;
