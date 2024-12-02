import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Исправленный импорт

function SupplierLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:5077/api/Supplier/login', {
                contactEmail: email,
                passwordHash: password,
            });

            const token = response.data.token;
            localStorage.setItem('token', token);

            const decodedToken = jwtDecode(token);
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userId', decodedToken.sub);

            navigate('/supplier-products');
        } catch (error) {
            alert('Login failed: ' + (error.response?.data?.title || 'Unknown error'));
        }
    };

    return (
        <>
            <div className="background-container"></div>
            <div className="container">
                <p className="USNone">
                    <Link to="/" className="btn2">Kodu</Link>
                </p>
                <h2 className="USNone">Tarnija sisselogimine</h2>
                <form>
                    <input
                        type="email"
                        placeholder="Meil"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Salasõna"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="btn2" onClick={handleLogin} type="button">
                        Logi sisse
                    </button>
                </form>
                <p className="USNone">
                    Kas teil pole konto?{' '}
                    <Link to="/supplier-register" className="link">Registreeri siin</Link>
                </p>
            </div>
        </>
    );
}

export default SupplierLogin;
