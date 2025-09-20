import { useNavigate, useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import {
  UpdateUsername,
  UpdateUserEmail,
  UpdateUserPassword,
} from '../modals/ModalEditAccount';

function UserUpdate() {
  const [showUsername, setShowUsername] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [showPW, setShowPW] = useState(false);

  const toggleUsername = () => {
    setShowUsername(!showUsername);
  };

  const toggleEmail = () => {
    setShowEmail(!showEmail);
  };

  const togglePW = () => {
    setShowPW(!showPW);
  };

  return (
    <div className="App">
      <button onClick={toggleUsername}>Change Username</button>
      <button onClick={toggleEmail}>Change Email</button>
      <button onClick={togglePW}>Change Password</button>
      <UpdateUsername
        isOpen={showUsername}
        handleClose={toggleUsername}></UpdateUsername>
      <UpdateUserEmail
        isOpen={showEmail}
        handleClose={toggleEmail}></UpdateUserEmail>
      <UpdateUserPassword
        isOpen={showPW}
        handleClose={togglePW}></UpdateUserPassword>
    </div>
  );
}

export default UserUpdate;
