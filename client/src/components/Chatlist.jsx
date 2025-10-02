import React, { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import SearchChatBar from '../modals/ModalSearchChats';
import CreateChatRoom from '../modals/ModalCreateChat';
import DeleteChat from '../modals/ModalDeleteChat';
import LeaveChat from '../modals/ModalLeaveChat';
import ErrorChat from '../modals/ModalErrorChat';
import { ChatContext } from '../context/ChatUseContext';
import { AuthContext } from '../context/AuthContext';

function Chatlist({ socket }) {
  const {
    data,
    dispatch,
    chatlist,
    setChatlist,
    messageTexts,
    activate_leave_chat,
    setLeaveButton,
    activate_delete_chat,
    setDeleteButton,
    current_chatname,
    setCurrentChatName,
    current_chatid,
    setCurrentChatID,
  } = useContext(ChatContext);
  const { accessToken, currentUsername } = useContext(AuthContext);

  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showCreateChatModal, setCreateChatModal] = useState(false);

  const [showLeaveModal, setLeaveModal] = useState(false);
  const [showDeleteModal, setDeleteModal] = useState(false);

  const [showChatExistModal, setChatExistModal] = useState(false);

  const [scrollPosition, setScrollPosition] = useState(0);

  const navigate = useNavigate();

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
    };

    getChannelsList();
  }, [data.id, accessToken, messageTexts]); //CHATLIST CAUSES AN INFINITE LOOP

  const handleChannelClick = async (chat) => {
    //CHECK IF USER IS STILL AUTHORIZED
    const response = await fetch('http://localhost:3001/users/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (response.status === 401) {
      //NO LONGER AUTHORIZED
      navigate('/', { replace: true });
    } else {
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
        toggleChatExist();
      }
    }
  };

  const verifyActivity = async () => {
    const response = await fetch('http://localhost:3001/users/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    return response.status;
  };

  //ADD TOGGLE FUNCTIONS HERE
  const toggleSearchChat = async () => {
    const verify_result = await verifyActivity();
    if (verify_result === 401) {
      //NO LONGER AUTHORIZED
      navigate('/', { replace: true });
    } else {
      setShowSearchModal(!showSearchModal);
    }
    // setShowSearchModal(!showSearchModal);
  };

  const toggleCreateChat = async () => {
    const verify_result = await verifyActivity();
    if (verify_result === 401) {
      //NO LONGER AUTHORIZED
      navigate('/', { replace: true });
    } else {
      setCreateChatModal(!showCreateChatModal);
    }
    // setCreateChatModal(!showCreateChatModal);
  };

  const toggleLeaveChat = async () => {
    const verify_result = await verifyActivity();
    if (verify_result === 401) {
      //NO LONGER AUTHORIZED
      navigate('/', { replace: true });
    } else {
      setLeaveModal(!showLeaveModal);
    }
    // setLeaveModal(!showLeaveModal);
  };

  const toggleDeleteChat = async () => {
    const verify_result = await verifyActivity();
    if (verify_result === 401) {
      //NO LONGER AUTHORIZED
      navigate('/', { replace: true });
    } else {
      setDeleteModal(!showDeleteModal);
    }
    // setDeleteModal(!showDeleteModal);
  };

  const toggleChatExist = async () => {
    setChatExistModal(!showChatExistModal);
  };

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
      <div className="chatInfo">
        <div>
          <button onClick={toggleCreateChat}>Create Chat Room</button>
          <CreateChatRoom
            isOpen={showCreateChatModal}
            handleClose={toggleCreateChat}></CreateChatRoom>

          <button onClick={toggleSearchChat}>Search Chat</button>
          <SearchChatBar
            isOpen={showSearchModal}
            handleClose={toggleSearchChat}></SearchChatBar>
        </div>
        <div>
          <button disabled={activate_leave_chat} onClick={toggleLeaveChat}>
            Leave
          </button>
          <LeaveChat
            isOpen={showLeaveModal}
            handleClose={toggleLeaveChat}
            chatid={current_chatid}
            chatname={current_chatname}
            setChatName={setCurrentChatName}
            setLeave={setLeaveButton}></LeaveChat>

          <button disabled={activate_delete_chat} onClick={toggleDeleteChat}>
            Delete
          </button>
          <DeleteChat
            isOpen={showDeleteModal}
            handleClose={toggleDeleteChat}
            chatid={current_chatid}
            chatname={current_chatname}
            setChatName={setCurrentChatName}
            setDelete={setDeleteButton}></DeleteChat>
        </div>
        <div>
          <ErrorChat
            isOpen={showChatExistModal}
            handleClose={toggleChatExist}></ErrorChat>
        </div>
      </div>
      <div ref={chatRef} onScroll={handleScroll} className="chatList">
        {chatlist.map((chat) => {
          const lastIndex = chat.messages.length;
          return (
            <div className="userChat" onClick={() => handleChannelClick(chat)}>
              <img src="14562316.png" className="chatImg" />
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
