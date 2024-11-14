import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navigation from './Navigation';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:5077/api/User/all');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const deleteUser = async (id) => {
        try {
            await axios.delete(`http://localhost:5077/api/User/${id}`);
            setUsers(users.filter((user) => user.id !== id));
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    return (
        <>
            <div className="background-container"></div> {/* Добавляем размытие фона */}
            <div className="container">
                <Navigation links={[{ path: '/admin/products', label: 'Hallake tooteid' }]} />
                <h2>Kasutajate haldamine</h2>
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>E-mail</th>
                        <th>Roll</th>
                        <th>Loomise kuupäev</th>
                        <th>Telefoninumber</th>
                        <th>Tegevused</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>{new Date(user.createdDate).toLocaleDateString()}</td>
                            <td>{user.phoneNumber || 'N/A'}</td>
                            <td>
                                <button className="logout-btn" onClick={() => deleteUser(user.id)}>Kustuta</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default AdminUsers;
