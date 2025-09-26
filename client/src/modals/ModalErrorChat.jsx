import './Modal.css';
import { X } from 'react-feather';
import React, { useEffect, useState } from 'react';

const ErrorChat = ({ isOpen, handleClose }) => {
  return (
    <div className={isOpen ? 'modal display-block' : 'modal display-none'}>
      <section className="modal-main">
        <h2>Chat does not exist</h2>
        <button onClick={handleClose}>Close</button>
      </section>
    </div>
  );
};

export default ErrorChat;
