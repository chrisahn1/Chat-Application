import './Modal.css';
import { X } from 'react-feather';
import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

//UPDATE USERNAME
const UpdateUsername = ({ isOpen, handleClose }) => {
  const { accessToken, setCurrentUsername } = useContext(AuthContext);

  const [new_username_input, setNewUsername] = useState('');
  const [error, setError] = useState('');

  const handleUsernameChange = async (e) => {
    setNewUsername(e.target.value);
  };

  const usernameChange = async (e) => {
    e.preventDefault();

    // handleSubmitNewUsername(e);
    try {
      const username = { username: new_username_input };

      const check = await fetch(
        'http://localhost:8080/users/updateusernamecheck',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(username),
        }
      );

      const verify = await check.json();
      // console.log('verify: ', verify);
      if (verify === 'invalid') {
        setError('Username already exists');
      } else if (
        new_username_input.length > 10 ||
        new_username_input.length < 3
      ) {
        setError('Username character length must be between 3 and 10');
      } else {
        const response = await fetch(
          'http://localhost:8080/users/updateusername',
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              authorization: accessToken,
            },
            body: JSON.stringify(username),
            credentials: 'include',
          }
        );

        const result = await response.json();
        setError('');
        setNewUsername('');
        setCurrentUsername(result.username);
        handleClose();
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const closeModal = async (e) => {
    setNewUsername('');
    setError('');
    handleClose();
  };

  return (
    <div className={isOpen ? 'modal display-block' : 'modal display-none'}>
      <section className="modal-main accountedit usernamechange">
        <X className="closeIcon" onClick={closeModal} />
        <h3>Update Username</h3>
        <form className="modalEditRegister" onSubmit={usernameChange}>
          <label style={{ padding: '1.5vh' }}>Enter New Username: </label>
          <input
            className="registerInput"
            type="text"
            value={new_username_input}
            placeholder="New Username"
            onChange={handleUsernameChange}
          />
          <div>{error && <p style={{ color: 'white' }}>{error}</p>}</div>
          <button className="submitButton" type="submit">
            Confirm
          </button>
        </form>
        <button type="button" onClick={closeModal}>
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
  const [error, setError] = useState('');

  const handleCurrentEmail = (e) => {
    setCurrentEmail(e.target.value);
  };

  const handleNewEmail = (e) => {
    setNewEmail(e.target.value);
  };

  const userEmailChange = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/users/useremail', {
        method: 'GET',
        headers: { authorization: accessToken },
      });
      const result = await response.json();
      if (current_email_input !== result.rows[0].email) {
        setError('Please enter current email');
      } else if (new_email_input === result.rows[0].email) {
        setError('Please enter new email');
      } else if (current_email_input === new_email_input) {
        setError('Error: Emails are the same');
      } else {
        emailChange();
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const updateEmail = async () => {
    try {
      const email = { email: new_email_input };

      const response = await fetch('http://localhost:8080/users/updateemail', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          authorization: accessToken,
        },
        body: JSON.stringify(email),
      });
      const result = await response.json();
      console.log('update email: ', result);
    } catch (err) {
      console.error(err.message);
    }
  };

  const emailChange = async () => {
    setError('');
    setCurrentEmail('');
    setNewEmail('');

    handleClose();
    updateEmail();
  };

  const closeModal = async (e) => {
    setCurrentEmail('');
    setNewEmail('');
    setError('');
    handleClose();
  };

  return (
    <div className={isOpen ? 'modal display-block' : 'modal display-none'}>
      <section className="modal-main accountedit emailchange">
        <X className="closeIcon" onClick={closeModal} />
        <h3>Update Email</h3>
        <form className="modalEditRegister" onSubmit={userEmailChange}>
          <label style={{ padding: '1.5vh' }}>Enter current email: </label>
          <input
            className="registerInput"
            type="email"
            value={current_email_input}
            onChange={handleCurrentEmail}
            required
          />
          <label style={{ padding: '1.5vh' }}> Enter new email: </label>
          <input
            className="registerInput"
            type="email"
            value={new_email_input}
            onChange={handleNewEmail}
            required
          />
          <div>{error && <p style={{ color: 'white' }}>{error}</p>}</div>
          <button className="submitButton" type="submit">
            Confirm
          </button>
        </form>
        <button type="button" onClick={closeModal}>
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
  const [error, setError] = useState('');

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
      const response = await fetch('http://localhost:8080/users/userpassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: accessToken,
        },
        body: JSON.stringify(body),
      });
      const result = await response.json();

      // if (
      //   result === true &&
      //   current_password_input !== new_password_input &&
      //   new_password_input === confirm_password_input
      // ) {
      //   passwordChange();
      // } else {
      //   console.log('Incorrect password input');
      // }

      if (result === false) {
        setError('Please enter current password');
      } else if (current_password_input === new_password_input) {
        setError('Please enter new password');
      } else if (confirm_password_input !== new_password_input) {
        setError('New password does not match');
      } else {
        passwordChange();
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const updatePassword = async (e) => {
    try {
      const password = { password: new_password_input };

      // const response = await fetch(
      //   'http://localhost:3001/users/updatepassword',
      //   {
      //     method: 'PUT',
      //     headers: {
      //       'Content-Type': 'application/json',
      //       authorization: accessToken,
      //     },
      //     body: JSON.stringify(password),
      //   }
      // );
      // const result = await response.json();
      // console.log('update password: ', result);
      await fetch('http://localhost:8080/users/updatepassword', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          authorization: accessToken,
        },
        body: JSON.stringify(password),
      });
    } catch (err) {
      console.error(err.message);
    }
  };

  const passwordChange = async (e) => {
    // console.log('new password: ', new_password_input);
    setError('');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');

    handleClose();
    updatePassword();
  };

  const closeModal = async (e) => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    handleClose();
  };

  return (
    <div className={isOpen ? 'modal display-block' : 'modal display-none'}>
      <section className="modal-main accountedit emailchange">
        <X className="closeIcon" onClick={closeModal} />
        <h3>Update Password</h3>
        <form className="modalEditRegister" onSubmit={userPasswordChange}>
          <label style={{ padding: '1.5vh' }}>Enter current password: </label>
          <input
            className="registerInput"
            type="password"
            value={current_password_input}
            onChange={handleCurrentPassword}
            required
          />
          <label style={{ padding: '1.5vh' }}> Enter new password: </label>
          <input
            className="registerInput"
            type="password"
            value={new_password_input}
            onChange={handleNewPassword}
            required
          />
          <label style={{ padding: '1.5vh' }}> Confirm new password: </label>
          <input
            className="registerInput"
            type="password"
            value={confirm_password_input}
            onChange={handleConfirmPassword}
            required
          />
          <div>{error && <p style={{ color: 'white' }}>{error}</p>}</div>
          <button className="submitButton" type="submit">
            Confirm
          </button>
        </form>
        <button type="button" onClick={closeModal}>
          Cancel
        </button>
      </section>
    </div>
  );
};

export { UpdateUsername, UpdateUserEmail, UpdateUserPassword };
