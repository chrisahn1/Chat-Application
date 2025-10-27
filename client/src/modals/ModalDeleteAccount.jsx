import './Modal.css';
import { X } from 'react-feather';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function ModalDeleteAccount({ isOpen, handleClose }) {
  const {
    accessToken,
    setAccessToken,
    setCurrentUsername,
    setIsAuth,
    setTimeInterval,
    setTokenExp,
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
      console.log('remove chat links: ', result);
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
      console.log('remove host links: ', result);
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
      console.log('remove all users channels: ', result);
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
      console.log('remove user: ', response);
    } catch (err) {
      console.error(err.message);
    }
  };

  const deleteUser = async () => {
    handleClose();
    navigate('/');

    removeChatLinks();
    removeHostLinks();
    removeAllUsersChannels();
    removeUser();

    const response = await fetch('http://localhost:3001/users/logout', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    const result = await response.json();
    console.log('logging out: ', result);
    setAccessToken({});
    setCurrentUsername('');
    setIsAuth(false);
    setTimeInterval(false);
    setTokenExp(null);
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
