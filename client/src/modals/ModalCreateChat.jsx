import './Modal.css';
import { X } from 'react-feather';
import React, { useContext, useEffect, useState } from 'react';
import { ChatContext } from '../context/ChatUseContext';
import { AuthContext } from '../context/AuthContext';

function CreateChatRoom({ isOpen, handleClose }) {
  const { setChatlist } = useContext(ChatContext);

  const { accessToken, currentUsername } = useContext(AuthContext);

  const [create_input, setCreateInput] = useState('');

  const handleCreateInput = async (e) => {
    setCreateInput(e.target.value);
  };

  const createHandle = async (e) => {
    let letters = /^[a-zA-Z]+$/;
    if (create_input === '') {
      console.log('Please enter name for new chat channel');
    } else if (letters.test(create_input.charAt(0).toLowerCase()) === false) {
      console.log('First character must be a letter');
    } else if (
      letters.test(create_input.charAt(0).toLowerCase()) === true &&
      create_input.length < 5
    ) {
      console.log('Name must be at least 5 characters long');
    } else {
      const res_checkexists = await checkChatExists();
      if (res_checkexists === true) {
        // ERROR CHAT DISPLAY
        console.log('chat name already exists');
      } else {
        const userid = await fetch('http://localhost:3001/users/userid', {
          headers: { authorization: accessToken },
        })
          .then((response) => response.json())
          .then((userID) => {
            return userID;
          });

        createChatChannel(userid, currentUsername, create_input);

        handleClose();
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

        // return () => {
        //     channelsList();
        // };
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

  return (
    <div className={isOpen ? 'modal display-block' : 'modal display-none'}>
      <section className="modal-main">
        {/* <div className='search'>
            <div className='searchChatInput'>
                <input type='text' placeholder='Create Chat Channel...'
                value={create_input}
                onChange={handleCreateInput} />
            </div>
            <div>
                <button type='button' onClick={createHandle}>Create</button>
                <button type='button' onClick={handleClose}>Cancel</button>
            </div>
            </div> */}
        <div className="searchChatInput">
          <input
            type="text"
            placeholder="Create Chat Channel..."
            value={create_input}
            onChange={handleCreateInput}
          />
        </div>
        <div className="footer">
          <button type="button" onClick={createHandle}>
            Create
          </button>
          <button type="button" onClick={handleClose}>
            Cancel
          </button>
        </div>
        <X />
        {/* <button type='button' onClick={createHandle}>Create</button>
            <button type='button' onClick={handleClose}>Cancel</button> */}
      </section>
    </div>
  );
}

export default CreateChatRoom;
