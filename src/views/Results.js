import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components/macro';
import axios from 'axios';
import Result from '../components/Result';
import { ReactComponent as Loading } from '../assets/loading.svg';

const formatArtists = (artists) => {
  const res = artists
    .substring(1, artists.length - 1)
    .split(',')
    .map((artist) => {
      artist = artist.trim();
      artist = artist.substring(1, artist.length - 1);
      return artist;
    });

  return res;
};

const Results = ({ player, historyList, setHistory }) => {
  const history = useHistory();
  const { playlist_url, song_count } = useParams();
  const [songList, setSongs] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [load, setLoad] = useState(true);
  const [status, setStatus] = useState('Training model & loading personalized tracks...');

  useEffect(() => {
    // Debugging:
    // setLoad(false);
    // setSongs(smallTestData);
    // setRatings(Array(smallTestData.length).fill(null));
    // return;
    if (!playlist_url || !song_count) {
      history.replace('/');
      return;
    }
    // history.replace('/results');
    const body = {
      username: localStorage.getItem('personalifyUser'),
      playlist_url: decodeURIComponent(playlist_url),
      song_count,
    };
    axios
      .post(`${process.env.REACT_APP_API_URL}/inputplaylist`, body)
      .then((res) => {
        console.log(res);
        setLoad(false);
        setSongs(res.data.results);
        setHistory([
          ...historyList,
          {
            id: res.data.id,
            date: res.data.date,
          },
        ]);
        setRatings(Array(res.data.results.length).fill(null));
      })
      .catch((err) => {
        console.log(err);
        // toast.error(`Error: ${err}`);
      });
  }, []);

  const submitRatings = () => {
    const recommendation_list = songList.map((x) => [x.name, x.artists]);
    const body = {
      username: localStorage.getItem('personalifyUser'),
      url: decodeURIComponent(playlist_url),
      recommendation_list,
      ratings,
    };

    setLoad(true);
    setStatus('Retrieving updated tracks...');

    axios
      .post(`${process.env.REACT_APP_API_URL}/ratesongs`, body)
      .then((res) => {
        console.log(res);
        setLoad(false);
        setSongs(res.data.results);
        setHistory([
          ...historyList,
          {
            id: res.data.id,
            date: res.data.date,
          },
        ]);
        setRatings(Array(res.data.results.length).fill(null));
      })
      .catch((err) => {
        console.log(err);
        // toast.error(`Error: ${err}`);
      });
  };

  return (
    <HomeContainer>
      {load ? (
        <LoadContainer>
          <Loading />
          <p>{status}</p>
        </LoadContainer>
      ) : (
        <ResultContainer>
          <ResultHeading>
            <h2>Results</h2>
            <Button disabled={ratings.some((x) => x === null)} onClick={submitRatings}>
              Submit Review
            </Button>
          </ResultHeading>
          <hr size='1' />
          <ResultGrid>
            {songList.map((song, index) => (
              <Result
                idx={index}
                key={`result${index}`}
                player={player}
                track={song.name}
                artists={formatArtists(song.artists)}
                images={song['album.images']}
                preview={song.preview_url}
                ratings={ratings}
                setRatings={setRatings}
              />
            ))}
          </ResultGrid>
        </ResultContainer>
      )}
    </HomeContainer>
  );
};

export default Results;

const HomeContainer = styled.div``;

const LoadContainer = styled.div`
  text-align: center;
  padding-top: 20vh;
`;

const ResultContainer = styled.div`
  width: 80%;
  margin: 10px auto;
  background-color: #1a1a1d;

  h2 {
    color: white;
    margin: 0;
    padding: 10px 10px 0px;
  }
`;

const ResultHeading = styled.div`
  position: relative;
`;

const ResultGrid = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  overflow-y: auto;
  max-height: calc(80vh - 20px);
`;

const Button = styled.button`
  position: absolute;
  right: 10px;
  top: 10px;
  background-color: #161748;
  border: none;
  padding: 15px 30px;
  cursor: pointer;
  font-size: 20px;
  font-weight: bold;
  align-self: center;
  width: 150px;
  border-radius: 8px;

  padding: 8px 15px;
  font-size: 12px;
  color: white;

  &:disabled {
    background-color: silver;
    color: black;
    cursor: not-allowed;
  }
