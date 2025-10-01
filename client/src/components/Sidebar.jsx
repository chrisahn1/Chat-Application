import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

import Chatlist from './Chatlist';

function Sidebar({ socket }) {
  const { currentUsername } = useContext(AuthContext);
  return (
    <div className="sidebar">
      <div className="usernamebar">
        <h2>{currentUsername}</h2>
      </div>

      <Chatlist socket={socket} />
    </div>
  );
}

export default Sidebar;
