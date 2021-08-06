import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components/macro';
import axios from 'axios';
import Result from '../components/Result';

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

const Header = ({ players }) => {
  const [player] = useState(new Audio(null));
  const history = useHistory();
  const [busy, setBusy] = useState(false);
  const [historyList, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [expandedHistory, setExpanded] = useState([]);
  const [selectedHistory, setSelected] = useState(null);

  useEffect(() => {
    const body = {
      username: localStorage.getItem('personalifyUser'),
    };
    axios
      .post(`${process.env.REACT_APP_API_URL}/history`, body)
      .then((res) => {
        setHistory(res.data.history);
        setBusy(false);
      })
      .catch((err) => {
        console.log(err);
        // toast.error(`Error: ${err}`);
      });
  }, []);

  const getHistory = () => {
    setShowHistory(!showHistory);
    setSelected(null);
    setExpanded([]);
  };

  const expandHistory = (id) => {
    const body = {
      username: localStorage.getItem('personalifyUser'),
    };
    axios
      .post(`${process.env.REACT_APP_API_URL}/history/${id}`, body)
      .then((res) => {
        const data = res.data[`${id}`].map((item) => {
          item.images = JSON.parse(item.images);
          return item;
        });
        setExpanded(data);
        setSelected(selectedHistory === id ? null : id);
      })
      .catch((err) => {
        console.log(err);
        // toast.error(`Error: ${err}`);
      });
  };

  const logout = () => {
    localStorage.removeItem('personalifyUser');
    history.push('/');
  };

  return (
    <HeaderContainer>
      <h1>Personalify</h1>
      {/* TODO: These should be icons */}
      <UserActions>
        <div>
          <Button disabled={busy} onClick={() => getHistory()}>
            History
          </Button>
          <HistoryTab show={showHistory && historyList.length > 0 ? 'block' : 'none'}>
            {historyList.map((item) => (
              <>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    expandHistory(item.id);
                  }}
                >
                  <b>{item.date}</b>
                </div>
                <hr size='1' />
                {selectedHistory === item.id && (
                  <>
                    {expandedHistory.map((song) => (
                      <Result
                        player={player}
                        song_id={song.id}
                        track={song.track}
                        artists={formatArtists(song.artists)}
                        images={song.images}
                        preview={song.preview}
                        history={true}
                      />
                    ))}
                  </>
                )}
              </>
            ))}
          </HistoryTab>
        </div>
        <div>
          <Button onClick={() => logout()}>Logout</Button>
        </div>
      </UserActions>
    </HeaderContainer>
  );
};

export default Header;

const HeaderContainer = styled.div`
  position: relative;
  background-color: #ff5;
  // background-color: #494d5f;
  padding: 10px;

  h1 {
    color: #161748;
    margin: 0;
    cursor: pointer;
    width: fit-content;
  }
`;

const UserActions = styled.div`
  position: absolute;
  right: 10px;
  top: 10px;
  display: flex;

  > div {
    padding: 5px;
  }
`;

const Button = styled.button`
  background: #f75990;
  border: none;
  padding: 15px 30px;
  cursor: pointer;
  font-size: 20px;
  font-weight: bold;
  align-self: center;
  width: 100%;

  padding: 8px 15px;
  font-size: 12px;

  &:disabled {
    background-color: silver;
    color: dimgray;
    cursor: not-allowed;
  }
`;

const HistoryTab = styled.div`
  background-color: #777;
  color: white;
  padding: 18px;
  border: none;
  text-align: left;
  outline: none;
  font-size: 15px;

  display: ${(props) => props.show};

  > div:first-child {
    cursor: pointer;
  }
`;
