import './Modal.css';
import { X } from 'react-feather';
import React from 'react';

const ErrorChat = ({ isOpen, handleClose }) => {
  return (
    <div
      className={isOpen ? 'modal display-block' : 'modal display-none'}
      onClick={(e) => {
        // console.log('modal display classname: ', e.target.className);
        if (e.target.className === 'modal display-block') {
          handleClose();
        }
      }}>
      <section className="modal-main errorchat">
        <X className="closeIcon" onClick={handleClose} />
        <h2 style={{ color: 'white' }}>Chat does not exist</h2>
        <div>
          <button onClick={handleClose}>Close</button>
        </div>
      </section>
    </div>
  );
};

export default ErrorChat;
