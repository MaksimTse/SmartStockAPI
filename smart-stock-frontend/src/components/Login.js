import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../style.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (email === 'admin@gmail.com' && password === 'admin') {
            setMessage('Welcome Admin!');
            navigate('/admin/products');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5077/api/User/login', {
                email,
                passwordHash: password,
            });

            setMessage(response.data.message || 'Login successful');
            navigate('/user/products');
        } catch (error) {
            if (error.response) {
                setMessage(error.response.data.title || 'Login failed');
            } else {
                setMessage('An error occurred. Please try again.');
            }
        }
    };

    return (
        <>
            <div className="background-container"></div> {}
            <div className="container">
                <h2>Logi Sisse</h2>
                <form onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="E-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Salasõna"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Logi Sisse</button>
                </form>
                {message && <p>{message}</p>}
                <p>
                    Kas teil pole kontot?{' '}
                    <Link to="/register" className="link">Registreeri siin</Link>
                </p>
            </div>
        </>
    );
};

export default Login;
