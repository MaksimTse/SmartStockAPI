import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navigation = ({ links }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Очистка данных пользователя (если хранятся в localStorage или Context)
        localStorage.clear();
        navigate('/login'); // Перенаправление на страницу входа
    };

    return (
        <nav className="navigation">
            {links.map((link) => (
                <a key={link.path} href={link.path} className="nav-link">
                    {link.label}
                </a>
            ))}
            <button onClick={handleLogout} className="logout-btn">Logout</button>
        </nav>
    );
};

export default Navigation;
