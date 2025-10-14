import { useNavigate } from 'react-router-dom';
import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import LoginCheck from '../modals/ModalLoginCheck';

function Home() {
  const navigate = useNavigate();

  const { setAccessToken, setIsAuth, setTimeInterval } =
    useContext(AuthContext);

  const [email_input, setEmail] = useState('');
  const [password_input, setPassword] = useState('');

  const [showLoginCheckModal, setLoginCheckModal] = useState(false);

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = {
        email: email_input,
        password: password_input,
      };

      const response = await fetch('http://localhost:3001/users/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const result = await response.json();

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
