import React, {
  useEffect,
  useState,
  useContext,
  createContext,
  useLayoutEffect,
} from 'react';
// import { useNavigate } from 'react-router-dom';
import { ChatContext } from '../context/ChatUseContext';

export const AuthContext = createContext({});

export const AuthContextProvider = ({ children }) => {
  const { setMessageTexts } = useContext(ChatContext);

  const [accessToken, setAccessToken] = useState({});

  const [currentUsername, setCurrentUsername] = useState('');
  const [currentUserID, setCurrentUserID] = useState('');

  const [isAuth, setIsAuth] = useState(false);

  // const navigate = useNavigate();

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
  }, [accessToken]);

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
          console.log('response 401: ', response.status);
          // navigate('/', { replace: true });
          setIsAuth(false);
          setMessageTexts([]);
          setAccessToken({});
          setCurrentUsername('');
          setCurrentUserID('');
          // navigate('/', { replace: true });
        } else if (response.status === 403) {
          console.log('response 403: ', response.status);
          // navigate('/', { replace: true });
          setIsAuth(false);
          setMessageTexts([]);
          setAccessToken({});
          setCurrentUsername('');
          setCurrentUserID('');
          // navigate('/', { replace: true });
        } else {
          console.log('response: ', response.status);
          const data = await response.json();
          setAccessToken({});
          setAccessToken(data.access_token);
          setIsAuth(true);
          // navigate('/userpage', {replace: true});
        }
      } catch (err) {
        console.error(err.message);
      }
    };

    refreshToken();
  }, [accessToken]); //navigate

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
      }}>
      {children}
    </AuthContext.Provider>
  );
};
