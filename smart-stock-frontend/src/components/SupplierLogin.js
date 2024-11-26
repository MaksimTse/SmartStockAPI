import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';


function SupplierLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:5077/api/Supplier/login', {
                contactEmail: email,
                passwordHash: password,
            });
            alert('Login successful! Token: ' + response.data.token);
        } catch (error) {
            alert('Login failed: ' + error.response.data);
        }
    };

    return (
        <>
        <div className="background-container"></div> {}
            <div className="container">
                <p className="USNone">
                    <Link to="/" className="btn2">Kodu</Link>
                </p>
                <h2 className="USNone">Supplier Login</h2>
                <form>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="btn2" onClick={handleLogin} type="button">Login</button>
                </form>
                <p className="USNone">
                    Kas teil pole kontot?{' '}
                    <Link to="/supplier-register" className="link">Registreeri siin</Link>
                </p>

            </div>
        </>
    );
}

export default SupplierLogin;
