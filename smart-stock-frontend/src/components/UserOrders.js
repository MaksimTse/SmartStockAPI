import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Navigation from './Navigation';

const UserOrders = () => {
    const [orders, setOrders] = useState([]);
    const [message, setMessage] = useState('');
    const [editingNotes, setEditingNotes] = useState({}); // Для хранения заметок, которые редактируются

    // Получить заказы пользователя
    const fetchOrders = async () => {
        try {
            const response = await axios.get('http://localhost:5077/api/Orders');
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setMessage('Failed to load orders.');
        }
    };

    // Обновить заметки
    const updateNotes = async (orderId) => {
        try {
            const updatedOrder = orders.find(order => order.id === orderId);
            updatedOrder.notes = editingNotes[orderId]; // Обновляем заметку

            await axios.put(`http://localhost:5077/api/Orders/${orderId}`, updatedOrder); // Предполагаем, что API поддерживает PUT запрос для обновления заказа

            setMessage('Order notes updated successfully!');
            fetchOrders(); // Обновляем список заказов
        } catch (error) {
            console.error('Error updating notes:', error);
            setMessage('Failed to update order notes.');
        }
    };

    // Создать PDF
    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text('Your Orders', 14, 10);

        const tableData = orders.map(order => [
            order.id,
            order.productName,
            order.quantity,
            new Date(order.orderDate).toLocaleDateString(),
            order.notes || 'N/A',
        ]);

        doc.autoTable({
            head: [['ID', 'Product Name', 'Quantity', 'Order Date', 'Notes']],
            body: tableData,
        });

        doc.save('orders.pdf');
    };

    // Загрузка данных при первом рендере
    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div className="container">
            <Navigation links={[{ path: '/user/products', label: 'Products' }]} />
            <h2>Your Orders</h2>
            {message && <p style={{ color: 'green' }}>{message}</p>}

            {/* Таблица заказов */}
            {orders.length > 0 ? (
                <>
                    <table>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Product Name</th>
                            <th>Quantity</th>
                            <th>Order Date</th>
                            <th>Notes</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.productName}</td>
                                <td>{order.quantity}</td>
                                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                                <td>
                                    <input
                                        type="text"
                                        value={editingNotes[order.id] || order.notes || ''}
                                        onChange={(e) => setEditingNotes({ ...editingNotes, [order.id]: e.target.value })}
                                    />
                                </td>
                                <td>
                                    <button onClick={() => updateNotes(order.id)} className="btn">
                                        Update Notes
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <br/>
                    <button onClick={generatePDF} className="btn">
                        Download as PDF
                    </button>
                </>
            ) : (
                <p>No orders found.</p>
            )}
        </div>
    );
};

export default UserOrders;
