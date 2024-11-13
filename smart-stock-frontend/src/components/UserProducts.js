import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../style.css';
import Navigation from './Navigation';

const UserProducts = () => {
    const [products, setProducts] = useState([]);
    const [message, setMessage] = useState('');
    const [orderData, setOrderData] = useState({}); // Объект для хранения данных заказа для каждого продукта

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:5077/api/Storage');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    // Обработчик изменения количества
    const handleQuantityChange = (e, productId) => {
        setOrderData({
            ...orderData,
            [productId]: {
                ...orderData[productId],
                quantity: e.target.value,
            },
        });
    };

    // Обработчик изменения заметки
    const handleNotesChange = (e, productId) => {
        setOrderData({
            ...orderData,
            [productId]: {
                ...orderData[productId],
                notes: e.target.value,
            },
        });
    };

    const orderProduct = async (product) => {
        const { id } = product;
        const { quantity, notes } = orderData[id] || {};

        if (!quantity || quantity < 1) {
            setMessage('Please specify a valid quantity.');
            return;
        }

        try {
            const userId = 1;

            await axios.post('http://localhost:5077/api/Orders', {
                productId: product.id,
                userId: userId,
                quantity: quantity, // Используем выбранное количество
                notes: notes || '', // Передаем заметку, если она есть
            });

            setMessage(`Order for ${product.productName} has been placed.`);
            fetchProducts(); // Обновить список продуктов
        } catch (error) {
            console.error('Error placing order:', error);

            if (error.response) {
                setMessage(error.response.data.message || 'Failed to place order. Please try again.');
            } else {
                setMessage('Failed to place order. Please try again.');
            }
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const userLinks = [
        { path: '/user/orders', label: 'My Orders' },
    ];

    return (
        <div className="container">
            <Navigation links={userLinks} />

            <h2>Available Products</h2>
            {message && <p style={{ color: message.includes('Failed') ? 'red' : 'green' }}>{message}</p>}

            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Category</th>
                    <th>Country</th>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>Order</th>
                </tr>
                </thead>
                <tbody>
                {products.map((product) => (
                    <tr key={product.id}>
                        <td>{product.id}</td>
                        <td>{product.category}</td>
                        <td>{product.country}</td>
                        <td>{product.productName}</td>
                        <td>{product.quantity}</td>
                        <td>
                            {/* Добавим поля для ввода количества и заметки */}
                            <input
                                type="number"
                                value={orderData[product.id]?.quantity || 1} // Привязываем количество к продукту
                                onChange={(e) => handleQuantityChange(e, product.id)}
                                min="1"
                                max={product.quantity}
                                style={{ width: '60px', marginRight: '8px' }}
                            />
                            <textarea
                                value={orderData[product.id]?.notes || ''}
                                onChange={(e) => handleNotesChange(e, product.id)}
                                placeholder="Add a note..."
                                style={{
                                    width: '150px',
                                    height: '50px',
                                    resize: 'none',
                                    marginBottom: '8px',
                                }}
                            />
                            <button
                                onClick={() => orderProduct(product)}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#6200ee',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                }}
                            >
                                Order
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserProducts;
