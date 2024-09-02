
import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const fetchProducts = async (page, limit, searchTerm = '') => {
    try {
        const response = await axios.get(`${API_URL}/products`, {
            params: { page, limit, searchTerm } 
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

export const fetchProductById = async (id) => {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data;
};

export const searchProducts = async (keyword, category) => {
    const response = await axios.get(`${API_URL}/search`, {
        params: { keyword, category }
    });
    return response.data;
};
