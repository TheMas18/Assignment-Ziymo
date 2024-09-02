import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import cartLogo from '../assets/images/cart.png';

export default function NavBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <nav className="navbar navbar-light bg-dark">
      <Link className="navbar-brand" to="/" style={{ color: 'Yellow' }}>Zimyo</Link>
      <form className="form-inline my-1 mx-auto" onSubmit={handleSearchSubmit}>
        <input 
          className="form-control mr-sm-2 bg-dark text-white border-white" 
          type="search" 
          placeholder="Search" 
          aria-label="Search"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button className="btn btn-outline-success my-2 my-sm-0 bg-success text-white border-white" type="submit">Search</button>
        <Link to="/cart" className="btn btn-outline-success my-2 my-sm-0 bg-warning text-white border-white ml-2">
          <img src={cartLogo} alt="Cart" style={{ width: '20px', height: '20px', marginRight: '8px' }} />
          Cart
        </Link>
      </form>
    </nav>
  );
}
