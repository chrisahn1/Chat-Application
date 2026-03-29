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
  return (
    <div className="App">
      <div className="containerChat">
        <Sidebar socket={socket} />
        <Chatdisplay socket={socket} />
      </div>
    </div>
  );
}

export default UserPage;
