import React from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate("/");
    };

    return (
        <>
        <div className="background-container"></div> {}
            <div className="container">
                <h2 className="USNone">Admin Dashboard</h2>
                <button className="btn2" onClick={() => navigate('/add-product')}>
                    Add New Product
                </button>
                <button className="btn2" onClick={() => navigate('/view-customers')}>
                    View Customers
                </button>
                <button className="btn2" onClick={() => navigate('/view-suppliers')}>
                    View Suppliers
                </button>
                <button className="logout-btn USNone" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </>
    );
};

export default AdminDashboard;
