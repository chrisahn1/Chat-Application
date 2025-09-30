import './Modal.css';
import { X } from 'react-feather';
import React, { useContext, useEffect, useState } from 'react';
import { ChatContext } from '../context/ChatUseContext';
import { AuthContext } from '../context/AuthContext';

function DeleteChat({
  isOpen,
  handleClose,
  chatid,
  chatname,
  setChatName,
  setDelete,
}) {
  const { setChatlist, setMessageTexts } = useContext(ChatContext);

  const { accessToken } = useContext(AuthContext);

  const deleteChatHandle = async () => {
    try {
      const body = {
        chat_id: chatid,
      };

      const response_users_channels = await fetch(
        'http://localhost:3001/users/deleteuserschannels',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: accessToken,
          },
          body: JSON.stringify(body),
        }
      );

      const result_users_channels = await response_users_channels.json(
        response_users_channels
      );

      const response_channels = await fetch(
        'http://localhost:3001/users/deletechat',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: accessToken,
          },
          body: JSON.stringify(body),
        }
      );

      const result_channels = await response_channels.json(response_channels);
      setDelete(true);
      setChatName('');

      //UPDATE CHAT LIST
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

      setMessageTexts([]);

      handleClose();
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className={isOpen ? 'modal display-block' : 'modal display-none'}>
      <section className="modal-main chatdelete">
        <h3 style={{ color: 'black' }}>Deleting {chatname}. Are you sure?</h3>
        <div>
          <button type="button" onClick={deleteChatHandle}>
            Confirm
          </button>
          <button type="button" onClick={handleClose}>
            Cancel
          </button>
        </div>
      </section>
    </div>
  );
}

export default DeleteChat;
