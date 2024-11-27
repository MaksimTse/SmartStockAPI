import React from "react";
import { Routes, Route } from "react-router-dom";
import './style.css';
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import SupplierLogin from "./components/SupplierLogin";
import SupplierRegister from "./components/SupplierRegister";
import Products from "./components/Products";
import Suppliers from "./components/Suppliers";
import Customers from "./components/Customers";
import CustomerProducts from './components/CustomerProducts';
import SupplierProducts from './components/SupplierProducts';

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/supplier-login" element={<SupplierLogin />} />
            <Route path="/supplier-register" element={<SupplierRegister />} />
            <Route path="/products" element={<Products />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/customer-products" element={<CustomerProducts />} />
            <Route path="/supplier-products" element={<SupplierProducts />} />
        </Routes>
    );
}

export default App;
