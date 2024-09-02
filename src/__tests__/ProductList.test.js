
import { render, screen } from '@testing-library/react';
import ProductList from '../components/ProductList';
import { fetchProducts } from '../api';

jest.mock('../api');

test('renders product list', async () => {
    fetchProducts.mockResolvedValue({
        products: [{ id: 1, name: 'Product 1', description: 'Description', price: 100, image_url: 'url' }]
    });

    render(<ProductList />);
    expect(await screen.findByText('Product 1')).toBeInTheDocument();
});
