import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();

    return (
        <>
        <div className="background-container"></div> {}
            <div className="container">
                <h2 className="USNone">Welcome to Smart Stock</h2>
                <p className="USNone">Please select your user type:</p>
                <button className="btn2" onClick={() => navigate('/register')}>Customer</button>
                <button className="btn2" onClick={() => navigate('/supplier-register')}>Supplier</button>
            </div>
        </>
    );
}

export default Home;
