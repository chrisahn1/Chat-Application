import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosJWT from '../axiosFolder/AxiosFile';
import { AuthContext } from '../context/AuthContext';

function ModalDeleteAccount({ isOpen, handleClose }) {
  const { accessToken, setAccessToken, setCurrentUsername } =
    useContext(AuthContext);

  const navigate = useNavigate();

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
  //NEEDED: CANT NAVIGATE BACK TO ACCOUNT AFTER DELETION
  const deleteUser = async () => {
    handleClose();
    navigate('/');

    removeUser();

    await axiosJWT.delete('/users/logout', {
      withCredentials: true,
    });
    setAccessToken({});
    setCurrentUsername('');
  };

  return (
    <div className={isOpen ? 'modal display-block' : 'modal display-none'}>
      <section className="modal-main">
        <h3>Deleting Account. Are you sure?</h3>
        <button type="button" onClick={deleteUser}>
          Delete
        </button>
        <button type="button" onClick={handleClose}>
          Cancel
        </button>
      </section>
    </div>
  );
}

export default ModalDeleteAccount;
