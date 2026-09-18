import { useState, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import Chatdisplay from '../components/Chatdisplay';
import io from 'socket.io-client';
import { url } from '../configURL/configURL';
// const socket = io.connect('http://localhost:8080');
// const socket = io.connect(`${url}`);
const socket = io(url, {
  withCredentials: true,
  transports: ['polling', 'websocket'], // avoids polling issues on Render
  // secure: true,
});
//https://chatapplivedemo.com
//http://localhost:8080
function UserPage() {
  const [isChatOpenMobile, setIsChatOpenMobile] = useState(false);
  const touchStartX = useRef(null);

  const openChatMobile = () => setIsChatOpenMobile(true);
  const closeChatMobile = () => setIsChatOpenMobile(false);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const threshold = 60;

    if (deltaX < -threshold && !isChatOpenMobile) {
      openChatMobile(); // swipe left -> show chat
    } else if (deltaX > threshold && isChatOpenMobile) {
      closeChatMobile(); // swipe right -> back to list
    }
    touchStartX.current = null;
  };
  return (
    // <div className="containerChat">

    //   <Sidebar socket={socket} />
    //   <Chatdisplay socket={socket} />
    // </div>
    <div
      className={`containerChat${isChatOpenMobile ? ' mobile-chat-open' : ''}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}>
      <Sidebar socket={socket} onSelectChat={openChatMobile} />
      <Chatdisplay socket={socket} onBack={closeChatMobile} />
    </div>
  );
}

export default UserPage;
