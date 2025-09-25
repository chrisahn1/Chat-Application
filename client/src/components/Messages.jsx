import React, { useContext, useEffect, useState, useRef } from 'react';
import Text from './Text';
import io from 'socket.io-client';
const socket = io.connect('http://localhost:3001');

const Messages = ({ messagelist }) => {
  return (
    <div className="messages">
      {messagelist.map((messageContent) => (
        <Text text={messageContent} />
      ))}
    </div>
  );
};

export default Messages;
