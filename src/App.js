import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import ProductList from './components/ProductList';
import Cart from './components/Cart';

function App() {
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const addToCart = (product) => {
    const existingProduct = cart.find(item => item.id === product.id);
    if (existingProduct) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (product, quantity) => {
    if (quantity > 0) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <Router>
      <NavBar onSearch={handleSearch} />
      <Routes>
        <Route path="/" element={<ProductList addToCart={addToCart} searchTerm={searchTerm} />} />
        <Route path="/cart" element={<Cart cart={cart} updateQuantity={updateQuantity} />} />
      </Routes>
    </Router>
  );
}

export default App;
