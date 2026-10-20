import React, { useEffect, useRef } from 'react';
import Text from './Text';

const Messages = ({ messagelist }) => {
  const listRef = useRef(null);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messagelist]);

  // return (
  //   <div className="messages">
  //     {messagelist.map((messageContent) => (
  //       <Text text={messageContent} />
  //     ))}
  //   </div>
  // );

  return (
    <div className="messages" ref={listRef}>
      {messagelist.map((messageContent, i) => (
        <Text key={messageContent.id ?? i} text={messageContent} />
      ))}
    </div>
  );
};

export default Messages;
