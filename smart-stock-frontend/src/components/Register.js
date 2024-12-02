import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const handleRegister = async () => {
        try {
            await axios.post('http://localhost:5077/api/User/register', {
                email,
                passwordHash: password,
                phoneNumber,
            });
            alert('Registration successful!');
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
                <h2 className="USNone">Customer Registration</h2>
                <form>
                    <input
                        type="email"
                        placeholder="Meil"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="tel"
                        placeholder="Telefoninumber"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Salasõna"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="btn2" onClick={handleRegister} type="button">Registreeri</button>
                </form>
                <p className="USNone">
                    Kas teil on juba konto?{' '}
                    <Link to="/login" className="link">Logi Sisse</Link>
                </p>
            </div>
        </>
    );
}

export default Register;
