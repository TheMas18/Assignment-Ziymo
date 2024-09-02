import React, { useEffect, useState } from 'react';
import { fetchProductById } from '../api';

function ProductDetail({ match }) {
  const [product, setProduct] = useState(null);
  const productId = match.params.id;

  useEffect(() => {
    const loadProduct = async () => {
      const result = await fetchProductById(productId);
      setProduct(result);

      let recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
      recentlyViewed = [result, ...recentlyViewed.filter(p => p.id !== result.id)];
      localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
    };

    loadProduct();
  }, [productId]);

  if (!product) return <div>Loading...</div>;

  return (
      <>
    <div>
      <h5>{product.name}</h5>
      <p>{product.description}</p>
      <p>${product.price}</p>
      <img src={product.image_url} alt={product.name} width="200" />
    </div>

    
    </>
  );
}

export default ProductDetail;