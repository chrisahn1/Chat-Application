import React, { useContext } from 'react';

import io from 'socket.io-client';
const socket = io.connect('http://localhost:3001');

function UserPage() {
  //SIDEBAR AND CHATWINDOW IN SEPARATE CONTAINERCHAT
  return (
    <div className="App">
      <div className="containerChat">Hello World</div>
    </div>
  );
}

export default UserPage;
