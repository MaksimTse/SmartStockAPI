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
                <button className="btn2" onClick={() => navigate('/products')}>
                    Lisa uus toode
                </button>
                <button className="btn2" onClick={() => navigate('/customers')}>
                    Vaata kliente
                </button>
                <button className="btn2" onClick={() => navigate('/suppliers')}>
                    Vaadake tarnijaid
                </button>
                <button className="logout-btn USNone" onClick={handleLogout}>
                    Logi välja
                </button>
            </div>
        </>
    );
};

export default AdminDashboard;
