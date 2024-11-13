import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../style.css';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState(''); // Новое поле для номера телефона
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5077/api/User/register', {
                email,
                passwordHash: password,
                phoneNumber, // Передаем номер телефона
            });
            setMessage(response.data.message || 'Registration successful');
            navigate('/products'); // Обработка ответа
        } catch (error) {
            if (error.response) {
                // Обработка ошибок валидации
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
        <div className="container">
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
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
                <input
                    type="text"
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                />
                <button type="submit">Register</button>
            </form>
            {message && (
                <p>
                    {typeof message === 'string' ? message : JSON.stringify(message)}
                </p>
            )}
            <p>
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </div>
    );
};

export default Register;
