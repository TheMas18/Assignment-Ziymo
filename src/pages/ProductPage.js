import React from 'react';
import ProductDetail from '../components/ProductDetail';

function ProductPage({ match }) {
  return (
    <div>
      <ProductDetail match={match} />
    </div>
  );
}

export default ProductPage;
