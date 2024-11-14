import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../style.css';
import Navigation from './Navigation';

const UserProducts = () => {
    const [products, setProducts] = useState([]);
    const [message, setMessage] = useState('');
    const [orderData, setOrderData] = useState({});

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:5077/api/Storage');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleQuantityChange = (e, productId) => {
        setOrderData({
            ...orderData,
            [productId]: {
                ...orderData[productId],
                quantity: e.target.value,
            },
        });
    };

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
            setMessage('Palun määrake kehtiv kogus.');
            return;
        }

        try {
            const userId = 1;

            await axios.post('http://localhost:5077/api/Orders', {
                productId: product.id,
                userId: userId,
                quantity: quantity,
                notes: notes || '',
            });

            setMessage(`Toote ${product.productName} tellimus on esitatud.`);
            fetchProducts();
        } catch (error) {
            console.error('Viga tellimuse esitamisel:', error);

            if (error.response) {
                setMessage(error.response.data.message || 'Tellimuse esitamine ebaõnnestus. Palun proovi uuesti.');
            } else {
                setMessage('Tellimuse esitamine ebaõnnestus. Palun proovi uuesti.');
            }
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const userLinks = [
        { path: '/user/orders', label: 'Minu tellimused' },
    ];

    return (
        <>
            <div className="background-container"></div> {}
            <div className="container">
                <Navigation links={userLinks} />

                <h2>Saadaolevad tooted</h2>
                {message && <p style={{ color: message.includes('Failed') ? 'red' : 'green' }}>{message}</p>}

                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Kategooria</th>
                        <th>Riik</th>
                        <th>Toote nimi</th>
                        <th>Kogus</th>
                        <th>Telli</th>
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
                            <td className="line">
                                <input
                                    type="number"
                                    value={orderData[product.id]?.quantity || 1}
                                    onChange={(e) => handleQuantityChange(e, product.id)}
                                    min="1"
                                    max={product.quantity}
                                    style={{ width: '60px', marginRight: '8px' }}
                                />
                                <textarea
                                    value={orderData[product.id]?.notes || ''}
                                    onChange={(e) => handleNotesChange(e, product.id)}
                                    placeholder="Lisa märk..."
                                    style={{
                                        width: '150px',
                                        height: '24px',
                                        resize: 'none',
                                        marginBottom: '8px',
                                    }}
                                />
                                <button
                                    className="btn2"
                                    onClick={() => orderProduct(product)}
                                    style={{
                                        height: '41px',
                                        resize: 'none',
                                        marginBottom: '8px',
                                        marginTop: '5px',
                                    }}
                                >
                                    Telli
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default UserProducts;
