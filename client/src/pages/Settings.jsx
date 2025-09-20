import { useNavigate, useLocation, Link } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import ModalDeleteAccount from '../modals/ModalDeleteAccount';

function Settings() {
  const navigate = useNavigate();

  const { accessToken } = useContext(AuthContext);

  const [modaldelete, setModalDelete] = useState(false);

  const toggleEdit = () => {
    if (!accessToken) {
      navigate('/', { replace: true });
    } else {
      navigate('/editpage');
    }
  };

  const toggleDelete = () => {
    setModalDelete(!modaldelete);
  };

  return (
    <div className="App">
      <button onClick={toggleEdit}>Edit Profile</button>
      {/* <Link to="/editpage">Edit User</Link> */}
      <button onClick={toggleDelete}>Delete Account</button>
      <ModalDeleteAccount
        isOpen={modaldelete}
        handleClose={toggleDelete}></ModalDeleteAccount>
    </div>
  );
}

export default Settings;
