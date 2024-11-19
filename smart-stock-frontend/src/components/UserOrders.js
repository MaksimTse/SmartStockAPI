import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Navigation from './Navigation';

const UserOrders = () => {
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
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

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5077/api/User/all');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const generatePDF = () => {
        try {
            const doc = new jsPDF();

            doc.setFontSize(16);
            doc.text('Teie tellimused', 14, 10);

            const randomArvNr = Math.floor(100000 + Math.random() * 900000).toString();
            const randomRegCode = Math.floor(100000 + Math.random() * 900000).toString();
            const todayDate = new Date().toLocaleDateString();

            doc.setFontSize(12);
            doc.text(`Arve nr: ${randomArvNr}`, 14, 20);
            doc.text(`Koostanud: ${todayDate}`, 14, 25);

            const tableData = orders.map(order => [
                order.productName,
                order.quantity,
                new Date(order.orderDate).toLocaleDateString(),
                order.notes || 'N/A',
            ]);

            doc.autoTable({
                head: [['Toote nimi', 'Kogus', 'Tellimuse kuupäev', 'Märkmed']],
                body: tableData,
                startY: 40,
            });

            const y = doc.lastAutoTable.finalY + 10;

            doc.setFontSize(12);
            doc.text('Juriidiline info', 14, y);
            doc.text(`Registrikood: ${randomRegCode}`, 14, y + 10);

            users.forEach((user, index) => {
                const userY = y + 20 + index * 10;
                doc.text(`E-mail: ${user.email || 'Not Specified'}`, 14, userY);
                doc.text(`Telefoni number: ${user.phoneNumber || 'Not Specified'}`, 14, userY + 5);
            });

            doc.save('tellimus.pdf');
        } catch (error) {
            console.error('Error while generating PDF:', error);
            setMessage('Error while creating PDF.');
        }
    };



    useEffect(() => {
        fetchOrders();
        fetchUsers();
    }, []);

    return (
        <>
            <div className="background-container"></div> {}
            <div className="container">
                    <Navigation links={[{ path: '/user/products', label: 'Tooted' }]} />
                <h2>Teie tellimused</h2>
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
                        <button onClick={generatePDF} className="btn-pdf">
                            Laadi alla PDF-ina
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
