import { useNavigate } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosJWT from '../axiosFolder/AxiosFile';

function Chatwindow({ socket }) {
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

  const [disableSend, setDisableSend] = useState(true);

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

  return (
    <div className="chatwindow">
      <div className="chatInfo">
        <div>
          <button onClick={logout}>Logout</button>
          <button onClick={settings}>Settings</button>
        </div>
      </div>
    </div>
  );
}

export default Chatwindow;
