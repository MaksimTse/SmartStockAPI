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
            console.error('Tarnija kinnitamisel tekkis viga:', error);
        }
    };

    const unapproveSupplier = async (id) => {
        try {
            await axios.put(`http://localhost:5077/api/Supplier/unapprove/${id}`);
            fetchSuppliers();
        } catch (error) {
            console.error('Viga tarnija heakskiitmise tühistamisel:', error);
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
                <h2>Tarnijad</h2>
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nimi</th>
                        <th>Meil</th>
                        <th>Telefoninumber</th>
                        <th>Staatus</th>
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
                                        <span>Vastu võetud</span>
                                        <button
                                            className="btn2"
                                            onClick={() => unapproveSupplier(supplier.id)}
                                        >
                                            Tühista
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        className="btn2"
                                        onClick={() => approveSupplier(supplier.id)}
                                    >
                                        Kinnita
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
