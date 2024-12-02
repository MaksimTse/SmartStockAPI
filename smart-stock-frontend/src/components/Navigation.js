import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navigation = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/');
    };

    return (
        <div className="navigation">
            <Link to="/products" className="nav-link">Tooted</Link>
            <Link to="/customers" className="nav-link">Kliendid</Link>
            <Link to="/suppliers" className="nav-link">Tarnijad</Link>
            <button className="logout-btn" onClick={handleLogout}>Logi välja</button>
        </div>
    );
};

export default Navigation;
