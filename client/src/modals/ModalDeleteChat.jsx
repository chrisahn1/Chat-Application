import './Modal.css';
import { X } from 'react-feather';
import React, { useContext } from 'react';
import { ChatContext } from '../context/ChatUseContext';
import { AuthContext } from '../context/AuthContext';
import { url } from '../configURL/configURL';

function DeleteChat({
  isOpen,
  handleClose,
  chatid,
  chatname,
  setChatName,
  setDelete,
}) {
  const { setChatlist, setMessageTexts, dispatch } = useContext(ChatContext);

  const { accessToken } = useContext(AuthContext);

  const deleteChatHandle = async () => {
    try {
      const body = {
        chat_id: chatid,
      };
      //https://chatapplivedemo.com
      //http://localhost:8080
      const response_users_channels = await fetch(
        `${url}/users/deleteuserschannels`,
        {
          method: 'POST',
          credentials: 'include',
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

      console.log('result users channels: ', result_users_channels);

      const response_channels = await fetch(`${url}/users/deletechat`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          authorization: accessToken,
        },
        body: JSON.stringify(body),
      });

      const result_channels = await response_channels.json(response_channels);
      console.log('result channels: ', result_channels);
      setDelete(true);
      setChatName('');

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

      setMessageTexts([]);
      const INIT_STATE = {
        id: 'null',
        chat: {},
      };
      dispatch({ type: 'CHAT_CHANGE', payload: INIT_STATE });

      handleClose();
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div
      className={isOpen ? 'modal display-block' : 'modal display-none'}
      onClick={(e) => {
        // console.log('modal display classname: ', e.target.className);
        if (e.target.className === 'modal display-block') {
          handleClose();
        }
      }}>
      <section className="modal-main chatdelete">
        <X className="closeIcon" onClick={handleClose} />
        <h3 style={{ color: 'white' }}>Deleting {chatname}. Are you sure?</h3>
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
