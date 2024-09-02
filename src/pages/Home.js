import React from 'react';
import ProductList from '../components/ProductList';
import SearchBar from '../components/SearchBar';

function Home() {
  return (
    <div>
     {/* <SearchBar setProducts={products => { Implement product update logic }} /> */}
      <ProductList />
    </div>
  );
}

export default Home;
