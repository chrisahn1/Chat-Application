import './Modal.css';
import { X } from 'react-feather';
import React from 'react';

const LoginCheck = ({ isOpen, handleClose }) => {
  return (
    <div
      className={isOpen ? 'modal display-block' : 'modal display-none'}
      onClick={(e) => {
        // console.log('modal display classname: ', e.target.className);
        if (e.target.className === 'modal display-block') {
          handleClose();
        }
      }}>
      <section className="modal-main checkloginsignup">
        <X className="closeIcon" onClick={handleClose} />
        <h2 style={{ color: 'white' }}>
          Incorrect email or password. Please try again
        </h2>
        <button onClick={handleClose}>Close</button>
      </section>
    </div>
  );
};

export default LoginCheck;
