import React, { useState } from 'react';
import { searchProducts } from '../api'; // Ensure this import is correct

function SearchBar({ setProducts }) {
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');

  const handleSearch = async () => {
    try {
      const result = await searchProducts(keyword, category);
      setProducts(result.products); // Ensure this matches the structure of your API response
    } catch (err) {
      setError('An error occurred while searching.');
    }
  };

  return (
    <div>
      {error && <p className="error">{error}</p>}
      <input 
        type="text" 
        value={keyword} 
        onChange={e => setKeyword(e.target.value)} 
        placeholder="Search keyword" 
      />
      <input 
        type="text" 
        value={category} 
        onChange={e => setCategory(e.target.value)} 
        placeholder="Search category" 
      />
      <button onClick={handleSearch}>Sesarch</button>
    </div>
  );
}

export default SearchBar;
