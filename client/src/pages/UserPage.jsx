import Sidebar from '../components/Sidebar';
import Chatdisplay from '../components/Chatdisplay';
import io from 'socket.io-client';
const socket = io.connect('http://localhost:8080');

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
