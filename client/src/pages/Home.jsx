import { useNavigate } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';

function Home() {
  const navigate = useNavigate();

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
        // setAccessToken(result.access_token);
        // setIsAuth(true);
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
      Home
      <form className="Register" onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="email"
          value={email_input}
          placeholder="Email"
          onChange={handleEmail}
          required
        />
        <label>Password:</label>
        <input
          type="password"
          value={password_input}
          placeholder="Password"
          onChange={handlePassword}
          required
        />
        <button type="submit">Login</button>
      </form>
      <button onClick={() => navigate('/signup')}>Signup</button>
      {/* <div>
        <LoginCheck
          isOpen={showLoginCheckModal}
          handleClose={toggleLoginCheckModal}></LoginCheck>
      </div> */}
    </div>
  );
}

export default Home;
