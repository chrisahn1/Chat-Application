import { useNavigate } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';
import { ChatContext } from '../context/ChatUseContext';
import { AuthContext } from '../context/AuthContext';
import axiosJWT from '../axiosFolder/AxiosFile';
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
  } = useContext(AuthContext);

  const {
    data,
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
    await axiosJWT.delete('/users/logout', {
      withCredentials: true,
    });
    setIsAuth(false);
    setAccessToken({});
    setCurrentUsername('');
    setCurrentUserID('');

    navigate('/', { replace: true });
  };

  const settings = async () => {
    //AUTHENTICATE BEFORE GOING TO SETTINGS
    if (!accessToken) {
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
    console.log('character count: ', message_text.length + 1);
  };

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
    </div>
  );
}

export default Chatdisplay;
