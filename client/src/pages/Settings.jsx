import { useNavigate, useLocation, Link } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import ModalDeleteAccount from '../modals/ModalDeleteAccount';
import {
  UpdateUsername,
  UpdateUserEmail,
  UpdateUserPassword,
} from '../modals/ModalEditAccount';

function Settings() {
  const navigate = useNavigate();

  const { accessToken } = useContext(AuthContext);

  const [modaldelete, setModalDelete] = useState(false);

  const [showUsername, setShowUsername] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [showPW, setShowPW] = useState(false);

  const verifyActivity = async () => {
    const response = await fetch('http://localhost:3001/users/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    return response.status;
  };

  const toggleUsername = async () => {
    const verify_result = await verifyActivity();
    console.log(verify_result);
    if (verify_result === 401) {
      //NO LONGER AUTHORIZED
      navigate('/', { replace: true });
    } else {
      setShowUsername(!showUsername);
    }
    // setShowUsername(!showUsername);
  };

  const toggleEmail = async () => {
    const verify_result = await verifyActivity();
    console.log(verify_result);
    if (verify_result === 401) {
      //NO LONGER AUTHORIZED
      navigate('/', { replace: true });
    } else {
      setShowEmail(!showEmail);
    }
    // setShowEmail(!showEmail);
  };

  const togglePW = async () => {
    const verify_result = await verifyActivity();
    console.log(verify_result);
    if (verify_result === 401) {
      //NO LONGER AUTHORIZED
      navigate('/', { replace: true });
    } else {
      setShowPW(!showPW);
    }
    // setShowPW(!showPW);
  };

  const toggleDelete = async () => {
    const verify_result = await verifyActivity();
    console.log(verify_result);
    if (verify_result === 401) {
      //NO LONGER AUTHORIZED
      navigate('/', { replace: true });
    } else {
      setModalDelete(!modaldelete);
    }
    // setModalDelete(!modaldelete);
  };

  return (
    <div className="containerSettings">
      <div className="containerChatEdit">
        <h2 style={{ color: 'white' }}>Edit Account</h2>
        <button className="editAccountButton" onClick={toggleUsername}>
          Change Username
        </button>
        <UpdateUsername
          isOpen={showUsername}
          handleClose={toggleUsername}></UpdateUsername>
        <button className="editAccountButton" onClick={toggleEmail}>
          Change Email
        </button>
        <UpdateUserEmail
          isOpen={showEmail}
          handleClose={toggleEmail}></UpdateUserEmail>
        <button className="editAccountButton" onClick={togglePW}>
          Change Password
        </button>
        <UpdateUserPassword
          isOpen={showPW}
          handleClose={togglePW}></UpdateUserPassword>
      </div>
      <div className="containerChatDelete">
        <h2 style={{ color: 'white' }}>Delete Account</h2>
        <button className="editAccountButton" onClick={toggleDelete}>
          Delete Account
        </button>
        <ModalDeleteAccount
          isOpen={modaldelete}
          handleClose={toggleDelete}></ModalDeleteAccount>
      </div>
    </div>
  );
}

export default Settings;
