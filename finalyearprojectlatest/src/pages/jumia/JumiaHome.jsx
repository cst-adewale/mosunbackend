import React, { useState, useEffect } from 'react';
import { usePrivacy } from '../../context/PrivacyContext';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const JumiaHome = () => {
    const { addLog } = usePrivacy();
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/products');
                setProducts(res.data);
            } catch (err) {
                console.error("Error fetching products:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleProductClick = (product) => {
        const interactionData = {
            productId: product._id,
            action: 'VIEW_DETAILS',
            meta: `User viewed ${product.name}`
        };
        addLog('PRODUCT_INTERACTION', JSON.stringify(interactionData), 'LOW');
        navigate(`/product/${product._id}`);
    };

    const handleAddToCart = (e, product) => {
        e.stopPropagation(); // Don't navigate to details
        addToCart(product);
        addLog('CART_ADDITION', `Added ${product.name} to cart`, 'LOW');
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Jumia Store...</div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Banner Section */}
            <section style={{ display: 'grid', gridTemplateColumns: '200px 1fr 200px', gap: '20px', height: '380px' }}>
                {/* Categories Sidebar */}
                <div style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '4px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                    <ul style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <li>Supermarket</li>
                        <li>Health & Beauty</li>
                        <li>Home & Office</li>
                        <li>Phones & Tablets</li>
                        <li>Computing</li>
                        <li>Electronics</li>
                        <li>Fashion</li>
                        <li>Baby Products</li>
                        <li>Gaming</li>
                        <li>Sporting Goods</li>
                        <li>Automobile</li>
                    </ul>
                </div>

                {/* Hero Slider */}
                <div style={{ backgroundColor: '#fff', borderRadius: '4px', overflow: 'hidden', position: 'relative', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                    <img
                        src="https://picsum.photos/seed/jumia-hero/800/400"
                        alt="Hero Banner"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', bottom: '20px', left: '20px', color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                        <h1 style={{ fontSize: '32px' }} className="outfit-font">Flash Sales! Up to 50% Off</h1>
                        <p>Shop the best deals today.</p>
                    </div>
                </div>

                {/* Right Promo Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ backgroundColor: '#fff', flex: 1, borderRadius: '4px', padding: '10px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                        <div style={{ backgroundColor: '#f68b1e', width: '40px', height: '40px', borderRadius: '50%' }}></div>
                        <div style={{ fontSize: '12px' }}>
                            <strong>HELP CENTER</strong>
                            <p>Guide to customer care</p>
                        </div>
                    </div>
                    <div style={{ backgroundColor: '#fff', flex: 1, borderRadius: '4px', padding: '10px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                        <div style={{ backgroundColor: '#f68b1e', width: '40px', height: '40px', borderRadius: '50%' }}></div>
                        <div style={{ fontSize: '12px' }}>
                            <strong>EASY RETURN</strong>
                            <p>Up to 15 days</p>
                        </div>
                    </div>
                    <div style={{ backgroundColor: '#fff', flex: 1, borderRadius: '4px', padding: '10px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                        <div style={{ backgroundColor: '#f68b1e', width: '40px', height: '40px', borderRadius: '50%' }}></div>
                        <div style={{ fontSize: '12px' }}>
                            <strong>SELL ON JUMIA</strong>
                            <p>Fast track your business</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Flash Sales Section */}
            <section style={{ backgroundColor: '#fff', borderRadius: '4px', padding: '15px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                <div className="flex align-center justify-between" style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>
                    <h3 style={{ color: '#f68b1e' }} className="outfit-font">Flash Sales</h3>
                    <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Time Left: 12h : 30m : 05s</span>
                    <a href="#" style={{ color: '#f68b1e', fontSize: '14px', fontWeight: 'bold' }}>SEE ALL {'>'}</a>
                </div>
                <div className="grid-products">
                    {products.map(product => (
                        <div
                            key={product._id}
                            className="product-card"
                            style={{ padding: '10px', transition: 'var(--transition)', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
                            onClick={() => handleProductClick(product)}
                        >
                            <div style={{ position: 'relative' }}>
                                <img src={product.image} alt={product.name} style={{ width: '100%', borderRadius: '4px' }} />
                                <span style={{ position: 'absolute', top: '5px', right: '5px', backgroundColor: '#feefde', color: '#f68b1e', padding: '2px 6px', fontSize: '10px', fontWeight: 'bold', borderRadius: '2px' }}>
                                    -{product.discount}%
                                </span>
                            </div>
                            <div style={{ marginTop: '10px', flex: 1 }}>
                                <p style={{ fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</p>
                                <p style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '4px' }}>₦ {Number(product.price).toLocaleString()}</p>
                                <p style={{ fontSize: '12px', color: '#757575', textDecoration: 'line-through' }}>₦ {Number(product.oldPrice).toLocaleString()}</p>
                                <div className="flex align-center gap-10" style={{ marginTop: '10px' }}>
                                    <span style={{ color: '#f68b1e' }}>★</span>
                                    <span style={{ fontSize: '12px', color: '#757575' }}>({product.reviews})</span>
                                </div>
                            </div>
                            <button 
                                onClick={(e) => handleAddToCart(e, product)}
                                className="add-to-cart-btn"
                                style={{ 
                                    marginTop: '15px', width: '100%', padding: '10px', 
                                    backgroundColor: '#f68b1e', color: '#fff', border: 'none', 
                                    borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer',
                                    transition: 'background 0.2s'
                                }}
                            >
                                ADD TO CART
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default JumiaHome;
