import './Modal.css';
import { X, Eye, EyeOff } from 'react-feather';
import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { url } from '../configURL/configURL';

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
      //https://chatapplivedemo.com
      //http://localhost:8080
      const check = await fetch(`${url}/users/updateusernamecheck`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          authorization: accessToken,
        },
        body: JSON.stringify(username),
      });

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
        const response = await fetch(`${url}/users/updateusername`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            authorization: accessToken,
          },
          body: JSON.stringify(username),
          credentials: 'include',
        });

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
    <div
      className={isOpen ? 'modal display-block' : 'modal display-none'}
      onClick={(e) => {
        // console.log('modal display classname: ', e.target.className);
        if (e.target.className === 'modal display-block') {
          closeModal();
        }
      }}>
      <section className="modal-main accountedit usernamechange">
        <div className="modal-header">
          <h3 style={{ color: 'white' }}>Update Username</h3>
          <X className="closeIcon" onClick={closeModal} />
        </div>
        <div className="modal-body">
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
            <button type="button" onClick={closeModal}>
              Cancel
            </button>
          </form>
        </div>

        {/* <X className="closeIcon" onClick={closeModal} />
        <h3 style={{ color: 'white' }}>Update Username</h3>
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
        </button> */}
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
      const response = await fetch(`${url}/users/useremail`, {
        method: 'GET',
        credentials: 'include',
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

      const response = await fetch(`${url}/users/updateemail`, {
        method: 'PUT',
        credentials: 'include',
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
    <div
      className={isOpen ? 'modal display-block' : 'modal display-none'}
      onClick={(e) => {
        // console.log('modal display classname: ', e.target.className);
        if (e.target.className === 'modal display-block') {
          closeModal();
        }
      }}>
      <section className="modal-main accountedit emailchange">
        <div className="modal-header">
          <X className="closeIcon" onClick={closeModal} />
          <h3 style={{ color: 'white' }}>Update Email</h3>
        </div>
        <div className="modal-body">
          <form className="modalEditRegister" onSubmit={userEmailChange}>
            <div>
              <label style={{ padding: '1vh' }}>Enter current email: </label>
              <input
                className="registerInput"
                type="email"
                value={current_email_input}
                onChange={handleCurrentEmail}
                required
              />
            </div>
            <div>
              <label style={{ padding: '1vh' }}> Enter new email: </label>
              <input
                className="registerInput"
                type="email"
                value={new_email_input}
                onChange={handleNewEmail}
                required
              />
            </div>
            <div>{error && <p style={{ color: 'white' }}>{error}</p>}</div>
            <button className="submitButton" type="submit">
              Confirm
            </button>
            <button type="button" onClick={closeModal}>
              Cancel
            </button>
          </form>
        </div>
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
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleCurrentPassword = (e) => {
    setCurrentPassword(e.target.value);
  };

  const handleNewPassword = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };

  const toggleShowCurrentPassword = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };

  const toggleShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const userPasswordChange = async (e) => {
    e.preventDefault();
    const body = {
      current_password: current_password_input,
    };
    try {
      const response = await fetch(`${url}/users/userpassword`, {
        method: 'POST',
        credentials: 'include',
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
      await fetch(`${url}/users/updatepassword`, {
        method: 'PUT',
        credentials: 'include',
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
    <div
      className={isOpen ? 'modal display-block' : 'modal display-none'}
      onClick={(e) => {
        // console.log('modal display classname: ', e.target.className);
        if (e.target.className === 'modal display-block') {
          closeModal();
        }
      }}>
      <section className="modal-main accountedit emailchange">
        <X className="closeIcon" onClick={closeModal} />
        <h3 style={{ color: 'white' }}>Update Password</h3>
        <form className="modalEditRegister" onSubmit={userPasswordChange}>
          <label style={{ padding: '1.5vh' }}>Enter current password: </label>
          <div style={{ display: 'flex' }}>
            <input
              className="registerInput password"
              type={showCurrentPassword ? 'text' : 'password'}
              value={current_password_input}
              onChange={handleCurrentPassword}
              required
            />
            <button
              className="eye"
              type="button"
              onClick={toggleShowCurrentPassword}>
              {showCurrentPassword ? <Eye /> : <EyeOff />}
            </button>
          </div>
          <label style={{ padding: '1.5vh' }}> Enter new password: </label>
          <div style={{ display: 'flex' }}>
            <input
              className="registerInput password"
              type={showNewPassword ? 'text' : 'password'}
              value={new_password_input}
              onChange={handleNewPassword}
              required
            />
            <button
              className="eye"
              type="button"
              onClick={toggleShowNewPassword}>
              {showNewPassword ? <Eye /> : <EyeOff />}
            </button>
          </div>
          <label style={{ padding: '1.5vh' }}> Confirm new password: </label>
          <div style={{ display: 'flex' }}>
            <input
              className="registerInput password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirm_password_input}
              onChange={handleConfirmPassword}
              required
            />
            <button
              className="eye"
              type="button"
              onClick={toggleShowConfirmPassword}>
              {showConfirmPassword ? <Eye /> : <EyeOff />}
            </button>
          </div>
          <div>{error && <p style={{ color: 'white' }}>{error}</p>}</div>
          <button className="submitButton" type="submit">
            Confirm
          </button>
          <button type="button" onClick={closeModal}>
            Cancel
          </button>
        </form>
        {/* <button type="button" onClick={closeModal}>
          Cancel
        </button> */}
      </section>
    </div>
  );
};

export { UpdateUsername, UpdateUserEmail, UpdateUserPassword };
