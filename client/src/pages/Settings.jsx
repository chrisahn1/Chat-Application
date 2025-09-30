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

  // const toggleEdit = () => {
  //     if (!accessToken) {
  //         navigate('/', { replace: true });
  //     } else {
  //         navigate('/editpage');
  //     }
  // }

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

  const toggleDelete = () => {
    setModalDelete(!modaldelete);
  };

  return (
    // <div className='App'>
    //     <div className='containerSettings'>
    //     <div className='containerChatEdit'>
    //         <button onClick={toggleUsername}>Change Username</button>
    //         <UpdateUsername isOpen={showUsername} handleClose={toggleUsername}></UpdateUsername>
    //         <button onClick={toggleEmail}>Change Email</button>
    //         <UpdateUserEmail isOpen={showEmail} handleClose={toggleEmail}></UpdateUserEmail>
    //         <button onClick={togglePW}>Change Password</button>
    //         <UpdateUserPassword isOpen={showPW} handleClose={togglePW}></UpdateUserPassword>
    //     </div>
    //     <div className='containerChatDelete'>
    //         <button onClick={toggleDelete}>Delete Account</button>
    //         <ModalDeleteAccount isOpen={modaldelete} handleClose={toggleDelete}></ModalDeleteAccount>
    //     </div>
    //     </div>

    // </div>
    <div className="containerSettings">
      <div className="containerChatEdit">
        <button onClick={toggleUsername}>Change Username</button>
        <UpdateUsername
          isOpen={showUsername}
          handleClose={toggleUsername}></UpdateUsername>
        <button onClick={toggleEmail}>Change Email</button>
        <UpdateUserEmail
          isOpen={showEmail}
          handleClose={toggleEmail}></UpdateUserEmail>
        <button onClick={togglePW}>Change Password</button>
        <UpdateUserPassword
          isOpen={showPW}
          handleClose={togglePW}></UpdateUserPassword>
      </div>
      <div className="containerChatDelete">
        <button onClick={toggleDelete}>Delete Account</button>
        <ModalDeleteAccount
          isOpen={modaldelete}
          handleClose={toggleDelete}></ModalDeleteAccount>
      </div>
    </div>
  );
}

export default Settings;
