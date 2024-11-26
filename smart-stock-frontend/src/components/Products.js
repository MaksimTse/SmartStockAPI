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
    const [showForm, setShowForm] = useState(false); // Состояние видимости формы

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
                setMessage('Product updated successfully.');
            } else {
                await axios.post('http://localhost:5077/api/Storage', newProduct);
                setMessage('Product added successfully.');
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
                <h2>Product Management</h2>
                {message && <p>{message}</p>}

                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Category</th>
                        <th>Location</th>
                        <th>Product Name</th>
                        <th>Quantity</th>
                        <th>Supplier Price</th>
                        <th>User Price</th>
                        <th>Actions</th>
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
                                <button className="btn2" onClick={() => startEditing(product)}>Edit</button>
                                <button className="logout-btn" onClick={() => deleteProduct(product.id)}>Delete</button>
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
                        Add New Product
                    </h3>
                )}

                {showForm && (
                    <form onSubmit={saveProduct}>
                        <input
                            type="text"
                            placeholder="Category"
                            value={newProduct.category}
                            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Location"
                            value={newProduct.location}
                            onChange={(e) => setNewProduct({ ...newProduct, location: e.target.value })}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Product Name"
                            value={newProduct.productName}
                            onChange={(e) => setNewProduct({ ...newProduct, productName: e.target.value })}
                            required
                        />
                        <input
                            type="number"
                            placeholder="Quantity"
                            value={newProduct.quantity}
                            onChange={(e) => setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) })}
                            required
                        />
                        <input
                            type="number"
                            placeholder="Supplier Price"
                            value={newProduct.supplierPrice}
                            onChange={(e) => setNewProduct({ ...newProduct, supplierPrice: parseFloat(e.target.value) })}
                            required
                        />
                        <input
                            type="number"
                            placeholder="User Price"
                            value={newProduct.userPrice}
                            onChange={(e) => setNewProduct({ ...newProduct, userPrice: parseFloat(e.target.value) })}
                            required
                        />
                        <button className="btn2" type="submit">
                            {isEditing ? 'Update Product' : 'Add Product'}
                        </button>
                        <button className="logout-btn" type="button" onClick={resetForm}>
                            Cancel
                        </button>
                    </form>
                )}
            </div>
        </>
    );
};

export default Products;
