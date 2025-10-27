import React, { useState } from 'react';
import ModalDeleteAccount from '../modals/ModalDeleteAccount';
import {
  UpdateUsername,
  UpdateUserEmail,
  UpdateUserPassword,
} from '../modals/ModalEditAccount';

function Settings() {
  const [modaldelete, setModalDelete] = useState(false);

  const [showUsername, setShowUsername] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [showPW, setShowPW] = useState(false);

  const toggleUsername = async () => {
    setShowUsername(!showUsername);
  };

  const toggleEmail = async () => {
    setShowEmail(!showEmail);
  };

  const togglePW = async () => {
    setShowPW(!showPW);
  };

  const toggleDelete = async () => {
    setModalDelete(!modaldelete);
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
