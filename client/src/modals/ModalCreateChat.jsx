import './Modal.css';
import { X } from 'react-feather';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatContext } from '../context/ChatUseContext';
import { AuthContext } from '../context/AuthContext';
import UseVerifyActivity from '../hooks/useVerifyActivity';

function CreateChatRoom({ isOpen, handleClose }) {
  const { setChatlist, dispatch, setDeleteButton, setCurrentChatID } =
    useContext(ChatContext);

  const { accessToken, currentUsername, setIsAuth } = useContext(AuthContext);

  const [create_input, setCreateInput] = useState('');

  const [error, setError] = useState('');

  const navigate = useNavigate();
  const verify = UseVerifyActivity();

  const handleCreateInput = async (e) => {
    setCreateInput(e.target.value);
  };

  const createHandle = async (e) => {
    //CHECK IF USER IS STILL AUTHORIZED
    const response = await verify();
    if (response.status === 401) {
      //NO LONGER AUTHORIZED
      setIsAuth(false);
      navigate('/', { replace: true });
    } else {
      let letters = /^[a-zA-Z]+$/;
      if (create_input === '') {
        setError('Please enter new chat channel');
      } else if (letters.test(create_input.charAt(0).toLowerCase()) === false) {
        setError('First character must be a letter');
      } else if (
        letters.test(create_input.charAt(0).toLowerCase()) === true &&
        create_input.length < 5
      ) {
        setError('Name must be at least 5 characters long');
      } else if (
        letters.test(create_input.charAt(0).toLowerCase()) === true &&
        create_input.length > 30
      ) {
        setError('Name cannot be more than 30 characters');
      } else {
        const res_checkexists = await checkChatExists();
        if (res_checkexists === true) {
          // ERROR CHAT DISPLAY
          setError('Chat name already exists');
        } else {
          const userid = await fetch('http://localhost:3001/users/userid', {
            headers: { authorization: accessToken },
          })
            .then((response) => response.json())
            .then((userID) => {
              return userID;
            });

          createChatChannel(userid, currentUsername, create_input);
          setError('');
          setCreateInput('');
          handleClose();
        }
      }
    }
  };

  const createChatChannel = async (userid, username, createinput) => {
    try {
      const body = {
        host: [String(userid), username],
        create_chat_name: createinput,
      };

      const response = await fetch('http://localhost:3001/users/createchat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: accessToken,
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      dispatch({ type: 'CHAT_CHANGE', payload: result.rows[0] });
      setCurrentChatID(result.rows[0].id);
      setDeleteButton(false);
      // console.log('created chat: ', result);
    } catch (error) {
      console.log(error.message);
    }

    try {
      const body = {
        create_chat_name: createinput,
      };

      const response = await fetch(
        `http://localhost:3001/users/createchatlink/${userid}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }
      );

      const result = await response.json();
      // console.log('created chat: ', result);

      //UPDATED CHATLIST
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
    } catch (error) {
      console.log(error.message);
    }
  };

  const checkChatExists = async () => {
    try {
      const body = {
        input: create_input,
      };

      const response = await fetch(
        'http://localhost:3001/users/chatexistsverify',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }
      );

      const result = await response.json();

      return result;
    } catch (error) {
      console.log(error.message);
    }
  };

  const closeModal = async () => {
    setError('');
    setCreateInput('');
    handleClose();
  };

  return (
    <div className={isOpen ? 'modal display-block' : 'modal display-none'}>
      <section className="modal-main chatcreate">
        <div className="search">
          <X className="closeIcon" onClick={closeModal} />
          <h2 style={{ color: 'black' }}>Create Chat</h2>
          <div className="createChat">
            <input
              className="createChatInput"
              type="text"
              placeholder="Create Chat Channel..."
              value={create_input}
              onChange={handleCreateInput}
            />
            <button type="button" onClick={createHandle}>
              Create
            </button>
            <button type="button" onClick={closeModal}>
              Cancel
            </button>
          </div>
          <div>{error && <p style={{ color: 'black' }}>{error}</p>}</div>
        </div>
      </section>
    </div>
  );
}

export default CreateChatRoom;