`;

const smallTestData = [
  {
    id: '7ImkjvM1OKWhJ5HIPOHcHE',
    name: 'Walking with a Ghost',
    popularity: 55,
    duration_ms: 150293,
    explicit: 0,
    artists: "['Tegan and Sara']",
    id_artists: "['5e1BZulIiYWPRm8yogwUYH']",
    release_date: '2004-09-14',
    danceability: 0.788,
    energy: 0.541,
    key: 6,
    loudness: -5.987,
    mode: 0,
    speechiness: 0.0387,
    acousticness: 0.125,
    instrumentalness: 0.000231,
    liveness: 0.0679,
    valence: 0.928,
    tempo: 118.058,
    time_signature: 4,
    preview_url:
      'https://p.scdn.co/mp3-preview/e29300060990a5502ebfc4156f638ae36c09fd27?cid=f3f14386465b4ac1b96c23194a0aec4b',
    'album.images': [
      {
        height: 640,
        url: 'https://i.scdn.co/image/ab67616d0000b273d424a2675b400a7d2dac48b9',
        width: 640,
      },
      {
        height: 300,
        url: 'https://i.scdn.co/image/ab67616d00001e02d424a2675b400a7d2dac48b9',
        width: 300,
      },
      {
        height: 64,
        url: 'https://i.scdn.co/image/ab67616d00004851d424a2675b400a7d2dac48b9',
        width: 64,
      },
    ],
  },
  {
    id: '0OpSYP9Oly3SqmeIgiRnzT',
    name: "All These Things That I've Done",
    popularity: 55,
    duration_ms: 301747,
    explicit: 0,
    artists: "['The Killers']",
    id_artists: "['0C0XlULifJtAgn6ZNCW2eu']",
    release_date: '2004-06-15',
    danceability: 0.552,
    energy: 0.71,
    key: 6,
    loudness: -6.925,
    mode: 1,
    speechiness: 0.0425,
    acousticness: 0.00164,
    instrumentalness: 5.07e-6,
    liveness: 0.116,
    valence: 0.206,
    tempo: 118.276,
    time_signature: 4,
    preview_url: null,
    'album.images': [
      {
        height: 640,
        url: 'https://i.scdn.co/image/ab67616d0000b2739c284a6855f4945dc5a3cd73',
        width: 640,
      },
      {
        height: 300,
        url: 'https://i.scdn.co/image/ab67616d00001e029c284a6855f4945dc5a3cd73',
        width: 300,
      },
      {
        height: 64,
        url: 'https://i.scdn.co/image/ab67616d000048519c284a6855f4945dc5a3cd73',
        width: 64,
      },
    ],
  },
  {
    id: '2KMT02c16COpkLxFCnCxzE',
    name: 'Underwater',
    popularity: 55,
    duration_ms: 349893,
    explicit: 0,
    artists: "['RÜFÜS DU SOL']",
    id_artists: "['5Pb27ujIyYb33zBqVysBkj']",
    release_date: '2018-10-19',
    danceability: 0.604,
    energy: 0.82,
    key: 6,
    loudness: -6.64,
    mode: 0,
    speechiness: 0.0342,
    acousticness: 0.0181,
    instrumentalness: 0.0168,
    liveness: 0.115,
    valence: 0.44,
    tempo: 117.996,
    time_signature: 4,
    preview_url:
      'https://p.scdn.co/mp3-preview/b2ddd02038f2bc6794e4f2cd4a7a1e9798442ed4?cid=f3f14386465b4ac1b96c23194a0aec4b',
    'album.images': [
      {
        height: 640,
        url: 'https://i.scdn.co/image/ab67616d0000b27397b4fe1728c5498d1f30d9e2',
        width: 640,
      },
      {
        height: 300,
        url: 'https://i.scdn.co/image/ab67616d00001e0297b4fe1728c5498d1f30d9e2',
        width: 300,
      },
      {
        height: 64,
        url: 'https://i.scdn.co/image/ab67616d0000485197b4fe1728c5498d1f30d9e2',
        width: 64,
      },
    ],
  },
  {
    id: '6U09CC1Hm0rfXyzZpLZOdg',
    name: 'Berbeza Kasta',
    popularity: 55,
    duration_ms: 308571,
    explicit: 0,
    artists: "['Kalia Siska', 'SKA86']",
    id_artists: "['70hsEvlt6YZPT97UIvzpEu', '2Kp7UY28pWLljMgp0Hydn6']",
    release_date: '2020-07-31',
    danceability: 0.783,
    energy: 0.714,
    key: 6,
    loudness: -5.618,
    mode: 0,
    speechiness: 0.0326,
    acousticness: 0.292,
    instrumentalness: 3.22e-5,
    liveness: 0.355,
    valence: 0.824,
    tempo: 116.988,
    time_signature: 4,
    preview_url:
      'https://p.scdn.co/mp3-preview/e502c742c5f354a467bb6c09b540743f8dae50e4?cid=f3f14386465b4ac1b96c23194a0aec4b',
    'album.images': [
      {
        height: 640,
        url: 'https://i.scdn.co/image/ab67616d0000b27359164e60989885049565b2dd',
        width: 640,
      },
      {
        height: 300,
        url: 'https://i.scdn.co/image/ab67616d00001e0259164e60989885049565b2dd',
        width: 300,
      },
      {
        height: 64,
        url: 'https://i.scdn.co/image/ab67616d0000485159164e60989885049565b2dd',
        width: 64,
      },
    ],
  },
];
const testData = [
  {
    id: '7ImkjvM1OKWhJ5HIPOHcHE',
    name: 'Walking with a Ghost',
    popularity: 55,
    duration_ms: 150293,
    explicit: 0,
    artists: "['Tegan and Sara']",
    id_artists: "['5e1BZulIiYWPRm8yogwUYH']",
    release_date: '2004-09-14',
    danceability: 0.788,
    energy: 0.541,
    key: 6,
    loudness: -5.987,
    mode: 0,
    speechiness: 0.0387,
    acousticness: 0.125,
    instrumentalness: 0.000231,
    liveness: 0.0679,
    valence: 0.928,
    tempo: 118.058,
    time_signature: 4,
    preview_url:
      'https://p.scdn.co/mp3-preview/e29300060990a5502ebfc4156f638ae36c09fd27?cid=f3f14386465b4ac1b96c23194a0aec4b',
    'album.images': [
      {
        height: 640,
        url: 'https://i.scdn.co/image/ab67616d0000b273d424a2675b400a7d2dac48b9',
        width: 640,
      },
      {
        height: 300,
        url: 'https://i.scdn.co/image/ab67616d00001e02d424a2675b400a7d2dac48b9',
        width: 300,
      },
      {
        height: 64,
        url: 'https://i.scdn.co/image/ab67616d00004851d424a2675b400a7d2dac48b9',
        width: 64,
      },
    ],
  },
  {
    id: '0OpSYP9Oly3SqmeIgiRnzT',
    name: "All These Things That I've Done",
    popularity: 55,
    duration_ms: 301747,
    explicit: 0,
    artists: "['The Killers']",
    id_artists: "['0C0XlULifJtAgn6ZNCW2eu']",
    release_date: '2004-06-15',
    danceability: 0.552,
    energy: 0.71,
    key: 6,
    loudness: -6.925,
    mode: 1,
    speechiness: 0.0425,
    acousticness: 0.00164,
    instrumentalness: 5.07e-6,
    liveness: 0.116,
    valence: 0.206,
    tempo: 118.276,
    time_signature: 4,
    preview_url: null,
    'album.images': [
      {
        height: 640,
        url: 'https://i.scdn.co/image/ab67616d0000b2739c284a6855f4945dc5a3cd73',
        width: 640,
      },
      {
        height: 300,
        url: 'https://i.scdn.co/image/ab67616d00001e029c284a6855f4945dc5a3cd73',
        width: 300,
      },
      {
        height: 64,
        url: 'https://i.scdn.co/image/ab67616d000048519c284a6855f4945dc5a3cd73',
        width: 64,
      },
    ],
  },
  {
    id: '2KMT02c16COpkLxFCnCxzE',
    name: 'Underwater',
    popularity: 55,
    duration_ms: 349893,
    explicit: 0,
    artists: "['RÜFÜS DU SOL']",
    id_artists: "['5Pb27ujIyYb33zBqVysBkj']",
    release_date: '2018-10-19',
    danceability: 0.604,
    energy: 0.82,
    key: 6,
    loudness: -6.64,
    mode: 0,
    speechiness: 0.0342,
    acousticness: 0.0181,
    instrumentalness: 0.0168,
    liveness: 0.115,
    valence: 0.44,
    tempo: 117.996,
    time_signature: 4,
    preview_url:
      'https://p.scdn.co/mp3-preview/b2ddd02038f2bc6794e4f2cd4a7a1e9798442ed4?cid=f3f14386465b4ac1b96c23194a0aec4b',
    'album.images': [
      {
        height: 640,
        url: 'https://i.scdn.co/image/ab67616d0000b27397b4fe1728c5498d1f30d9e2',
        width: 640,
      },
      {
        height: 300,
        url: 'https://i.scdn.co/image/ab67616d00001e0297b4fe1728c5498d1f30d9e2',
        width: 300,
      },
      {
        height: 64,
        url: 'https://i.scdn.co/image/ab67616d0000485197b4fe1728c5498d1f30d9e2',
        width: 64,
      },
    ],
  },
  {
    id: '6U09CC1Hm0rfXyzZpLZOdg',
    name: 'Berbeza Kasta',
    popularity: 55,
    duration_ms: 308571,
    explicit: 0,
    artists: "['Kalia Siska', 'SKA86']",
    id_artists: "['70hsEvlt6YZPT97UIvzpEu', '2Kp7UY28pWLljMgp0Hydn6']",
    release_date: '2020-07-31',
    danceability: 0.783,
    energy: 0.714,
    key: 6,
    loudness: -5.618,
    mode: 0,
    speechiness: 0.0326,
    acousticness: 0.292,
    instrumentalness: 3.22e-5,
    liveness: 0.355,
    valence: 0.824,
    tempo: 116.988,
    time_signature: 4,
    preview_url:
      'https://p.scdn.co/mp3-preview/e502c742c5f354a467bb6c09b540743f8dae50e4?cid=f3f14386465b4ac1b96c23194a0aec4b',
    'album.images': [
      {
        height: 640,
        url: 'https://i.scdn.co/image/ab67616d0000b27359164e60989885049565b2dd',
        width: 640,
      },
      {
        height: 300,
        url: 'https://i.scdn.co/image/ab67616d00001e0259164e60989885049565b2dd',
        width: 300,
      },
      {
        height: 64,
        url: 'https://i.scdn.co/image/ab67616d0000485159164e60989885049565b2dd',
        width: 64,
      },
    ],
  },
  {
    id: '58JZ4RVYonCaKz7FVOqZPL',
    name: 'Volvera (feat. Alejandro Sanz)',
    popularity: 54,
    duration_ms: 180853,
    explicit: 0,
    artists: "['El Canto Del Loco', 'Alejandro Sanz']",
    id_artists: "['5RK6c1tyaKpwcDpbgCGNgj', '5sUrlPAHlS9NEirDB8SEbF']",
    release_date: '2009-11-24',
    danceability: 0.715,
    energy: 0.706,
    key: 6,
    loudness: -6.668,
    mode: 1,
    speechiness: 0.0253,
    acousticness: 0.35,
    instrumentalness: 0.0,
    liveness: 0.25,
    valence: 0.833,
    tempo: 118.01,
    time_signature: 4,
    preview_url:
      'https://p.scdn.co/mp3-preview/7a574c22911ab87ad93db921a3de70ef3874be3e?cid=f3f14386465b4ac1b96c23194a0aec4b',
    'album.images': [
      {
        height: 640,
        url: 'https://i.scdn.co/image/ab67616d0000b273c22e9dd3a02fe8a5fcd15178',
        width: 640,
      },
      {
        height: 300,
        url: 'https://i.scdn.co/image/ab67616d00001e02c22e9dd3a02fe8a5fcd15178',
        width: 300,
      },
      {
        height: 64,
        url: 'https://i.scdn.co/image/ab67616d00004851c22e9dd3a02fe8a5fcd15178',
        width: 64,
      },
    ],
  },
  {
    id: '7DdyIz0ujbWhkCHtgvCiBh',
    name: 'Squale (feat. Chich)',
    popularity: 54,
    duration_ms: 234373,
    explicit: 1,
    artists: "[\"Jok'air\", 'Chich']",
    id_artists: "['2kIs76sEGiulKeqetZq6ua', '66t9jFMMHlihDiM2urzKHs']",
    release_date: '2017-02-24',
    danceability: 0.703,
    energy: 0.495,
    key: 6,
    loudness: -6.356,
    mode: 1,
    speechiness: 0.0584,
    acousticness: 0.252,
    instrumentalness: 0.0,
    liveness: 0.124,
    valence: 0.449,
    tempo: 117.068,
    time_signature: 4,
    preview_url:
      'https://p.scdn.co/mp3-preview/953dfbcb5c141a83da67a9c8afbe5ea827aed023?cid=f3f14386465b4ac1b96c23194a0aec4b',
    'album.images': [
      {
        height: 640,
        url: 'https://i.scdn.co/image/ab67616d0000b273fb06cdf470849b9eeb38d68c',
        width: 640,
      },
      {
        height: 300,
        url: 'https://i.scdn.co/image/ab67616d00001e02fb06cdf470849b9eeb38d68c',
        width: 300,
      },
      {
        height: 64,
        url: 'https://i.scdn.co/image/ab67616d00004851fb06cdf470849b9eeb38d68c',
        width: 64,
      },
    ],
  },
  {
    id: '2EdAzvb3Qc6E8h8glHD9jF',
    name: 'Corazón partío',
    popularity: 55,
    duration_ms: 300107,
    explicit: 0,
    artists: "['Alejandro Sanz']",
    id_artists: "['5sUrlPAHlS9NEirDB8SEbF']",
    release_date: '2001-11-19',
    danceability: 0.532,
    energy: 0.859,
    key: 5,
    loudness: -6.783,
    mode: 1,
    speechiness: 0.0874,
    acousticness: 0.578,
    instrumentalness: 0.0,
    liveness: 0.986,
    valence: 0.5,
    tempo: 117.081,
    time_signature: 5,
    preview_url:
      'https://p.scdn.co/mp3-preview/943f13933c9d16a722a34cf77f3ae3fadb8e0351?cid=f3f14386465b4ac1b96c23194a0aec4b',
    'album.images': [
      {
        height: 640,
        url: 'https://i.scdn.co/image/ab67616d0000b2730eb3e415c8a372c1441e1d32',
        width: 640,
      },
      {
        height: 300,
        url: 'https://i.scdn.co/image/ab67616d00001e020eb3e415c8a372c1441e1d32',
        width: 300,
      },
      {
        height: 64,
        url: 'https://i.scdn.co/image/ab67616d000048510eb3e415c8a372c1441e1d32',
        width: 64,
      },
    ],
  },
  {
    id: '5zG4ymJbbNN5Rmjt6VkVNs',
    name: 'Дым',
    popularity: 56,
    duration_ms: 219961,
    explicit: 1,
    artists: "['Lesha Svik']",
    id_artists: "['5uMClxnfkye15tg63lrwU8']",
    release_date: '2018-04-27',
    danceability: 0.833,
    energy: 0.513,
    key: 5,
    loudness: -6.509,
    mode: 0,
    speechiness: 0.0926,
    acousticness: 0.389,
    instrumentalness: 3.53e-5,
    liveness: 0.116,
    valence: 0.251,
    tempo: 118.052,
    time_signature: 4,
    preview_url:
      'https://p.scdn.co/mp3-preview/e9370f95c4f4b0b1915cf968a20f591e407e2e0d?cid=f3f14386465b4ac1b96c23194a0aec4b',
    'album.images': [
      {
        height: 640,
        url: 'https://i.scdn.co/image/ab67616d0000b2739f339b1cf1fcd481a4cc7b08',
        width: 640,
      },
      {
        height: 300,
        url: 'https://i.scdn.co/image/ab67616d00001e029f339b1cf1fcd481a4cc7b08',
        width: 300,
      },
      {
        height: 64,
        url: 'https://i.scdn.co/image/ab67616d000048519f339b1cf1fcd481a4cc7b08',
        width: 64,
      },
    ],
  },
  {
    id: '5PRN8ql17R8rcKnHo6Ajlk',
    name: 'Feeding Line',
    popularity: 54,
    duration_ms: 268627,
    explicit: 0,
    artists: "['Boy & Bear']",
    id_artists: "['2NqgE99Ll5vOTvmbN7O2R6']",
    release_date: '2011-08-05',
    danceability: 0.641,
    energy: 0.648,
    key: 6,
    loudness: -6.094,
    mode: 0,
    speechiness: 0.0265,
    acousticness: 0.000849,
    instrumentalness: 0.0217,
    liveness: 0.121,
    valence: 0.234,
    tempo: 117.944,
    time_signature: 4,
    preview_url: null,
    'album.images': [
      {
        height: 640,
        url: 'https://i.scdn.co/image/ab67616d0000b273bd569217f48c0d942c615d15',
        width: 640,
      },
      {
        height: 300,
        url: 'https://i.scdn.co/image/ab67616d00001e02bd569217f48c0d942c615d15',
        width: 300,
      },
      {
        height: 64,
        url: 'https://i.scdn.co/image/ab67616d00004851bd569217f48c0d942c615d15',
        width: 64,
      },
    ],
  },
  {
    id: '7ImkjvM1OKWhJ5HIPOHcHE',
    name: 'Walking with a Ghost',
    popularity: 55,
    duration_ms: 150293,
    explicit: 0,
    artists: "['Tegan and Sara']",
    id_artists: "['5e1BZulIiYWPRm8yogwUYH']",
    release_date: '2004-09-14',
    danceability: 0.788,
    energy: 0.541,
    key: 6,
    loudness: -5.987,
    mode: 0,
    speechiness: 0.0387,
    acousticness: 0.125,
    instrumentalness: 0.000231,
    liveness: 0.0679,
    valence: 0.928,
    tempo: 118.058,
    time_signature: 4,
    preview_url:
      'https://p.scdn.co/mp3-preview/e29300060990a5502ebfc4156f638ae36c09fd27?cid=f3f14386465b4ac1b96c23194a0aec4b',
    'album.images': [
      {
        height: 640,
        url: 'https://i.scdn.co/image/ab67616d0000b273d424a2675b400a7d2dac48b9',
        width: 640,
      },
      {
        height: 300,
        url: 'https://i.scdn.co/image/ab67616d00001e02d424a2675b400a7d2dac48b9',
        width: 300,
      },
      {
        height: 64,
        url: 'https://i.scdn.co/image/ab67616d00004851d424a2675b400a7d2dac48b9',
        width: 64,
      },
    ],
  },
  {
    id: '0OpSYP9Oly3SqmeIgiRnzT',
    name: "All These Things That I've Done",
    popularity: 55,
    duration_ms: 301747,
    explicit: 0,
    artists: "['The Killers']",
    id_artists: "['0C0XlULifJtAgn6ZNCW2eu']",
    release_date: '2004-06-15',
    danceability: 0.552,
    energy: 0.71,
    key: 6,
    loudness: -6.925,
    mode: 1,
    speechiness: 0.0425,
    acousticness: 0.00164,
    instrumentalness: 5.07e-6,
    liveness: 0.116,
    valence: 0.206,
    tempo: 118.276,
    time_signature: 4,
    preview_url: null,
    'album.images': [
      {
        height: 640,
        url: 'https://i.scdn.co/image/ab67616d0000b2739c284a6855f4945dc5a3cd73',
        width: 640,
      },
      {
        height: 300,
        url: 'https://i.scdn.co/image/ab67616d00001e029c284a6855f4945dc5a3cd73',
        width: 300,
      },
      {
        height: 64,
        url: 'https://i.scdn.co/image/ab67616d000048519c284a6855f4945dc5a3cd73',
        width: 64,
      },
    ],
  },
  {
    id: '2KMT02c16COpkLxFCnCxzE',
    name: 'Underwater',
    popularity: 55,
    duration_ms: 349893,
    explicit: 0,
    artists: "['RÜFÜS DU SOL']",
    id_artists: "['5Pb27ujIyYb33zBqVysBkj']",
    release_date: '2018-10-19',
    danceability: 0.604,
    energy: 0.82,
    key: 6,
    loudness: -6.64,
    mode: 0,
    speechiness: 0.0342,
    acousticness: 0.0181,
    instrumentalness: 0.0168,
    liveness: 0.115,
    valence: 0.44,
    tempo: 117.996,
    time_signature: 4,
    preview_url:
      'https://p.scdn.co/mp3-preview/b2ddd02038f2bc6794e4f2cd4a7a1e9798442ed4?cid=f3f14386465b4ac1b96c23194a0aec4b',
    'album.images': [
      {
        height: 640,
        url: 'https://i.scdn.co/image/ab67616d0000b27397b4fe1728c5498d1f30d9e2',
        width: 640,
      },
      {
        height: 300,
        url: 'https://i.scdn.co/image/ab67616d00001e0297b4fe1728c5498d1f30d9e2',
        width: 300,
      },
      {
        height: 64,
        url: 'https://i.scdn.co/image/ab67616d0000485197b4fe1728c5498d1f30d9e2',
        width: 64,
      },
    ],
  },
  {
    id: '6U09CC1Hm0rfXyzZpLZOdg',
    name: 'Berbeza Kasta',
    popularity: 55,
    duration_ms: 308571,
    explicit: 0,
    artists: "['Kalia Siska', 'SKA86']",
    id_artists: "['70hsEvlt6YZPT97UIvzpEu', '2Kp7UY28pWLljMgp0Hydn6']",
    release_date: '2020-07-31',
    danceability: 0.783,
    energy: 0.714,
    key: 6,
    loudness: -5.618,
    mode: 0,
    speechiness: 0.0326,
    acousticness: 0.292,
    instrumentalness: 3.22e-5,
    liveness: 0.355,
    valence: 0.824,
    tempo: 116.988,
    time_signature: 4,
    preview_url:
      'https://p.scdn.co/mp3-preview/e502c742c5f354a467bb6c09b540743f8dae50e4?cid=f3f14386465b4ac1b96c23194a0aec4b',
    'album.images': [
      {
        height: 640,
        url: 'https://i.scdn.co/image/ab67616d0000b27359164e60989885049565b2dd',
        width: 640,
      },
      {
        height: 300,
        url: 'https://i.scdn.co/image/ab67616d00001e0259164e60989885049565b2dd',
        width: 300,
      },
      {
        height: 64,
        url: 'https://i.scdn.co/image/ab67616d0000485159164e60989885049565b2dd',
        width: 64,
      },
    ],
  },
  {
    id: '58JZ4RVYonCaKz7FVOqZPL',
    name: 'Volvera (feat. Alejandro Sanz)',
    popularity: 54,
    duration_ms: 180853,
    explicit: 0,
    artists: "['El Canto Del Loco', 'Alejandro Sanz']",
    id_artists: "['5RK6c1tyaKpwcDpbgCGNgj', '5sUrlPAHlS9NEirDB8SEbF']",
    release_date: '2009-11-24',
    danceability: 0.715,
    energy: 0.706,
    key: 6,
    loudness: -6.668,
    mode: 1,
    speechiness: 0.0253,
    acousticness: 0.35,
    instrumentalness: 0.0,
    liveness: 0.25,
    valence: 0.833,
    tempo: 118.01,
    time_signature: 4,
    preview_url:
      'https://p.scdn.co/mp3-preview/7a574c22911ab87ad93db921a3de70ef3874be3e?cid=f3f14386465b4ac1b96c23194a0aec4b',
    'album.images': [
      {
        height: 640,
        url: 'https://i.scdn.co/image/ab67616d0000b273c22e9dd3a02fe8a5fcd15178',
        width: 640,
      },
      {
        height: 300,
        url: 'https://i.scdn.co/image/ab67616d00001e02c22e9dd3a02fe8a5fcd15178',
        width: 300,
      },
      {
        height: 64,
        url: 'https://i.scdn.co/image/ab67616d00004851c22e9dd3a02fe8a5fcd15178',
        width: 64,
      },
    ],
  },
  {
    id: '7DdyIz0ujbWhkCHtgvCiBh',
    name: 'Squale (feat. Chich)',
    popularity: 54,
    duration_ms: 234373,
    explicit: 1,
    artists: "[\"Jok'air\", 'Chich']",
    id_artists: "['2kIs76sEGiulKeqetZq6ua', '66t9jFMMHlihDiM2urzKHs']",
    release_date: '2017-02-24',
    danceability: 0.703,
    energy: 0.495,
    key: 6,
    loudness: -6.356,
    mode: 1,
    speechiness: 0.0584,
    acousticness: 0.252,
    instrumentalness: 0.0,
    liveness: 0.124,
    valence: 0.449,
    tempo: 117.068,
    time_signature: 4,
    preview_url:
      'https://p.scdn.co/mp3-preview/953dfbcb5c141a83da67a9c8afbe5ea827aed023?cid=f3f14386465b4ac1b96c23194a0aec4b',
    'album.images': [
      {
        height: 640,
        url: 'https://i.scdn.co/image/ab67616d0000b273fb06cdf470849b9eeb38d68c',
        width: 640,
      },
      {
        height: 300,
        url: 'https://i.scdn.co/image/ab67616d00001e02fb06cdf470849b9eeb38d68c',
        width: 300,
      },
      {
        height: 64,
        url: 'https://i.scdn.co/image/ab67616d00004851fb06cdf470849b9eeb38d68c',
        width: 64,
      },
    ],
  },
  {
    id: '2EdAzvb3Qc6E8h8glHD9jF',
    name: 'Corazón partío',
    popularity: 55,
    duration_ms: 300107,
    explicit: 0,
    artists: "['Alejandro Sanz']",
    id_artists: "['5sUrlPAHlS9NEirDB8SEbF']",
    release_date: '2001-11-19',
    danceability: 0.532,
    energy: 0.859,
    key: 5,
    loudness: -6.783,
    mode: 1,
    speechiness: 0.0874,
    acousticness: 0.578,
    instrumentalness: 0.0,
    liveness: 0.986,
    valence: 0.5,
    tempo: 117.081,
    time_signature: 5,
    preview_url:
      'https://p.scdn.co/mp3-preview/943f13933c9d16a722a34cf77f3ae3fadb8e0351?cid=f3f14386465b4ac1b96c23194a0aec4b',
    'album.images': [
      {
        height: 640,
        url: 'https://i.scdn.co/image/ab67616d0000b2730eb3e415c8a372c1441e1d32',
        width: 640,
      },
      {
        height: 300,
        url: 'https://i.scdn.co/image/ab67616d00001e020eb3e415c8a372c1441e1d32',
        width: 300,
      },
      {
        height: 64,
        url: 'https://i.scdn.co/image/ab67616d000048510eb3e415c8a372c1441e1d32',
        width: 64,
      },
    ],
  },
  {
    id: '5zG4ymJbbNN5Rmjt6VkVNs',
    name: 'Дым',
    popularity: 56,
    duration_ms: 219961,
    explicit: 1,
    artists: "['Lesha Svik']",
    id_artists: "['5uMClxnfkye15tg63lrwU8']",
    release_date: '2018-04-27',
    danceability: 0.833,
    energy: 0.513,
    key: 5,
    loudness: -6.509,
    mode: 0,
    speechiness: 0.0926,
    acousticness: 0.389,
    instrumentalness: 3.53e-5,
    liveness: 0.116,
    valence: 0.251,
    tempo: 118.052,
    time_signature: 4,
    preview_url:
      'https://p.scdn.co/mp3-preview/e9370f95c4f4b0b1915cf968a20f591e407e2e0d?cid=f3f14386465b4ac1b96c23194a0aec4b',
    'album.images': [
      {
        height: 640,
        url: 'https://i.scdn.co/image/ab67616d0000b2739f339b1cf1fcd481a4cc7b08',
        width: 640,
      },
      {
        height: 300,
        url: 'https://i.scdn.co/image/ab67616d00001e029f339b1cf1fcd481a4cc7b08',
        width: 300,
      },
      {
        height: 64,
        url: 'https://i.scdn.co/image/ab67616d000048519f339b1cf1fcd481a4cc7b08',
        width: 64,
      },
    ],
  },
  {
    id: '5PRN8ql17R8rcKnHo6Ajlk',
    name: 'Feeding Line',
    popularity: 54,
    duration_ms: 268627,
    explicit: 0,
    artists: "['Boy & Bear']",
    id_artists: "['2NqgE99Ll5vOTvmbN7O2R6']",
    release_date: '2011-08-05',
    danceability: 0.641,
    energy: 0.648,
    key: 6,
    loudness: -6.094,
    mode: 0,
    speechiness: 0.0265,
    acousticness: 0.000849,
    instrumentalness: 0.0217,
    liveness: 0.121,
    valence: 0.234,
    tempo: 117.944,
    time_signature: 4,
    preview_url: null,
    'album.images': [
      {
        height: 640,
        url: 'https://i.scdn.co/image/ab67616d0000b273bd569217f48c0d942c615d15',
        width: 640,
      },
      {
        height: 300,
        url: 'https://i.scdn.co/image/ab67616d00001e02bd569217f48c0d942c615d15',
        width: 300,
      },
      {
        height: 64,
        url: 'https://i.scdn.co/image/ab67616d00004851bd569217f48c0d942c615d15',
        width: 64,
      },
    ],
  },
  {
    id: '6wBMTv8yTiNh50fqTkT0JC',
    name: 'Everybody Everybody',
    popularity: 56,
    duration_ms: 247002,
    explicit: 0,
    artists: "['Black Box']",
    id_artists: "['6tsRo8ErXzpHk3tQeH6GBW']",
    release_date: '1990-04-09',
    danceability: 0.712,
    energy: 0.785,
    key: 5,
    loudness: -6.418,
    mode: 0,
    speechiness: 0.0386,
    acousticness: 0.00363,
    instrumentalness: 6.95e-6,
    liveness: 0.0878,
    valence: 0.975,
    tempo: 117.643,
    time_signature: 4,
    preview_url:
      'https://p.scdn.co/mp3-preview/429aa6cab6f7e6ae415541f99d0ba306ee04f6f0?cid=f3f14386465b4ac1b96c23194a0aec4b',
    'album.images': [
      {
        height: 640,
        url: 'https://i.scdn.co/image/ab67616d0000b27370fa2be40cafc2fb92cd3fba',
        width: 640,
      },
      {
        height: 300,
        url: 'https://i.scdn.co/image/ab67616d00001e0270fa2be40cafc2fb92cd3fba',
        width: 300,
      },
      {
        height: 64,
        url: 'https://i.scdn.co/image/ab67616d0000485170fa2be40cafc2fb92cd3fba',
        width: 64,
      },
    ],
  },
];
