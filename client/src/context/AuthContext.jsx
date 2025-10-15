import React, {
  useEffect,
  useState,
  useContext,
  createContext,
  useLayoutEffect,
  useRef,
} from 'react';

import { ChatContext } from '../context/ChatUseContext';
import { jwtDecode } from 'jwt-decode';
import UseRefreshToken from '../hooks/useRefreshToken';

export const AuthContext = createContext({});

export const AuthContextProvider = ({ children }) => {
  const { setMessageTexts } = useContext(ChatContext);

  const [accessToken, setAccessToken] = useState({});

  const [currentUsername, setCurrentUsername] = useState('');
  const [currentUserID, setCurrentUserID] = useState('');

  const [isAuth, setIsAuth] = useState(false);
  const [isInterval, setTimeInterval] = useState(false);

  const intervalRef = useRef(null);
  const [tokenExp, setTokenExp] = useState(null);

  useEffect(() => {
    const setUser = async () => {
      const username = await fetch('http://localhost:3001/users/username', {
        headers: { authorization: accessToken },
      })
        .then((response) => response.json())
        .then((userName) => {
          return userName;
        });
      setCurrentUsername(username);
    };

    setUser();

    const setUserID = async () => {
      const userID = await fetch('http://localhost:3001/users/userid', {
        headers: { authorization: accessToken },
      })
        .then((response) => response.json())
        .then((userid) => {
          return userid;
        });
      setCurrentUserID(userID);
    };

    setUserID();
  }, [accessToken, currentUsername]);

  //REFRESH TOKEN
  useLayoutEffect(() => {
    const refreshToken = async () => {
      try {
        const response = await fetch('http://localhost:3001/users/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        // if (!response.ok) {
        //     console.log('Refresh token failed');
        // }
        if (response.status === 401) {
          console.log('response: ', response.status);
          setIsAuth(false);
          setMessageTexts([]);
          setAccessToken({});
          setCurrentUsername('');
          setCurrentUserID('');
        } else if (response.status === 403) {
          console.log('response: ', response.status);
          setIsAuth(false);
          setMessageTexts([]);
          setAccessToken({});
          setCurrentUsername('');
          setCurrentUserID('');
        } else {
          console.log('response: ', response.status);
          setIsAuth(true);
          const refresh_token = UseRefreshToken();
          const refresh = await refresh_token();
          const data = await refresh.json();
          setAccessToken(data.access_token);
          const decodedToken = jwtDecode(accessToken);
          setTokenExp(decodedToken.exp);
          setTimeInterval(true);
          setMessageTexts([]);
        }
      } catch (err) {
        console.error(err.message);
      }
    };

    refreshToken();
  }, [accessToken]); //navigate

  useEffect(() => {
    if (!isInterval) return;
    const currentTime = Math.floor(Date.now() / 1000);

    intervalRef.current = setInterval(async () => {
      const refresh_token = UseRefreshToken();
      const refresh = await refresh_token();
      if (refresh.status === 200) {
        const data = await refresh.json();
        setAccessToken(data.access_token);
        const decodedToken = jwtDecode(accessToken);
        setTokenExp(decodedToken.exp);
        // console.log('new access token: ', accessToken);
      } else {
        setAccessToken({});
        // setTimeInterval(false);
        setTokenExp(null);
      }
    }, (Math.floor(tokenExp) - currentTime) * 1000); // 1 second = 1000 (Math.floor(tokenExp) - currentTime)*1000

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [tokenExp]);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        setAccessToken,
        currentUsername,
        setCurrentUsername,
        currentUserID,
        setCurrentUserID,
        isAuth,
        setIsAuth,
        setTimeInterval,
        setTokenExp,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
