import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminUsers from './components/AdminUsers';
import Products from './components/Products';
import UserProducts from './components/UserProducts'; // Новый компонент
import UserOrders from './components/UserOrders';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin/products" element={<Products />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/user/products" element={<UserProducts />} /> {/* Новый маршрут */}
            <Route path="/user/orders" element={<UserOrders />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

export default App;
