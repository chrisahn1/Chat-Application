import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import ErrorSignup from '../modals/ModalErrorSignup';

function Signup() {
  const navigate = useNavigate();
  const [username_input, setUsername] = useState('');
  const [email_input, setEmail] = useState('');
  const [password_input, setPassword] = useState('');
  // const [pic_file, setPicFile] = useState(null);

  const [error, setError] = useState('');

  const [showAccountExistModal, setAccountExistModal] = useState(false);

  const toggleAccountExist = () => {
    setAccountExistModal(!showAccountExistModal);
  };

  const handleUsername = (e) => {
    setUsername(e.target.value);
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  // const handleImage = (e) => {
  //     const file = e.target.files;
  //     setPicFile(file);
  //     console.log('pic file: ', file[0].name);
  // }

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const formData = new FormData();
    // formData.append('username', username_input);
    // formData.append('email', email_input);
    // formData.append('password', password_input);
    // formData.append('image', pic_file);

    try {
      //CHECK IF USERNAME OR EMAIL STILL EXIST

      const body = {
        username: username_input,
        email: email_input,
        password: password_input,
      };

      const result = await fetch('http://localhost:3001/users/signupcheck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const verify = await result.json();

      if (verify === 'invalid') {
        toggleAccountExist();
      } else {
        if (username_input.length > 10 || username_input.length < 3) {
          setError('Username character length must be between 3 and 10');
        } else {
          const response = await fetch('http://localhost:3001/users/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          });

          const result = await response.json();

          console.log('signup: ', result.command);

          setError('');
          navigate('/');
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="App">
      <form className="Register Signup" onSubmit={handleSubmit}>
        <h2 style={{ color: 'white' }}>Sign-Up</h2>
        <label style={{ padding: '1.5vh' }}>Username:</label>
        <input
          className="registerInput"
          type="text"
          value={username_input}
          placeholder="Username"
          onChange={handleUsername}
          required
        />
        <label style={{ padding: '1.5vh' }}>Email:</label>
        <input
          className="registerInput"
          type="email"
          value={email_input}
          placeholder="Email"
          onChange={handleEmail}
          required
        />
        <label style={{ padding: '1.5vh' }}>Password:</label>
        <input
          className="registerInput"
          type="password"
          value={password_input}
          placeholder="Password"
          onChange={handlePassword}
          required
        />
        {/* <label>Profile Pic: </label>
                <input type='file' onChange={handleImage} /> */}
        <div>{error && <p style={{ color: 'white' }}>{error}</p>}</div>
        <button className="submitButton" type="submit">
          Sign Up
        </button>
      </form>
      <div>
        <ErrorSignup
          isOpen={showAccountExistModal}
          handleClose={toggleAccountExist}></ErrorSignup>
      </div>
    </div>
  );
}

export default Signup;
