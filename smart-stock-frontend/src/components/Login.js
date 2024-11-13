import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Импортируем Link
import axios from 'axios';
import '../style.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        // Проверка для администратора
        if (email === 'admin@gmail.com' && password === 'admin') {
            setMessage('Welcome Admin!');
            navigate('/admin/products'); // Перенаправляем администратора
            return;
        }

        // Запрос для обычного пользователя
        try {
            const response = await axios.post('http://localhost:5077/api/User/login', {
                email,
                passwordHash: password,
            });

            setMessage(response.data.message || 'Login successful');
            navigate('/user/products'); // Перенаправляем обычного пользователя
        } catch (error) {
            if (error.response) {
                setMessage(error.response.data.title || 'Login failed');
            } else {
                setMessage('An error occurred. Please try again.');
            }
        }
    };

    return (
        <div className="container">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
            {message && <p>{message}</p>}
            <p>
                Don't have an account?{' '}
                <Link to="/register" className="link">Register here</Link>
            </p>
        </div>
    );
};

export default Login;
