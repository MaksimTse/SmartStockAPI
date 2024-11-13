import React from 'react';
import { Link } from 'react-router-dom';
import '../style.css';

const Home = () => {
    return (
        <div className="container">
            <h2>Welcome</h2>
            <p>Please choose an option:</p>
            <div className="button-group">
                <Link to="/login">
                    <button className="btn">Login</button>
                </Link>
                <Link to="/register">
                    <button className="btn">Register</button>
                </Link>
            </div>
        </div>
    );
};

export default Home;
