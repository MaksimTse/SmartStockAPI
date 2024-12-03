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
            setMessage('Tellimus sooritatud edukalt!');
            setShowModal(false);
            fetchProducts();
            fetchOrders();
        } catch (error) {
            console.error('Error placing order:', error);
        }
    };

    const exportOrdersToPDF = () => {
        const doc = new jsPDF();
        const tableColumn = ['ID', 'Toote nimi', 'Kogus', 'Hind kauba kohta', 'Hind kokku', 'Tellimuse kuupäev'];
        const tableRows = [];
        let totalPrice = 0;
        const randomInvoiceNumber = Math.floor(100000 + Math.random() * 900000);
        const email = localStorage.getItem('userEmail') || 'N/A';
        const currentDate = new Date().toLocaleString();

        orders.forEach((order) => {
            const pricePerItem = order.userPrice;
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

        doc.text(`Arve #: ${randomInvoiceNumber}`, 14, 15);
        doc.text(`Kliendi e-post: ${email}`, 14, 25);
        doc.text(`Loodud: ${currentDate}`, 14, 35);
        doc.text('Klientide tellimused', 14, 45);

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 50,
        });

        doc.text(`Hind kokku: ${totalPrice.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 10);
        doc.save(`Kliendi_tellimused_${randomInvoiceNumber}.pdf`);
    };



    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    return (
        <>
            <div className="background-container"></div>
            <div className="container">
                <button className="logout-btn" onClick={handleLogout}>Logi välja</button>
                <h2>Saadaolevad tooted</h2>
                {message && <p>{message}</p>}
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Kategooria</th>
                        <th>Nimi</th>
                        <th>Hind</th>
                        <th>Kogus</th>
                        <th>Tegevused</th>
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
                                    Telli
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                <h2>Teie tellimused</h2>
                <button className="btn2" onClick={exportOrdersToPDF}>
                    Ekspordi PDF-i
                </button>
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Toote nimi</th>
                        <th>Kogus</th>
                        <th>Tellimuse kuupäev</th>
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
                        <h3>Telli Toode</h3>
                        <p>{selectedProduct?.productName}</p>
                        <p>Saadaval: {selectedProduct?.quantity}</p>
                        <input
                            type="number"
                            min="1"
                            max={selectedProduct?.quantity}
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value))}
                        />
                        <button className="btn2" onClick={placeOrder}>Kinnita</button>
                        <button className="logout-btn" onClick={() => setShowModal(false)}>Tühista</button>
                    </div>
                )}
            </div>
        </>
    );
};

export default CustomerProducts;
