import React, {
  useEffect,
  useReducer,
  useState,
  useContext,
  createContext,
} from 'react';
import { AuthContext } from '../context/AuthContext';

export const ChatContext = createContext({});

export const ChatContextProvider = ({ children }) => {
  const [chatlist, setChatlist] = useState([]);

  const [messageTexts, setMessageTexts] = useState([]);
  const [message_text, setMessage] = useState('');

  const INIT_STATE = {
    id: 'null',
    chat: {},
  };

  const chatReducer = (state, action) => {
    switch (action.type) {
      case 'CHAT_CHANGE':
        // console.log('action payload: ', action.payload);
        return {
          id: action.payload.id,
          chat: action.payload,
        };

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INIT_STATE);

  return (
    <ChatContext.Provider
      value={{
        data: state,
        dispatch,
        chatlist,
        setChatlist,
        messageTexts,
        setMessageTexts,
        message_text,
        setMessage,
      }}>
      {children}
    </ChatContext.Provider>
  );
};
