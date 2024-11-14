import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../style.css';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5077/api/User/register', {
                email,
                passwordHash: password,
                phoneNumber,
            });
            setMessage(response.data.message || 'Registration successful');
            navigate('/products');
        } catch (error) {
            if (error.response) {
                const errors = error.response.data.errors;
                if (errors) {
                    const errorMessages = Object.values(errors).flat().join(' ');
                    setMessage(errorMessages); // Отображаем сообщения об ошибке
                } else {
                    setMessage(error.response.data.title || 'Registration failed');
                }
            } else if (error.request) {
                setMessage('No response from server. Please try again.');
            } else {
                setMessage('An error occurred. Please try again.');
            }
        }
    };

    return (
        <>
            <div className="background-container"></div> {}
            <div className="container">
                <h2>Registreeri</h2>
                <form onSubmit={handleRegister}>
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
                    <input
                        type="text"
                        placeholder="Telefoninumber"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                    />
                    <button type="submit">Registreeri</button>
                </form>
                {message && (
                    <p>
                        {typeof message === 'string' ? message : JSON.stringify(message)}
                    </p>
                )}
                <p>
                    Kas teil on juba konto? <Link to="/login" className="link">Logi Sisse</Link>
                </p>
            </div>
        </>
    );
};

export default Register;
