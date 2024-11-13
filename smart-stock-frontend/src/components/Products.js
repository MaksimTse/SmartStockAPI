import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../style.css';
import Navigation from './Navigation';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({
        category: '',
        country: '',
        productName: '',
        quantity: 0,
        orderer: '',
        date: '',
        additionalInfo: '',
    });
    const [message, setMessage] = useState('');

    // Получить все продукты
    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:5077/api/Storage');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    // Удалить продукт
    const deleteProduct = async (id) => {
        try {
            await axios.delete(`http://localhost:5077/api/Storage/${id}`);
            setMessage('Product deleted successfully.');
            fetchProducts(); // Обновляем список после удаления
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    // Добавить продукт
    const addProduct = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5077/api/Storage', newProduct);
            setMessage('Product added successfully.');
            fetchProducts(); // Обновляем список после добавления
            setNewProduct({
                category: '',
                country: '',
                productName: '',
                quantity: 0,
                orderer: '',
                date: '',
                additionalInfo: '',
            });
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    // Загрузка данных при первом рендере
    useEffect(() => {
        fetchProducts();
    }, []);

    // Ссылки для навигации
    const adminLinks = [
        { path: '/admin/users', label: 'Manage Users' },
    ];

    const userLinks = [
        { path: '/user/orders', label: 'Orders' },
    ];

    // Здесь можно будет подставить ссылки в зависимости от роли пользователя.
    const navigationLinks = adminLinks; // Замените на `userLinks` для пользователей

    return (
        <div className="container">
            <Navigation links={navigationLinks} /> {/* Навигация */}

            <h2>Product Management</h2>
            {message && <p>{message}</p>}

            {/* Таблица с продуктами */}
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Category</th>
                    <th>Country</th>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>Orderer</th>
                    <th>Date</th>
                    <th>Additional Info</th>
                    <th>Actions</th>
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
                        <td>{product.orderer}</td>
                        <td>{new Date(product.date).toLocaleDateString()}</td>
                        <td>{product.additionalInfo}</td>
                        <td>
                            <button onClick={() => deleteProduct(product.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Форма для добавления продукта */}
            <h3>Add New Product</h3>
            <form onSubmit={addProduct}>
                <input
                    type="text"
                    placeholder="Category"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Country"
                    value={newProduct.country}
                    onChange={(e) => setNewProduct({ ...newProduct, country: e.target.value })}
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
                    type="text"
                    placeholder="Orderer"
                    value={newProduct.orderer}
                    onChange={(e) => setNewProduct({ ...newProduct, orderer: e.target.value })}
                    required
                />
                <input
                    type="date"
                    value={newProduct.date}
                    onChange={(e) => setNewProduct({ ...newProduct, date: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Additional Info"
                    value={newProduct.additionalInfo}
                    onChange={(e) => setNewProduct({ ...newProduct, additionalInfo: e.target.value })}
                />
                <button type="submit">Add Product</button>
            </form>
        </div>
    );
};

export default Products;
