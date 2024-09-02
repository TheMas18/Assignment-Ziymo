import React from 'react';

function Cart({ cart, updateQuantity }) {

  const calculateTotalPrice = (item) => {
    const price = parseFloat(item.price) || 0; 
    return price * (item.quantity || 1); 
  };


  const calculateGrandTotal = () => 
    cart.reduce((total, item) => total + calculateTotalPrice(item), 0);

  return (
    <div className="container">
      <h2 className="my-4">Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Product Image</th>
              <th scope="col">Product Name</th>
              <th scope="col">Price</th>
              <th scope="col">Quantity</th>
              <th scope="col">Total Price</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item, index) => (
              <tr key={index}>
                <td>
                  <img
                    src={item.image_url}
                    alt={item.name}
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                  />
                </td>
                <td>{item.name}</td>
                <td>${parseFloat(item.price).toFixed(2)}</td>
                <td>
                  <input
                    type="number"
                    value={item.quantity || 1}
                    min="1"
                    onChange={(e) => updateQuantity(item, parseInt(e.target.value))}
                    style={{ width: '60px' }}
                  />
                </td>
                <td>${calculateTotalPrice(item).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="4" className="text-right font-weight-bold">Grand Total</td>
              <td className="font-weight-bold">${calculateGrandTotal().toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      )}
    </div>
  );
}

export default Cart;
