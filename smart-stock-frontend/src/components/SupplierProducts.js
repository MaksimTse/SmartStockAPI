import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const SupplierProducts = () => {
    const [products, setProducts] = useState([]);
    const [supplies, setSupplies] = useState([]);
    const [supplierId, setSupplierId] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [message, setMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            setSupplierId(decoded.sub);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
        fetchSupplies();
    }, [supplierId]);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:5077/api/Storage');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const fetchSupplies = async () => {
        try {
            const response = await axios.get(`http://localhost:5077/api/Supplies/view?supplierId=${supplierId}`);
            setSupplies(response.data);
        } catch (error) {
            console.error('Error fetching supplies:', error);
        }
    };

    const addToSupply = async () => {
        if (!selectedProduct || quantity <= 0) {
            alert('Invalid product or quantity.');
            return;
        }

        try {
            const supplyData = {
                productId: selectedProduct.id,
                supplierId,
                quantity,
            };

            await axios.post('http://localhost:5077/api/Supplies/add', supplyData);
            setMessage('Product added to supply!');
            setShowModal(false);
            fetchProducts();
            fetchSupplies();
        } catch (error) {
            console.error('Error adding to supply:', error);
            alert(error.response?.data || 'An error occurred.');
        }
    };

    const exportSuppliesToPDF = () => {
        const doc = new jsPDF();
        const tableColumn = ['ID', 'Product Name', 'Quantity', 'Price per Item', 'Total Price', 'Supply Date'];
        const tableRows = [];
        let totalPrice = 0;
        const randomInvoiceNumber = Math.floor(100000 + Math.random() * 900000); // Генерация случайного номера
        const email = localStorage.getItem('userEmail'); // Предполагается, что email сохранён в localStorage
        const currentDate = new Date().toLocaleString(); // Текущая дата

        supplies.forEach((supply) => {
            // Проверяем и используем цену поставки (supplierPrice) для правильного отображения
            const pricePerItem = supply.supplierPrice || 0; // Используем supplierPrice для правильного отображения
            const itemTotal = supply.quantity * pricePerItem;

            const supplyData = [
                supply.id,
                supply.productName || 'N/A', // Подстраховка для отсутствующего имени
                supply.quantity,
                pricePerItem.toFixed(2), // Цена за единицу
                itemTotal.toFixed(2), // Итоговая цена за этот товар
                new Date(supply.supplyDate).toLocaleString(), // Дата поставки
            ];

            tableRows.push(supplyData);
            totalPrice += itemTotal; // Суммируем общую стоимость
        });

        doc.text(`Invoice #: ${randomInvoiceNumber}`, 14, 15); // Номер счета
        doc.text(`Supplier Email: ${email || 'N/A'}`, 14, 25); // Email поставщика
        doc.text(`Generated on: ${currentDate}`, 14, 35); // Дата создания PDF
        doc.text('Supplier Supplies', 14, 45); // Заголовок

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 50,
        });

        doc.text(`Total Price: ${totalPrice.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 10); // Итоговая цена
        doc.save(`Supplier_Supplies_${randomInvoiceNumber}.pdf`); // Сохраняем файл
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/supplier-login';
    };

    return (
        <>
            <div className="background-container"></div>
            <div className="container">
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
                <h2>Available Products</h2>
                {message && <p>{message}</p>}
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Category</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td>{product.id}</td>
                            <td>{product.category}</td>
                            <td>{product.productName}</td>
                            <td>{product.supplierPrice}</td>
                            <td>{product.quantity}</td>
                            <td>
                                <button
                                    className="btn2"
                                    onClick={() => {
                                        setSelectedProduct(product);
                                        setShowModal(true);
                                    }}
                                >
                                    Supply
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                <h2>Your Supplies</h2>
                <button className="btn2" onClick={exportSuppliesToPDF}>
                    Export to PDF
                </button>
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Product Name</th>
                        <th>Quantity</th>
                        <th>Supply Date</th>
                    </tr>
                    </thead>
                    <tbody>
                    {supplies.map((supply) => (
                        <tr key={supply.id}>
                            <td>{supply.id}</td>
                            <td>{supply.productName}</td>
                            <td>{supply.quantity}</td>
                            <td>{new Date(supply.supplyDate).toLocaleString()}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {showModal && (
                    <div className="modal">
                        <h3>Supply Product</h3>
                        <p>{selectedProduct?.productName}</p>
                        <p>Current Quantity: {selectedProduct?.quantity}</p>
                        <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                        />
                        <button className="btn2" onClick={addToSupply}>Confirm</button>
                        <button className="logout-btn" onClick={() => setShowModal(false)}>Cancel</button>
                    </div>
                )}
            </div>
        </>
    );
};

export default SupplierProducts;
