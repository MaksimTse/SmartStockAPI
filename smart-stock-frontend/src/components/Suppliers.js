import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navigation from './Navigation';

const Suppliers = () => {
    const [suppliers, setSuppliers] = useState([]);

    const fetchSuppliers = async () => {
        try {
            const response = await axios.get('http://localhost:5077/api/Supplier');
            setSuppliers(response.data);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
        }
    };

    const approveSupplier = async (id) => {
        try {
            await axios.put(`http://localhost:5077/api/Supplier/approve/${id}`);
            fetchSuppliers();
        } catch (error) {
            console.error('Error approving supplier:', error);
        }
    };

    const unapproveSupplier = async (id) => {
        try {
            await axios.put(`http://localhost:5077/api/Supplier/unapprove/${id}`);
            fetchSuppliers();
        } catch (error) {
            console.error('Error unapproving supplier:', error);
        }
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    return (
        <>
            <div className="background-container"></div>
            <div className="container USNone">
                <Navigation />
                <h2>Suppliers</h2>
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone Number</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {suppliers.map((supplier) => (
                        <tr key={supplier.id}>
                            <td>{supplier.id}</td>
                            <td>{supplier.name}</td>
                            <td>{supplier.contactEmail}</td>
                            <td>{supplier.phoneNumber}</td>
                            <td>
                                {supplier.isApproved ? (
                                    <>
                                        <span>Accepted</span>
                                        <button
                                            className="btn2"
                                            onClick={() => unapproveSupplier(supplier.id)}
                                        >
                                            Unapprove
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        className="btn2"
                                        onClick={() => approveSupplier(supplier.id)}
                                    >
                                        Approve
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default Suppliers;
