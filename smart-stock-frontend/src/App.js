import React from "react";
import { Routes, Route } from "react-router-dom";
import './style.css';
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import SupplierLogin from "./components/SupplierLogin";
import SupplierRegister from "./components/SupplierRegister";
import AdminDashboard from "./components/AdminDashboard";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/supplier-login" element={<SupplierLogin />} />
            <Route path="/supplier-register" element={<SupplierRegister />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/add-product" element={<h2 style={{ color: '#fff' }}>Add Product Page</h2>} />
            <Route path="/view-customers" element={<h2 style={{ color: '#fff' }}>Customers Page</h2>} />
            <Route path="/view-suppliers" element={<h2 style={{ color: '#fff' }}>Suppliers Page</h2>} />
        </Routes>
    );
}

export default App;
