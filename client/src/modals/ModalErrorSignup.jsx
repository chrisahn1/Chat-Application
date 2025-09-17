import React, { useEffect, useState } from 'react';

const ErrorSignup = ({ isOpen, handleClose }) => {
  return (
    <div className={isOpen ? 'modal display-block' : 'modal display-none'}>
      <section className="modal-main">
        <h2>Username or Email already exists</h2>
        <button onClick={handleClose}>Close</button>
      </section>
    </div>
  );
};

export default ErrorSignup;
