import './Modal.css';
import { X } from 'react-feather';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

//UPDATE USERNAME
const UpdateUsername = ({ isOpen, handleClose }) => {
  const { accessToken } = useContext(AuthContext);

  const [new_username_input, setNewUsername] = useState('');

  const newUsernameChange = (e) => {
    setNewUsername(e.target.value);
  };

  const handleSubmitNewUsername = async (e) => {
    e.preventDefault();

    try {
      const username = { username: new_username_input };

      const response = await fetch(
        'http://localhost:3001/users/updateusername',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            authorization: accessToken,
          },
          body: JSON.stringify(username),
        }
      );
      const result = await response.json();
      console.log(result);
    } catch (err) {
      console.error(err.message);
    }

    e.target.reset();
  };

  const usernameChange = async (e) => {
    handleClose();
    handleSubmitNewUsername(e);
  };

  return (
    <div className={isOpen ? 'modal display-block' : 'modal display-none'}>
      <section className="modal-main">
        <form className="Register" onSubmit={usernameChange}>
          <label>Enter New Username: </label>
          <input
            type="text"
            value={new_username_input}
            placeholder="New Username"
            onChange={newUsernameChange}
          />
          <button type="submit">Confirm</button>
        </form>
        <button type="button" onClick={handleClose}>
          Cancel
        </button>
      </section>
    </div>
  );
};

//UPDATE EMAIL
const UpdateUserEmail = ({ isOpen, handleClose }) => {
  const { accessToken } = useContext(AuthContext);

  const [current_email_input, setCurrentEmail] = useState('');
  const [new_email_input, setNewEmail] = useState('');

  const handleCurrentEmail = (e) => {
    setCurrentEmail(e.target.value);
  };

  const handleNewEmail = (e) => {
    setNewEmail(e.target.value);
  };

  const userEmailChange = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/users/useremail', {
        method: 'GET',
        headers: { authorization: accessToken },
      });
      const result = await response.json();
      // console.log(result.rows[0].email);
      if (
        current_email_input === result.rows[0].email &&
        new_email_input !== result.rows[0].email &&
        new_email_input !== current_email_input
      ) {
        changeEmail();
      } else {
        console.log('Incorrect email input');
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const updateEmail = async (e) => {
    try {
      const email = { email: new_email_input };

      const response = await fetch('http://localhost:3001/users/updateemail', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          authorization: accessToken,
        },
        body: JSON.stringify(email),
      });
      const result = await response.json();
      // console.log(result);
    } catch (err) {
      console.error(err.message);
    }
  };

  const changeEmail = async (e) => {
    handleClose();
    updateEmail();
  };

  return (
    <div className={isOpen ? 'modal display-block' : 'modal display-none'}>
      <section className="modal-main">
        <h3>Update Email</h3>
        <form className="Register" onSubmit={userEmailChange}>
          <label>Enter current email: </label>
          <input
            type="email"
            value={current_email_input}
            onChange={handleCurrentEmail}
            required
          />
          <label> Enter new email: </label>
          <input
            type="email"
            value={new_email_input}
            onChange={handleNewEmail}
            required
          />
          <button type="submit">Confirm</button>
        </form>
        <button type="button" onClick={handleClose}>
          Cancel
        </button>
      </section>
    </div>
  );
};

//UPDATE PASSWORD
const UpdateUserPassword = ({ isOpen, handleClose }) => {
  const { accessToken } = useContext(AuthContext);

  const [current_password_input, setCurrentPassword] = useState('');
  const [new_password_input, setNewPassword] = useState('');
  const [confirm_password_input, setConfirmPassword] = useState('');

  const handleCurrentPassword = (e) => {
    setCurrentPassword(e.target.value);
  };

  const handleNewPassword = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };

  const userPasswordChange = async (e) => {
    e.preventDefault();
    const body = {
      current_password: current_password_input,
    };
    try {
      const response = await fetch('http://localhost:3001/users/userpassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: accessToken,
        },
        body: JSON.stringify(body),
      });
      const result = await response.json();
      console.log('result password: ', result);
      if (
        result === true &&
        current_password_input !== new_password_input &&
        new_password_input === confirm_password_input
      ) {
        passwordChange();
      } else {
        console.log('Incorrect password input');
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const updatePassword = async (e) => {
    try {
      const password = { password: new_password_input };

      const response = await fetch(
        'http://localhost:3001/users/updatepassword',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            authorization: accessToken,
          },
          body: JSON.stringify(password),
        }
      );
      const result = await response.json();
      console.log(result);
    } catch (err) {
      console.error(err.message);
    }
  };

  const passwordChange = async (e) => {
    // console.log('new password: ', new_password_input);
    handleClose();
    updatePassword();
  };

  return (
    <div className={isOpen ? 'modal display-block' : 'modal display-none'}>
      <section className="modal-main">
        <h3>Update Password</h3>
        <form className="Register" onSubmit={userPasswordChange}>
          <label>Enter current password: </label>
          <input
            type="password"
            value={current_password_input}
            onChange={handleCurrentPassword}
            required
          />
          <label> Enter new password: </label>
          <input
            type="password"
            value={new_password_input}
            onChange={handleNewPassword}
            required
          />
          <label> Confirm new password: </label>
          <input
            type="password"
            value={confirm_password_input}
            onChange={handleConfirmPassword}
            required
          />
          <button type="submit">Confirm</button>
        </form>
        <button type="button" onClick={handleClose}>
          Cancel
        </button>
      </section>
    </div>
  );
};

export { UpdateUsername, UpdateUserEmail, UpdateUserPassword };
