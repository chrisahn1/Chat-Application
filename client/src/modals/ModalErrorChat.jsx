import './Modal.css';
import { X } from 'react-feather';
import React, { useEffect, useState } from 'react';

const ErrorChat = ({ isOpen, handleClose }) => {
  return (
    <div className={isOpen ? 'modal display-block' : 'modal display-none'}>
      <section className="modal-main errorchat">
        <X className="closeIcon" onClick={handleClose} />
        <h2>Chat does not exist</h2>
        <div>
          <button onClick={handleClose}>Close</button>
        </div>
      </section>
    </div>
  );
};

export default ErrorChat;
