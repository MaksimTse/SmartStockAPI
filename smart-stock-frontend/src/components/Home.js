import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();

    return (
        <>
        <div className="background-container"></div> {}
            <div className="container">
                <h2 className="USNone">Tere tulemast Smart Stocki</h2>
                <p className="USNone">Palun valige oma kasutaja tüüp:</p>
                <button className="btn2" onClick={() => navigate('/login')}>Klient</button>
                <button className="btn2 margin10" onClick={() => navigate('/supplier-login')}>Tarnija</button>
            </div>
        </>
    );
}

export default Home;
