import { useNavigate } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';
import { ChatContext } from '../context/ChatUseContext';
import { AuthContext } from '../context/AuthContext';
import axiosJWT from '../axiosFolder/AxiosFile';
import Messages from './Messages';
import ErrorChat from '../modals/ModalErrorChat';
import CharacterLimit from '../modals/ModalCharacterLimit';

function Chatdisplay({ socket }) {
  const navigate = useNavigate();

  const {
    currentUsername,
    setCurrentUsername,
    currentUserID,
    setCurrentUserID,
    accessToken,
    setAccessToken,
    setIsAuth,
    setLoading,
  } = useContext(AuthContext);

  const {
    data,
    dispatch,
    messageTexts,
    setMessageTexts,
    message_text,
    setMessage,
    setChatlist,
  } = useContext(ChatContext);

  const [disableSend, setDisableSend] = useState(true);

  const [showChatExistModal, setChatExistModal] = useState(false);
  const [showCharLimitModal, setCharLimitModal] = useState(false);

  const logout = async () => {
    //dispatch init to null in order to reset setmessagetexts
    const INIT_STATE = {
      id: 'null',
      chat: {},
    };
    dispatch({ type: 'CHAT_CHANGE', payload: INIT_STATE });
    await axiosJWT.delete('/users/logout', {
      withCredentials: true,
    });
    setIsAuth(false);
    setLoading(true);
    setAccessToken({});
    setCurrentUsername('');
    setCurrentUserID('');
    setMessageTexts([]);
    navigate('/', { replace: true });
  };

  const settings = async () => {
    //AUTHENTICATE BEFORE GOING TO SETTINGS
    //CHECK IF USER IS STILL AUTHORIZED
    const response = await fetch('http://localhost:3001/users/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (response.status === 401) {
      //NO LONGER AUTHORIZED
      setIsAuth(false);
      navigate('/', { replace: true });
    } else {
      navigate('/settings');
    }
  };

  const toggleChatExist = () => {
    setChatExistModal(!showChatExistModal);
  };

  const toggleCharLimit = () => {
    setCharLimitModal(!showCharLimitModal);
  };

  const handleChange = (event) => {
    setMessage(event.target.value);
    //DISPLAY CHARACTER COUNT SOMEWHERE CLOSE TO MESSAGE INPUT TO TRACK USER INPUT
    // console.log('character count: ', message_text.length + 1);
  };

  useEffect(() => {
    const printMessageList = async () => {
      const textList = fetch(
        `http://localhost:3001/users/channeltexts/${data.id}`
      )
        .then((response) => response.json())
        .then((chattextlist) => {
          return chattextlist;
        });
      try {
        const a = await textList;
        setMessageTexts(a);
      } catch (err) {
        console.error(err.message);
      }
    };

    printMessageList();

    const chatExists = async () => {
      if (data.id !== 'null') {
        setDisableSend(false);
      }
    };

    chatExists();
  }, [data.id]);

  const sendMessage = async (e) => {
    e.preventDefault();
    //CHECK IF USER IS STILL AUTHORIZED
    const response = await fetch('http://localhost:3001/users/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (response.status === 401) {
      //NO LONGER AUTHORIZED
      setIsAuth(false);
      navigate('/', { replace: true });
    } else {
      //IF VERIFIED, THEN PROCEED
      if (message_text.length > 150) {
        toggleCharLimit();
      } else {
        if (data.id === 'null') {
          console.log('Please click on chat to send message');
          toggleChatExist();
        } else {
          const response = await fetch(
            `http://localhost:3001/users/chatstillexists/${data.id}`,
            {
              headers: { authorization: accessToken },
            }
          )
            .then((response) => response.json())
            .then((exists) => {
              return exists;
            });

          if (response === true) {
            // get userid
            const time = new Date();

            const messageData = {
              value: {
                authorID: currentUserID,
                author: currentUsername,
                message: message_text,
                month: new Date(Date.now()).getMonth(),
                day: new Date(Date.now()).getDate(),
                year: new Date(Date.now()).getFullYear(),
                time: time.toLocaleTimeString(),
                chatid: data.id,
              },
            };
            await socket.emit('send_message', messageData);
            setMessageTexts((list) => [...list, messageData]);
            setMessage('');

            //UPDATE NEW CHAT LIST
            const getChannelsList = async () => {
              const channelsList = fetch(
                'http://localhost:3001/users/userschannels',
                {
                  headers: { authorization: accessToken },
                }
              )
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
          } else {
            //CANT SEND MESSAGE SINCE CHAT DOESNT EXIST
            toggleChatExist();
          }
        }
      }
    }
  };

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setMessageTexts((list) => [...list, data]);
    });

    return () => {
      socket.off('receive_message');
    };
  }, [socket]);

  return (
    <div className="chatDisplay">
      <div className="chatInfo">
        <div>
          <h2>{data.chat.channelname}</h2>
        </div>
        <div>
          <button onClick={logout}>Logout</button>
          <button onClick={settings}>Settings</button>
        </div>
      </div>
      <Messages messagelist={messageTexts} />
      <form className="messageinput">
        <div className="messageTextLengthDisplay">
          {message_text.length + '/150'}
        </div>
        <input
          className="sendMsgInput"
          type="text"
          placeholder="Send Message"
          value={message_text}
          onChange={handleChange}
        />
        <button
          disabled={disableSend}
          className="sendbutton"
          onClick={sendMessage}>
          Send
        </button>
      </form>
      <div>
        <ErrorChat
          isOpen={showChatExistModal}
          handleClose={toggleChatExist}></ErrorChat>
        <CharacterLimit
          isOpen={showCharLimitModal}
          handleClose={toggleCharLimit}></CharacterLimit>
      </div>
    </div>
  );
}

export default Chatdisplay;
