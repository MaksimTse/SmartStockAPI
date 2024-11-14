import React from 'react';
import { Link } from 'react-router-dom';
import '../style.css';

const Home = () => {
    return (
    <>
        <div className="background-container"></div> {}
        <div className="container">
            <h2>Tere tulemast SmartStocki</h2>
            <p>Palun tehke valik:</p>
            <div className="button-group">
                <Link to="/login">
                    <button className="btn">Logi sisse</button>
                </Link>
                <Link to="/register">
                    <button className="btn">Registreeri</button>
                </Link>
            </div>
        </div>
    </>
    );
};

export default Home;
