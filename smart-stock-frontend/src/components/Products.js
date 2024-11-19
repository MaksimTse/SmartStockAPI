import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../style.css';
import Navigation from './Navigation';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({
        category: '',
        location: '',
        productName: '',
        quantity: 0,
        orderer: 'NONE',
        date: new Date().toISOString().split('T')[0],
        additionalInfo: '',
    });
    const [message, setMessage] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editProductId, setEditProductId] = useState(null);

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
            setMessage('Product deleted successfully.');
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
            orderer: product.orderer,
            date: product.date,
            additionalInfo: product.additionalInfo,
        });
        setShowForm(true);
    };

    const resetForm = () => {
        setNewProduct({
            category: '',
            lcoation: '',
            productName: '',
            quantity: 0,
            orderer: 'NONE',
            date: new Date().toISOString().split('T')[0],
            additionalInfo: '',
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
            <div className="background-container"></div> {}
            <div className="container">
                <Navigation links={[{ path: '/admin/users', label: 'Kasutajate haldamine' }]} />

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
                        <th>Kuupäev</th>
                        <th>Lisainfo</th>
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
                            <td>{new Date(product.date).toLocaleDateString()}</td>
                            <td>{product.additionalInfo}</td>
                            <td className="line">
                                <button className="logout-btn" onClick={() => deleteProduct(product.id)}>Kustuta</button>
                                <button className="btn2" onClick={() => startEditing(product)}>Muuda</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                <h3
                    className="add-product-title"
                    onClick={() => {
                        resetForm();
                        setShowForm(true);
                    }}
                    style={{ cursor: 'pointer' }}
                >
                    ❯ {isEditing ? 'Redigeeri toodet' : 'Lisa uus toode'} ❮
                </h3>

                {showForm && (
                    <form onSubmit={saveProduct}>
                        <div className="input-container">
                            <label htmlFor="category">Kategooria</label>
                            <input
                                id="category"
                                type="text"
                                placeholder="Kategooria"
                                value={newProduct.category}
                                onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                                required
                            />
                        </div>

                        <div className="input-container">
                            <label htmlFor="location">Lokaadi (e.g., A1 - Shelf 1)</label>
                            <input
                                id="location"
                                type="text"
                                placeholder="Lokaadi (e.g., A1 - Shelf 1)"
                                value={newProduct.location}
                                onChange={(e) => setNewProduct({...newProduct, location: e.target.value})}
                                required
                            />
                        </div>

                        <div className="input-container">
                            <label htmlFor="productName">Toote nimi</label>
                            <input
                                id="productName"
                                type="text"
                                placeholder="Toote nimi"
                                value={newProduct.productName}
                                onChange={(e) => setNewProduct({...newProduct, productName: e.target.value})}
                                required
                            />
                        </div>

                        <div className="input-container">
                            <label htmlFor="quantity">Kogus</label>
                            <input
                                id="quantity"
                                type="number"
                                placeholder="Kogus"
                                value={newProduct.quantity}
                                onChange={(e) => setNewProduct({...newProduct, quantity: parseInt(e.target.value)})}
                                required
                            />
                        </div>

                        <div className="input-container">
                            <label htmlFor="additionalInfo">Lisainfo</label>
                            <input
                                id="additionalInfo"
                                type="text"
                                placeholder="Lisainfo"
                                value={newProduct.additionalInfo}
                                onChange={(e) => setNewProduct({...newProduct, additionalInfo: e.target.value})}
                            />
                        </div>

                        <button type="submit">{isEditing ? 'Uuenda toodet' : 'Lisa toode'}</button>
                        <button type="button" onClick={resetForm}>Tühista</button>
                    </form>
                )}
            </div>
        </>
    );
};

export default Products;
