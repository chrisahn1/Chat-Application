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

  return (
    <div className="chatwindow">
      <div className="chatInfo">
        <div>
          <button onClick={logout}>Logout</button>
        </div>
      </div>
    </div>
  );
}

export default Chatwindow;
