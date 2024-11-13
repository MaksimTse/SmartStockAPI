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
        <div className="container">
            <Navigation links={[{ path: '/admin/products', label: 'Manage Products' }]} />
            <h2>User Management</h2>
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Created Date</th> {}
                    <th>Phone Number</th> {}
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>{new Date(user.createdDate).toLocaleDateString()}</td> {}
                        <td>{user.phoneNumber || 'N/A'}</td> {}
                        <td>
                            <button onClick={() => deleteUser(user.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminUsers;
