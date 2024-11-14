import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navigation = ({ links }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <nav className="navigation">
            {links.map((link) => (
                <a key={link.path} href={link.path} className="nav-link">
                    {link.label}
                </a>
            ))}
            <button onClick={handleLogout} className="logout-btn">Logi välja</button>
        </nav>
    );
};

export default Navigation;
