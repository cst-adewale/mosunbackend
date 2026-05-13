import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Heart, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { usePrivacy } from '../../context/PrivacyContext';
import axios from 'axios';

const ProductDetail = () => {
    const { id } = useParams();
    const { addToCart } = useCart();
    const { addLog } = usePrivacy();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                // Fetch all products and find the one matching id (since we don't have a single product endpoint yet)
                const res = await axios.get('http://localhost:5000/api/products');
                const found = res.data.find(p => p._id === id);
                setProduct(found);
                
                if (found) {
                    addLog('PRODUCT_DEEP_VIEW', `User viewing full details for ${found.name}`, 'LOW');
                }
            } catch (err) {
                console.error("Error fetching product:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Product Details...</div>;
    if (!product) return <div style={{ padding: '40px', textAlign: 'center' }}>Product not found.</div>;

    return (
        <div className="flex gap-20" style={{ padding: '20px 0', flexWrap: 'wrap' }}>
            {/* Product Image */}
            <div style={{ flex: '1 1 400px', backgroundColor: '#fff', borderRadius: '4px', padding: '20px', textAlign: 'center' }}>
                <img src={product.image} alt={product.name} style={{ maxWidth: '100%', borderRadius: '4px' }} />
            </div>

            {/* Product Info */}
            <div style={{ flex: '1.5 1 500px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ backgroundColor: '#fff', borderRadius: '4px', padding: '20px' }}>
                    <h1 style={{ fontSize: '20px', fontWeight: '400', marginBottom: '10px' }}>{product.name}</h1>
                    <div className="flex align-center gap-10" style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                        <span style={{ color: '#f68b1e' }}>★★★★☆</span>
                        <span style={{ fontSize: '12px', color: '#f68b1e' }}>({product.reviews} ratings)</span>
                    </div>
                    <div style={{ marginTop: '15px' }}>
                        <p style={{ fontSize: '24px', fontWeight: 'bold' }}>₦ {product.price.toLocaleString()}</p>
                        <p style={{ fontSize: '14px', color: '#757575', textDecoration: 'line-through' }}>₦ {product.oldPrice.toLocaleString()}</p>
                        <span style={{ backgroundColor: '#feefde', color: '#f68b1e', fontSize: '12px', padding: '2px 4px', borderRadius: '2px' }}>-{product.discount}%</span>
                    </div>
                    <button 
                        onClick={() => addToCart(product)}
                        style={{ backgroundColor: '#f68b1e', color: '#fff', width: '100%', padding: '15px', borderRadius: '4px', marginTop: '20px', fontWeight: 'bold', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        <ShoppingCart size={20} /> ADD TO CART
                    </button>
                </div>

                <div style={{ backgroundColor: '#fff', borderRadius: '4px', padding: '20px' }}>
                    <h4 style={{ marginBottom: '10px' }}>PRODUCT DETAILS</h4>
                    <p style={{ fontSize: '14px', color: '#282828' }}>
                        This is a high-quality product perfect for your daily needs. It features premium materials and exceptional durability.
                    </p>
                </div>
            </div>

            {/* Delivery Info */}
            <div style={{ flex: '0.8 1 300px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ backgroundColor: '#fff', borderRadius: '4px', padding: '15px' }}>
                    <h4 style={{ fontSize: '12px', marginBottom: '10px' }}>DELIVERY & RETURNS</h4>
                    <div style={{ fontSize: '12px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                        <strong>Jumia <span style={{ color: '#38bdf8' }}>Express</span></strong>
                        <p>Free delivery on thousands of products.</p>
                    </div>
                    <div style={{ fontSize: '12px', marginTop: '10px' }}>
                        <strong>Choose Location</strong>
                        <select style={{ width: '100%', marginTop: '5px', padding: '5px', borderRadius: '2px', border: '1px solid #ccc' }}>
                            <option>Lagos</option>
                            <option>Abuja</option>
                            <option>Port Harcourt</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
