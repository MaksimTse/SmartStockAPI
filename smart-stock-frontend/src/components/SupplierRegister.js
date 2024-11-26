import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function SupplierRegister() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const handleRegister = async () => {
        try {
            await axios.post('http://localhost:5077/api/Supplier/register', {
                name,
                contactEmail: email,
                passwordHash: password,
                phoneNumber,
            });
            alert('Registration successful! Pending admin approval.');
        } catch (error) {
            alert('Registration failed: ' + error.response.data);
        }
    };

    return (
        <>
            <div className="background-container"></div>
            <div className="container">
                <p className="USNone">
                    <Link to="/" className="btn2">Kodu</Link>
                </p>
                <h2 className="USNone">Supplier Registration</h2>
                <form>
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="tel"
                        placeholder="Phone Number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="btn2" onClick={handleRegister} type="button">Register</button>
                </form>
                <p className="USNone">
                    Kas teil on juba konto?{' '}
                    <Link to="/supplier-login" className="link">Logi Sisse</Link>
                </p>
            </div>
        </>
    );
}

export default SupplierRegister;
