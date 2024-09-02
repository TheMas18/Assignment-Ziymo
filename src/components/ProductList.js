import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../api';
import '../styles/card.css';
import cartLogo from '../assets/images/cart.png';
import Loader from '../components/Loader';

const DEFAULT_IMAGE_URL = 'https://heavyhandenterprise.com/cdn/shop/products/1_1024x1024@2x.jpg?v=1614886958';

function ProductList({ addToCart, searchTerm }) {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [limit] = useState(8);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            const result = await fetchProducts(page, limit, searchTerm);
            setProducts(result.products);
            setTotalPages(result.totalPages);
            setLoading(false);
        };

        loadProducts();
    }, [page, limit, searchTerm]);

    const isNextDisabled = page >= totalPages || totalPages === 0;
    const isPrevDisabled = page === 1;

    return (
        <div className='container'>
            <h2 className='text-center my-4'>Product List</h2>
            {loading ? (
                <Loader />
            ) : (
                <div className='row g-4'>
                    {products.length > 0 ? (
                        products.map(product => (
                            <div key={product.id} className="col-sm-6 col-md-4 col-lg-3 mb-4">
                                <div className="card d-flex flex-column">
                                    <img 
                                        src={product.image_url || DEFAULT_IMAGE_URL} 
                                        className='card-img-top' 
                                        alt={product.name} 
                                        style={{ height: '200px', objectFit: 'cover' }} 
                                    />
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title">{product.name}</h5>
                                        <h5 className="card-title">Category: {product.category}</h5>
                                        <p className="card-text flex-grow-1">{product.description}</p>
                                        <p className="card-price">${product.price}</p>
                                        <button
                                            onClick={() => addToCart(product)}
                                            className="btn btn-primary my-sm-0 bg-warning text-white border-white ml-2"
                                        >
                                            <img src={cartLogo} alt="Cart" style={{ width: '20px', height: '20px', marginRight: '8px' }} />
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No products found.</p>
                    )}
                </div>
            )}
            <div className='d-flex justify-content-between mt-4'>
                <button
                    className='btn btn-primary'
                    onClick={() => setPage(page - 1)}
                    disabled={isPrevDisabled}
                >
                    Previous
                </button>
                <button
                    className='btn btn-primary'
                    onClick={() => setPage(page + 1)}
                    disabled={isNextDisabled}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default ProductList;
