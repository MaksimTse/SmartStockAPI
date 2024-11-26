import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navigation from './Navigation';

const Customers = () => {
    const [customers, setCustomers] = useState([]);

    const fetchCustomers = async () => {
        try {
            const response = await axios.get('http://localhost:5077/api/User/all');
            setCustomers(response.data);
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    return (
        <>
        <div className="background-container"></div> {}
            <div className="container USNone">
                <Navigation />
                <h2>Customers</h2>
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Email</th>
                        <th>Phone Number</th>
                    </tr>
                    </thead>
                    <tbody>
                    {customers.map((customer) => (
                        <tr key={customer.id}>
                            <td>{customer.id}</td>
                            <td>{customer.email}</td>
                            <td>{customer.phoneNumber}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default Customers;
