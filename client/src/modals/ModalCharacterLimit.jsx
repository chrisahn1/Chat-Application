import './Modal.css';
import React, { useEffect, useState } from 'react';

const CharacterLimit = ({ isOpen, handleClose }) => {
  return (
    <div className={isOpen ? 'modal display-block' : 'modal display-none'}>
      <section className="modal-main">
        <h2>Unable to send message. Character limit: 150</h2>
        <button onClick={handleClose}>Close</button>
      </section>
    </div>
  );
};

export default CharacterLimit;
