import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const CustomerProducts = () => {
    const [products, setProducts] = useState([]);
    const [customerId, setCustomerId] = useState(null);
    const [orders, setOrders] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [message, setMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            setCustomerId(decoded.sub);
        }
    }, []);

    useEffect(() => {
        if (customerId) {
            fetchProducts();
            fetchOrders();
        }
    }, [customerId]);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:5077/api/Storage');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const fetchOrders = async () => {
        try {
            const response = await axios.get(`http://localhost:5077/api/Orders/customer/${customerId}`);
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const placeOrder = async () => {
        if (!selectedProduct || quantity <= 0 || quantity > selectedProduct.quantity) {
            setMessage('Invalid quantity or product selection.');
            return;
        }

        try {
            await axios.post('http://localhost:5077/api/Orders', {
                productId: selectedProduct.id,
                userId: customerId,
                quantity,
            });
            setMessage('Order placed successfully!');
            setShowModal(false);
            fetchProducts();
            fetchOrders();
        } catch (error) {
            console.error('Error placing order:', error);
        }
    };

    const exportOrdersToPDF = () => {
        const doc = new jsPDF();
        const tableColumn = ['ID', 'Product Name', 'Quantity', 'Price per Item', 'Total Price', 'Order Date'];
        const tableRows = [];
        let totalPrice = 0;
        const randomInvoiceNumber = Math.floor(100000 + Math.random() * 900000);
        const email = localStorage.getItem('userEmail') || 'N/A';
        const currentDate = new Date().toLocaleString();

        orders.forEach((order) => {
            const pricePerItem = order.userPrice; // Теперь UserPrice приходит из API
            const itemTotal = order.quantity * pricePerItem;

            const orderData = [
                order.id,
                order.productName || 'N/A',
                order.quantity,
                pricePerItem.toFixed(2),
                itemTotal.toFixed(2),
                new Date(order.orderDate).toLocaleString(),
            ];

            tableRows.push(orderData);
            totalPrice += itemTotal;
        });

        doc.text(`Invoice #: ${randomInvoiceNumber}`, 14, 15);
        doc.text(`Customer Email: ${email}`, 14, 25);
        doc.text(`Generated on: ${currentDate}`, 14, 35);
        doc.text('Customer Orders', 14, 45);

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 50,
        });

        doc.text(`Total Price: ${totalPrice.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 10);
        doc.save(`Customer_Orders_${randomInvoiceNumber}.pdf`);
    };



    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    return (
        <>
            <div className="background-container"></div>
            <div className="container">
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
                <h2>Available Products</h2>
                {message && <p>{message}</p>}
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Category</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td>{product.id}</td>
                            <td>{product.category}</td>
                            <td>{product.productName}</td>
                            <td>{product.userPrice}</td>
                            <td>{product.quantity}</td>
                            <td>
                                <button
                                    className="btn2"
                                    onClick={() => {
                                        setSelectedProduct(product);
                                        setShowModal(true);
                                    }}
                                >
                                    Order
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                <h2>Your Orders</h2>
                <button className="btn2" onClick={exportOrdersToPDF}>
                    Export to PDF
                </button>
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Product Name</th>
                        <th>Quantity</th>
                        <th>Order Date</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map((order) => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.productName}</td>
                            <td>{order.quantity}</td>
                            <td>{new Date(order.orderDate).toLocaleString()}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {showModal && (
                    <div className="modal">
                        <h3>Order Product</h3>
                        <p>{selectedProduct?.productName}</p>
                        <p>Available: {selectedProduct?.quantity}</p>
                        <input
                            type="number"
                            min="1"
                            max={selectedProduct?.quantity}
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value))}
                        />
                        <button className="btn2" onClick={placeOrder}>Confirm</button>
                        <button className="logout-btn" onClick={() => setShowModal(false)}>Cancel</button>
                    </div>
                )}
            </div>
        </>
    );
};

export default CustomerProducts;
