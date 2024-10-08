import React from 'react';
import '../styles/loader.css'; 


function Loader() {
  return (
    <div className="loader-container">
      <div className="spinner-border text-primary" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}

export default Loader;