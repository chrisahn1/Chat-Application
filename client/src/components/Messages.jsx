import React from 'react';
import Text from './Text';

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
