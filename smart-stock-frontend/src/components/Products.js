import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navigation from './Navigation';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({
        category: '',
        location: '',
        productName: '',
        quantity: 0,
        date: new Date().toISOString().split('T')[0],
        supplierPrice: 0,
        userPrice: 0,
    });

    const [message, setMessage] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editProductId, setEditProductId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:5077/api/Storage');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const deleteProduct = async (id) => {
        try {
            await axios.delete(`http://localhost:5077/api/Storage/${id}`);
            setMessage('Toote kustutamine õnnestus.');
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const saveProduct = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await axios.put(`http://localhost:5077/api/Storage/${editProductId}`, newProduct);
                setMessage('Toote värskendamine õnnestus.');
            } else {
                await axios.post('http://localhost:5077/api/Storage', newProduct);
                setMessage('Toode edukalt lisatud.');
            }
            fetchProducts();
            resetForm();
        } catch (error) {
            console.error('Error saving product:', error);
        }
    };

    const startEditing = (product) => {
        setIsEditing(true);
        setEditProductId(product.id);
        setNewProduct({
            category: product.category,
            location: product.location,
            productName: product.productName,
            quantity: product.quantity,
            date: product.date,
            supplierPrice: product.supplierPrice,
            userPrice: product.userPrice,
        });
        setShowForm(true);
    };

    const resetForm = () => {
        setNewProduct({
            category: '',
            location: '',
            productName: '',
            quantity: 0,
            date: new Date().toISOString(),
            supplierPrice: 0,
            userPrice: 0,
        });
        setIsEditing(false);
        setEditProductId(null);
        setShowForm(false);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <>
            <div className="background-container"> </div>
            <div className="container USNone">
                <Navigation />
                <h2>Tootehaldus</h2>
                {message && <p>{message}</p>}

                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Kategooria</th>
                        <th>Asukoht</th>
                        <th>Toote nimi</th>
                        <th>Kogus</th>
                        <th>Tarnija hind</th>
                        <th>Kasutaja hind</th>
                        <th>Tegevused</th>
                    </tr>
                    </thead>
                    <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td>{product.id}</td>
                            <td>{product.category}</td>
                            <td>{product.location}</td>
                            <td>{product.productName}</td>
                            <td>{product.quantity}</td>
                            <td>{product.supplierPrice}</td>
                            <td>{product.userPrice}</td>
                            <td>
                                <button className="btn2" onClick={() => startEditing(product)}>Muuda</button>
                                <button className="logout-btn" onClick={() => deleteProduct(product.id)}>Kustuta</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {!showForm && (
                    <h3
                        onClick={() => setShowForm(true)}
                        style={{ cursor: 'pointer', color: '#ffffff', transition: 'color 0.3s ease' }}
                        onMouseEnter={(e) => (e.target.style.color = '#6200ee')}
                        onMouseLeave={(e) => (e.target.style.color = '#ffffff')}
                    >
                        Lisa uus toode
                    </h3>
                )}

                {showForm && (
                    <form onSubmit={saveProduct}>
                        <div className="input-container">
                            <input
                                type="text"
                                placeholder=" "
                                value={newProduct.category}
                                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                required
                            />
                            <label>Kategooria</label>
                        </div>
                        <div className="input-container">
                            <input
                                type="text"
                                placeholder=" "
                                value={newProduct.location}
                                onChange={(e) => setNewProduct({ ...newProduct, location: e.target.value })}
                                required
                            />
                            <label>Аsukoht</label>
                        </div>
                        <div className="input-container">
                            <input
                                type="text"
                                placeholder=" "
                                value={newProduct.productName}
                                onChange={(e) => setNewProduct({ ...newProduct, productName: e.target.value })}
                                required
                            />
                            <label>Toote nimi</label>
                        </div>
                        <div className="input-container">
                            <input
                                type="number"
                                placeholder=" "
                                value={newProduct.quantity}
                                onChange={(e) => setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) })}
                                required
                            />
                            <label>Kogus</label>
                        </div>
                        <div className="input-container">
                            <input
                                type="number"
                                placeholder=" "
                                value={newProduct.supplierPrice}
                                onChange={(e) => setNewProduct({ ...newProduct, supplierPrice: parseFloat(e.target.value) })}
                                required
                            />
                            <label>Tarnija hind</label>
                        </div>
                        <div className="input-container">
                            <input
                                type="number"
                                placeholder=" "
                                value={newProduct.userPrice}
                                onChange={(e) => setNewProduct({ ...newProduct, userPrice: parseFloat(e.target.value) })}
                                required
                            />
                            <label>Kasutaja hind</label>
                        </div>
                        <button className="btn2" type="submit">
                            {isEditing ? 'Uuenda toodet' : 'Lisa toode'}
                        </button>
                        <button className="logout-btn" type="button" onClick={resetForm}>
                            Tühista
                        </button>
                    </form>
                )}

            </div>
        </>
    );
};

export default Products;
