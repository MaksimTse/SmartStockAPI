import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Navigation from './Navigation';

const UserOrders = () => {
    const [orders, setOrders] = useState([]);
    const [message, setMessage] = useState('');
    const [editingNotes, setEditingNotes] = useState({});

    const fetchOrders = async () => {
        try {
            const response = await axios.get('http://localhost:5077/api/Orders');
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setMessage('Failed to load orders.');
        }
    };

    const updateNotes = async (orderId) => {
        try {
            const updatedOrder = orders.find(order => order.id === orderId);
            updatedOrder.notes = editingNotes[orderId];

            await axios.put(`http://localhost:5077/api/Orders/${orderId}`, updatedOrder);

            setMessage('Tellimuse märkmete värskendamine õnnestus!');
            fetchOrders();
        } catch (error) {
            console.error('Error updating notes:', error);
            setMessage('Tellimuse märkmete värskendamine ebaõnnestus.');
        }
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text('Teie tellimused', 14, 10);

        const tableData = orders.map(order => [
            order.id,
            order.productName,
            order.quantity,
            new Date(order.orderDate).toLocaleDateString(),
            order.notes || 'N/A',
        ]);

        doc.autoTable({
            head: [['ID', 'Toote nimi', 'Kogus', 'Tellimuse kuupäev', 'Märkmed']],
            body: tableData,
        });

        doc.save('tellimus.pdf');
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <>
            <div className="background-container"></div> {/* Добавляем фон с размитием */}
            <div className="container">
                <Navigation links={[{ path: '/user/products', label: 'Tooted' }]} />
                <h2>Your Orders</h2>
                {message && <p style={{ color: 'green' }}>{message}</p>}

                {orders.length > 0 ? (
                    <>
                        <table>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Toote nimi</th>
                                <th>Kogus</th>
                                <th>Tellimuse kuupäev</th>
                                <th>Märkmed</th>
                                <th>Tegevus</th>
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
                                            className="AddText"
                                            type="text"
                                            value={editingNotes[order.id] || order.notes || ''}
                                            onChange={(e) => setEditingNotes({ ...editingNotes, [order.id]: e.target.value })}
                                        />
                                    </td>
                                    <td>
                                        <button onClick={() => updateNotes(order.id)} className="btn">
                                            Uuenda märkmeid
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <br />
                        <button onClick={generatePDF} className="btn">
                            Laadige alla PDF-ina
                        </button>
                    </>
                ) : (
                    <p>Tellimusi ei leitud.</p>
                )}
            </div>
        </>
    );
};

export default UserOrders;
