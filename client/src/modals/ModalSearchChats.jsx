import './Modal.css';
import { X } from 'react-feather';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ChatContext } from '../context/ChatUseContext';
import { AuthContext } from '../context/AuthContext';

function SearchChatBar({ isOpen, handleClose }) {
  const { setChatlist, dispatch, setLeaveButton, setCurrentChatID } =
    useContext(ChatContext);

  const { accessToken } = useContext(AuthContext);

  const [search_input, setSearchInput] = useState('');
  const [search_list, setSearchList] = useState([]);

  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSearchChat = async (e) => {
    setSearchInput(e.target.value);
    if (e.target.value.length === 0) {
      setSearchList([]);
    }
  };

  const searchChatResults = async (e) => {
    e.preventDefault();
    //CHECK IF USER IS STILL AUTHORIZED
    const verify = await fetch('http://localhost:3001/users/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (verify.status === 401) {
      //NO LONGER AUTHORIZED
      navigate('/', { replace: true });
    } else {
      try {
        const body = {
          searchchats: search_input,
        };

        const response = await fetch(
          'http://localhost:3001/users/allchannels',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          }
        );

        const result = await response.json();
        setSearchList(result);
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  const joinHandle = async (e) => {
    //CHECK IF USER IS STILL AUTHORIZED
    const verify = await fetch('http://localhost:3001/users/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (verify.status === 401) {
      //NO LONGER AUTHORIZED
      navigate('/', { replace: true });
    } else {
      setSearchList([]);
      if (search_input === '') {
        setError('Please enter search input');
      } else {
        const response = await fetch(
          `http://localhost:3001/users/chatexists/${search_input}`
        )
          .then((response) => response.json())
          .then((exists) => {
            return exists;
          });
        if (response.exists === false) {
          // ERROR CHAT DISPLAY
          setError('Channel does not exist');
        } else {
          const res_chatlist = await checkUserChatExists();
          if (res_chatlist.includes(search_input)) {
            setError('Already a member');
          } else {
            const body = {
              chat_name: search_input,
            };

            const get_chat_id = await fetch(
              'http://localhost:3001/users/channelid',
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
              }
            );
            const result_chat_id = await get_chat_id.json();
            joinChatChannel(result_chat_id);
            setError('');
            setSearchInput('');
            setSearchList([]);
            handleClose();
          }
        }
      }
    }
  };

  // join chat channel
  const joinChatChannel = async (id) => {
    try {
      const body = {
        chat_id: id,
      };

      const join_chat = await fetch(
        'http://localhost:3001/users/joinchatchannel',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: accessToken,
          },
          body: JSON.stringify(body),
        }
      );
    } catch (error) {
      console.log(error.message);
    }

    //UPDATE CHAT LIST
    const getChannelsList = async () => {
      const channelsList = fetch('http://localhost:3001/users/userschannels', {
        headers: { authorization: accessToken },
      })
        .then((response) => response.json())
        .then((userchannelslist) => {
          return userchannelslist;
        });
      try {
        const a = await channelsList;
        // CHECK IF CHANNEL LIST IS EMPTY OR NOT
        // console.log('chat list: ', a);
        setChatlist(a);
      } catch (err) {
        console.error(err.message);
      }
    };

    getChannelsList();
    //DISPLAY CURRENT CHATWINDOW
    const get_chat = await fetch('http://localhost:3001/users/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: id }),
    });
    const joined_chat = await get_chat.json();
    dispatch({ type: 'CHAT_CHANGE', payload: joined_chat });
    setCurrentChatID(joined_chat.id);
    setLeaveButton(false);
  };

  // check if search input already exists in users channel list
  const checkUserChatExists = async () => {
    const response = await fetch('http://localhost:3001/users/userschannels', {
      headers: { authorization: accessToken },
    })
      .then((response) => response.json())
      .then((chatlist) => {
        return chatlist;
      });

    const res = [];
    for (let i = 0; i < response.length; i++) {
      res.push(response[i].channelname);
    }
    return res;
  };

  const chatResult = (result) => {
    setSearchInput(result.channelname);
  };

  const closeModal = async () => {
    setError('');
    setSearchInput('');
    setSearchList([]);
    handleClose();
  };

  return (
    <div className={isOpen ? 'modal display-block' : 'modal display-none'}>
      <section className="modal-main chatsearch">
        <div className="search">
          <X className="closeIcon" onClick={handleClose} />
          <h2 style={{ color: 'black' }}>Search Chat</h2>
          <div className="searchChat">
            <input
              className="searchChatInput"
              type="text"
              placeholder="Search for chat channel..."
              value={search_input}
              onChange={handleSearchChat}
            />
            <img
              src="searchiconimage.png"
              className="searchicon"
              onClick={searchChatResults}
            />
            <button type="button" onClick={joinHandle}>
              Join
            </button>
            <button type="button" onClick={closeModal}>
              Cancel
            </button>
          </div>
          {search_list.length !== 0 && (
            <div className="searchResult">
              {search_list.map((result) => {
                return (
                  <a
                    className="chatItem"
                    target="_blank"
                    onClick={() => chatResult(result)}>
                    <p>{result.channelname}</p>
                  </a>
                );
              })}
            </div>
          )}
          <div>{error && <p style={{ color: 'black' }}>{error}</p>}</div>
        </div>
      </section>
    </div>
  );
}

export default SearchChatBar;
