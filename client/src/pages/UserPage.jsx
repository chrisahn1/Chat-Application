import React, { useContext } from 'react';
import Chatwindow from '../components/Chatwindow';
import io from 'socket.io-client';
const socket = io.connect('http://localhost:3001');

function UserPage() {
  //SIDEBAR AND CHATWINDOW IN SEPARATE CONTAINERCHAT
  return (
    <div className="App">
      <div className="containerChat">
        <Chatwindow socket={socket} />
      </div>
    </div>
  );
}

export default UserPage;
