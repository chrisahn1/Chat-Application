import './Modal.css';
import { X } from 'react-feather';
import React, { useContext, useEffect, useState } from 'react';
import { ChatContext } from '../context/ChatUseContext';
import { AuthContext } from '../context/AuthContext';

function LeaveChat({
  isOpen,
  handleClose,
  chatid,
  chatname,
  setChatName,
  setLeave,
}) {
  const { setChatlist, setMessageTexts } = useContext(ChatContext);

  const { accessToken } = useContext(AuthContext);

  const leaveChatHandle = async () => {
    try {
      //check if channel still exists when trying to leave
      const body = {
        chat_id: chatid,
      };

      const response = await fetch(
        'http://localhost:3001/users/leavechatchannel',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: accessToken,
          },
          body: JSON.stringify(body),
        }
      );

      const result = await response.json();
      // console.log('channel left: ', result);
      setLeave(true);
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
      <section className="modal-main chatleave">
        <X className="closeIcon" onClick={handleClose} />
        <h3 style={{ color: 'black' }}>Leaving {chatname}. Are you sure?</h3>
        <div>
          <button type="button" onClick={leaveChatHandle}>
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

export default LeaveChat;
