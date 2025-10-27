import './Modal.css';
import { X } from 'react-feather';
import React from 'react';

const CharacterLimit = ({ isOpen, handleClose }) => {
  return (
    <div className={isOpen ? 'modal display-block' : 'modal display-none'}>
      <section className="modal-main charlimit">
        <X className="closeIcon" onClick={handleClose} />
        <h2>Unable to send message. Character limit: 150</h2>
        <div>
          <button onClick={handleClose}>Close</button>
        </div>
      </section>
    </div>
  );
};

export default CharacterLimit;
