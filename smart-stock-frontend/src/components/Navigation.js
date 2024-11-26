import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navigation = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/');
    };

    return (
        <div className="navigation">
            <Link to="/products" className="nav-link">Products</Link>
            <Link to="/customers" className="nav-link">Customers</Link>
            <Link to="/suppliers" className="nav-link">Suppliers</Link>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Navigation;
