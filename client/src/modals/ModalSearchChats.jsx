import './Modal.css';
import { X, Search } from 'react-feather';
import React, { useContext, useState } from 'react';
import { ChatContext } from '../context/ChatUseContext';
import { AuthContext } from '../context/AuthContext';
import { url } from '../configURL/configURL';

function SearchChatBar({ isOpen, handleClose }) {
  const {
    setChatlist,
    dispatch,
    setLeaveButton,
    setDeleteButton,
    setCurrentChatID,
    setCurrentChatName,
  } = useContext(ChatContext);

  const { accessToken } = useContext(AuthContext);

  const [search_input, setSearchInput] = useState('');
  const [search_list, setSearchList] = useState([]);

  const [error, setError] = useState('');

  const handleSearchChat = async (e) => {
    setSearchInput(e.target.value);
    if (e.target.value.length === 0) {
      setSearchList([]);
    }
  };

  const searchChatResults = async (e) => {
    e.preventDefault();
    try {
      const body = {
        searchchats: search_input,
      };
      //https://chatapplivedemo.com
      //http://localhost:8080
      const response = await fetch(`${url}/users/allchannels`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      setSearchList(result);
    } catch (error) {
      console.log(error.message);
    }
  };

  const joinHandle = async (e) => {
    e.preventDefault();
    //CHECK IF USER IS STILL AUTHORIZED
    setSearchList([]);
    if (search_input === '') {
      setError('Please enter search input');
    } else {
      const response = await fetch(
        `${url}/users/chatexists?input=${search_input}`,
        {
          credentials: 'include',
        }
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

          const get_chat_id = await fetch(`${url}/users/channelid`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          });
          const result_chat_id = await get_chat_id.json();
          joinChatChannel(result_chat_id);
          setError('');
          setSearchInput('');
          setSearchList([]);
          handleClose();
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

      // const join_chat = await fetch(
      //   'http://localhost:3001/users/joinchatchannel',
      //   {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //       authorization: accessToken,
      //     },
      //     body: JSON.stringify(body),
      //   }
      // );
      await fetch(`${url}/users/joinchatchannel`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          authorization: accessToken,
        },
        body: JSON.stringify(body),
      });
    } catch (error) {
      console.log(error.message);
    }

    //UPDATE CHAT LIST
    const getChannelsList = async () => {
      const channelsList = await fetch(`${url}/users/userschannels`, {
        headers: { authorization: accessToken },
        credentials: 'include',
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
    const get_chat = await fetch(`${url}/users/chat`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: id }),
    });
    const joined_chat = await get_chat.json();
    dispatch({ type: 'CHAT_CHANGE', payload: joined_chat });
    setCurrentChatID(joined_chat.id);
    setCurrentChatName(joined_chat.channelname);
    setLeaveButton(false);
    setDeleteButton(true);
  };

  // check if search input already exists in users channel list
  const checkUserChatExists = async () => {
    const response = await fetch(`${url}/users/userschannels`, {
      headers: { authorization: accessToken },
      credentials: 'include',
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
    <div
      className={isOpen ? 'modal display-block' : 'modal display-none'}
      onClick={(e) => {
        // console.log('modal display classname: ', e.target.className);
        if (e.target.className === 'modal display-block') {
          closeModal();
        }
      }}>
      <section className="modal-main chatsearch">
        <div className="modal-header">
          <h2>Search Chat</h2>
          <X className="closeIcon" onClick={closeModal} />
        </div>
        <div className="modal-body">
          <div className="searchBox">
            <input
              type="text"
              placeholder="Search for chat channel..."
              value={search_input}
              onChange={handleSearchChat}
            />
            <button onClick={searchChatResults}>
              <Search size={18} />
            </button>
          </div>
          {search_list.length !== 0 && (
            <div className="searchResult">
              {search_list.map((result) => {
                return (
                  <div
                    className="chatItem"
                    target="_blank"
                    onClick={() => chatResult(result)}>
                    <p>{result.channelname}</p>
                  </div>
                );
              })}
            </div>
          )}

          {error && <p className="errorText">{error}</p>}
        </div>
        <div className="modal-footer">
          <button className="cancelBtn" onClick={closeModal}>
            Cancel
          </button>
          <button className="confirmBtn" onClick={joinHandle}>
            Join
          </button>
        </div>
      </section>
    </div>
  );
}

export default SearchChatBar;
