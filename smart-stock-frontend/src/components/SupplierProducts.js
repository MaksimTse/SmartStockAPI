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
            setMessage('Toode lisatud tarnimisele!');
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
        const tableColumn = ['ID', 'Toote nimi', 'Kogus', 'Hind kauba kohta', 'Hind kokku', 'Tarnekuupäev'];
        const tableRows = [];
        let totalPrice = 0;
        const randomInvoiceNumber = Math.floor(100000 + Math.random() * 900000);
        const email = localStorage.getItem('userEmail');
        const currentDate = new Date().toLocaleString();

        supplies.forEach((supply) => {
            const pricePerItem = supply.supplierPrice || 0;
            const itemTotal = supply.quantity * pricePerItem;

            const supplyData = [
                supply.id,
                supply.productName || 'N/A',
                supply.quantity,
                pricePerItem.toFixed(2),
                itemTotal.toFixed(2),
                new Date(supply.supplyDate).toLocaleString(),
            ];

            tableRows.push(supplyData);
            totalPrice += itemTotal;
        });

        doc.text(`Arve #: ${randomInvoiceNumber}`, 14, 15);
        doc.text(`Tarnija e-post: ${email || 'N/A'}`, 14, 25);
        doc.text(`Loodud: ${currentDate}`, 14, 35);
        doc.text('Tarnija tarvikud', 14, 45);

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 50,
        });

        doc.text(`Total Price: ${totalPrice.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 10);
        doc.save(`Supplier_Supplies_${randomInvoiceNumber}.pdf`);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/supplier-login';
    };

    return (
        <>
            <div className="background-container"></div>
            <div className="container">
                <button className="logout-btn" onClick={handleLogout}>Logi välja</button>
                <h2>Saadaolevad tooted</h2>
                {message && <p>{message}</p>}
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Kategooria</th>
                        <th>Nimi</th>
                        <th>Hind</th>
                        <th>Kogus</th>
                        <th>Tegevused</th>
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
                                    Tarne
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                <h2>Teie tarvikud</h2>
                <button className="btn2" onClick={exportSuppliesToPDF}>
                    Ekspordi PDF-i
                </button>
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Toote nimi</th>
                        <th>Kogus</th>
                        <th>Tarnekuupäev</th>
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
                        <h3>Tarnige toodet</h3>
                        <p>{selectedProduct?.productName}</p>
                        <p>Current Quantity: {selectedProduct?.quantity}</p>
                        <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                        />
                        <button className="btn2" onClick={addToSupply}>Kinnita</button>
                        <button className="logout-btn" onClick={() => setShowModal(false)}>Tühista</button>
                    </div>
                )}
            </div>
        </>
    );
};

export default SupplierProducts;
