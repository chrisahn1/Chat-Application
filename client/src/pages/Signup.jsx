import { useNavigate } from 'react-router-dom';
import React, { useContext, useState } from 'react';
import ErrorSignup from '../modals/ModalErrorSignup';
import { url } from '../configURL/configURL';
import { Eye, EyeOff } from 'react-feather';
import { AuthContext } from '../context/AuthContext';

function Signup() {
  const navigate = useNavigate();
  const [username_input, setUsername] = useState('');
  const [email_input, setEmail] = useState('');
  const [password_input, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  // const [pic_file, setPicFile] = useState(null);

  const [error, setError] = useState('');

  const [showAccountExistModal, setAccountExistModal] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const { setAccessToken, setIsAuth } = useContext(AuthContext);

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

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
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
      //https://chatapplivedemo.com
      //http://localhost:8080
      const result = await fetch(`${url}/users/signupcheck`, {
        method: 'POST',
        credentials: 'include',
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
          const response = await fetch(`${url}/users/signup`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          });

          const result = await response.json();

          // console.log('signup: ', result);

          setError('');
          navigate('/', { state: { accountCreated: true } });
        }
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsLoading(false); // stop loading after completion
    }
  };

  // const login = async () => {
  //   const body = {
  //     email: email_input,
  //     password: password_input,
  //   };
  //   //https://chatapplivedemo.com
  //   //http://localhost:8080
  //   const response = await fetch(`${url}/users/login`, {
  //     method: 'POST',
  //     credentials: 'include',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(body),
  //   });
  //   const result = await response.json();
  //   // console.log('result: ', result);

  //   setAccessToken(result.access_token);
  //   setIsAuth(true);
  //   navigate('/userpage');
  // };

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
        <div style={{ width: '100%', display: 'flex' }}>
          <input
            className="registerInput password"
            type={showPassword ? 'text' : 'password'}
            value={password_input}
            placeholder="Password"
            onChange={handlePassword}
            required
          />
          <button className="eye" type="button" onClick={toggleShowPassword}>
            {showPassword ? <Eye /> : <EyeOff />}
          </button>
        </div>
        <div style={{ padding: '5px' }}>
          {error && <p style={{ color: 'white' }}>{error}</p>}
        </div>
        <div className="loginsignupsection">
          <button className="submitButton" type="submit">
            Sign Up
          </button>
        </div>
      </form>
      <div>
        <ErrorSignup
          isOpen={showAccountExistModal}
          handleClose={toggleAccountExist}></ErrorSignup>
      </div>
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Connecting to server... please wait (~30s on first load)</p>
        </div>
      )}
    </div>
  );
}

export default Signup;
