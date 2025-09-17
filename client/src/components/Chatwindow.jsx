import { useNavigate, useLocation, Link } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';
import axiosJWT from '../axiosFolder/AxiosFile';

function Chatwindow({ socket }) {
  const navigate = useNavigate();

  const logout = async () => {
    await axiosJWT.delete('/users/logout', {
      withCredentials: true,
    });
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
