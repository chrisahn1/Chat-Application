import { useNavigate } from 'react-router-dom';
import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import LoginCheck from '../modals/ModalLoginCheck';
import { url } from '../configURL/configURL';
import { Eye, EyeOff } from 'react-feather';

function Home() {
  const navigate = useNavigate();

  const { setAccessToken, setIsAuth } = useContext(AuthContext);

  const [email_input, setEmail] = useState('');
  const [password_input, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [showLoginCheckModal, setLoginCheckModal] = useState(false);

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(`${url}/users/login`);
    try {
      const body = {
        email: email_input,
        password: password_input,
      };
      //https://chatapplivedemo.com
      //http://localhost:8080
      const response = await fetch(`${url}/users/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const result = await response.json();
      // console.log('result: ', result);

      if (result === 'wrong') {
        toggleLoginCheckModal();
      } else {
        setAccessToken(result.access_token);
        setIsAuth(true);
        navigate('/userpage');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const toggleLoginCheckModal = () => {
    setLoginCheckModal(!showLoginCheckModal);
  };

  return (
    <div className="App">
      <form className="Register" onSubmit={handleSubmit}>
        <h2 style={{ color: 'white' }}>Chat App Live</h2>
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
        <div style={{ display: 'flex' }}>
          <input
            className="registerInput password"
            type={showPassword ? 'text' : 'password'}
            value={password_input}
            placeholder="Password"
            onChange={handlePassword}
            required
          />
          <button className="eye" type="button" onClick={toggleShowPassword}>
            {showPassword ? (
              <Eye className="eyeicon" />
            ) : (
              <EyeOff className="eyeicon" />
            )}
          </button>
        </div>
        <button className="submitButton" type="submit">
          Login
        </button>
        <label>Need and Account? Click on Signup!</label>
        <button className="submitButton" onClick={() => navigate('/signup')}>
          Signup
        </button>
      </form>
      <div>
        <LoginCheck
          isOpen={showLoginCheckModal}
          handleClose={toggleLoginCheckModal}></LoginCheck>
      </div>
    </div>
  );
}

export default Home;
