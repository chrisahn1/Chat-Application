import './Modal.css';
import { X } from 'react-feather';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosJWT from '../axiosFolder/AxiosFile';
import { AuthContext } from '../context/AuthContext';

function ModalDeleteAccount({ isOpen, handleClose }) {
  const {
    accessToken,
    setAccessToken,
    setCurrentUsername,
    setIsAuth,
    setLoading,
  } = useContext(AuthContext);

  const navigate = useNavigate();

  const removeChatLinks = async () => {
    try {
      const response = await fetch(
        'http://localhost:3001/users/deleteusersalllinks',
        {
          method: 'DELETE',
          headers: { authorization: accessToken },
        }
      );
      const result = await response.json();
    } catch (err) {
      console.log(err.message);
    }
  };

  const removeHostLinks = async () => {
    try {
      const response = await fetch(
        'http://localhost:3001/users/deletehostalllinks',
        {
          method: 'DELETE',
          headers: { authorization: accessToken },
        }
      );
      const result = await response.json();
    } catch (err) {
      console.error(err.message);
    }
  };

  const removeAllUsersChannels = async () => {
    try {
      const response = await fetch(
        'http://localhost:3001/users/deletehostallchannels',
        {
          method: 'DELETE',
          headers: { authorization: accessToken },
        }
      );
      const result = await response.json();
    } catch (err) {
      console.log(err.message);
    }
  };

  const removeUser = async () => {
    try {
      const response = await fetch('http://localhost:3001/users/delete', {
        method: 'DELETE',
        headers: { authorization: accessToken },
      });
    } catch (err) {
      console.error(err.message);
    }
  };

  const deleteUser = async () => {
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
      handleClose();
      navigate('/');

      removeChatLinks();
      removeHostLinks();
      removeAllUsersChannels();
      removeUser();

      await axiosJWT.delete('/users/logout', {
        withCredentials: true,
      });
      setAccessToken({});
      setCurrentUsername('');
      setIsAuth(false);
      setLoading(true);
    }
  };

  return (
    <div className={isOpen ? 'modal display-block' : 'modal display-none'}>
      <section className="modal-main accountdelete">
        <X className="closeIcon" onClick={handleClose} />
        <h2>Deleting Account. Are you sure?</h2>
        <div>
          <button type="button" onClick={deleteUser}>
            Delete
          </button>
          <button type="button" onClick={handleClose}>
            Cancel
          </button>
        </div>
      </section>
    </div>
  );
}

export default ModalDeleteAccount;
