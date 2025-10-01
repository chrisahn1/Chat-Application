import './Modal.css';
import { X } from 'react-feather';
import React, { useEffect, useState } from 'react';

const LoginCheck = ({ isOpen, handleClose }) => {
  return (
    <div className={isOpen ? 'modal display-block' : 'modal display-none'}>
      <section className="modal-main checkloginsignup">
        <X className="closeIcon" onClick={handleClose} />
        <h2>Incorrect email or password. Please try again</h2>
        <button onClick={handleClose}>Close</button>
      </section>
    </div>
  );
};

export default LoginCheck;
