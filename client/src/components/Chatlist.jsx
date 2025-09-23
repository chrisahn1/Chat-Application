import React, { useContext, useEffect, useState, useRef } from 'react';

import { ChatContext } from '../context/ChatUseContext';
import { AuthContext } from '../context/AuthContext';

function Chatlist({ socket }) {
  const {
    data,
    dispatch,
    chatlist,
    setChatlist,
    messageTexts,
    joinSignal,
    leaveSignal,
    createSignal,
    deleteSignal,
  } = useContext(ChatContext);
  const { accessToken, currentUsername } = useContext(AuthContext);

  const [activate_leave_chat, setLeaveButton] = useState(true);
  const [activate_delete_chat, setDeleteButton] = useState(true);

  //ADD MODAL STATES HERE

  const [current_chatname, setCurrentChatName] = useState('');
  const [current_chatid, setCurrentChatID] = useState([]);

  const [scrollPosition, setScrollPosition] = useState(0);

  // console.log('chatlist: ', chatlist);

  useEffect(() => {
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

      // return () => {
      //     channelsList();
      // };
    };

    getChannelsList();
  }, [data.id, accessToken, messageTexts]); //CHATLIST CAUSES AN INFINITE LOOP

  const handleChannelClick = async (chat) => {
    //FIRST CHECKING IF CHAT EXIST
    const response = await fetch(
      `http://localhost:3001/users/chatstillexists/${chat.id}`,
      {
        headers: { authorization: accessToken },
      }
    )
      .then((response) => response.json())
      .then((exists) => {
        return exists;
      });

    if (response === true) {
      dispatch({ type: 'CHAT_CHANGE', payload: chat });

      if (chat.host[1] === currentUsername) {
        setLeaveButton(true);
        setDeleteButton(false);
      } else {
        setLeaveButton(false);
        setDeleteButton(true);
      }
      if (current_chatid !== null) {
        socket.emit('leave_room', current_chatid);
      }
      setCurrentChatName(chat.channelname);
      setCurrentChatID(chat.id);
      //SOCKET IO HERE TO JOIN ROOM
      // socket.emit('join_room', chat.id);
    } else {
      //CHAT DOESNT EXIST
      console.log('chat doesnt exist');
      // toggleChatExist();
    }
  };

  //ADD TOGGLE FUNCTIONS HERE

  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = scrollPosition;
    }
  }, [chatlist]);

  const handleScroll = (event) => {
    setScrollPosition(event.target.scrollTop);
  };

  return (
    <div className="chattexts">
      <div className="chatInfo">Add toggle buttons here</div>
      <div ref={chatRef} onScroll={handleScroll} className="chatList">
        {chatlist.map((chat) => {
          const lastIndex = chat.messages.length;
          return (
            <div className="userChat" onClick={() => handleChannelClick(chat)}>
              <img
                src="user-blue-icon-isolated-on-white-background-free-vector-3667259571.jpg"
                className="userChatImg"
              />
              <span>{chat.channelname}</span>
              {lastIndex > 0 && (
                <p>
                  {chat.messages[lastIndex - 1].message.slice(0, 9)}
                  {'...'}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Chatlist;
