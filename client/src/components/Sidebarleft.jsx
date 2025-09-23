import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

import Chatlist from './Chatlist';

function Sidebarleft({ socket }) {
  const { currentUsername } = useContext(AuthContext);
  return (
    <div className="sidebarleft">
      <div className="sidebarusername">{currentUsername}</div>

      <Chatlist socket={socket} />
    </div>
  );
}

export default Sidebarleft;
