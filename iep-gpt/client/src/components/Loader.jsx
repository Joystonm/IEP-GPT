import React from 'react';

const Loader = ({ message }) => {
  return (
    <div className="loader-container">
      <div className="loader"></div>
      <p className="loader-message">{message || 'Loading...'}</p>
    </div>
  );
};

export default Loader;
