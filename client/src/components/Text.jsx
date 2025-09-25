import React, { useContext, useEffect, useState, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';

const Text = ({ text }) => {
  const { currentUsername, currentUserID } = useContext(AuthContext);
  const messageRef = useRef();

  const getHeight = () => {
    if (text.value.message.length > 150) {
      return '150px';
    }
    return 'auto';
  };

  useEffect(() => {
    messageRef.current?.scrollIntoView({ behavior: 'instant' });
  }, [text]);

  return (
    <div
      ref={messageRef}
      className={`message ${
        text.value.authorID === currentUserID ? 'owner' : 'other'
      }`}>
      <div className="messageTraits">
        <img
          className="chatusericon"
          src="user-account-management-logo-user-icon-11562867145a56rus2zwu-1305323861.png"
        />
        <div className="messageAuthor">{text.value.author}</div>
      </div>
      <div className="messageText" style={{ height: getHeight() }}>
        <p className="usertext">{text.value.message}</p>
        <div className="dateDisplay">
          <span>
            {text.value.month +
              ' ' +
              text.value.day +
              ', ' +
              text.value.year +
              ' - ' +
              text.value.time}
          </span>
        </div>
        {/* <span className='dateDisplay'>{text.value.month + ' ' + text.value.day + ', ' + text.value.year + ' - ' + 
                text.value.time}</span> */}
      </div>
    </div>
  );
};

export default Text;
