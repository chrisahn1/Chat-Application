import React, { useContext } from 'react';
import Sidebarleft from '../components/Sidebarleft';
import Chatdisplay from '../components/Chatdisplay';
import io from 'socket.io-client';
const socket = io.connect('http://localhost:3001');

function UserPage() {
  //SIDEBAR AND CHATWINDOW IN SEPARATE CONTAINERCHAT
  return (
    <div className="App">
      <div className="containerChat">
        <Sidebarleft socket={socket} />
        <Chatdisplay socket={socket} />
      </div>
    </div>
  );
}

export default UserPage;
