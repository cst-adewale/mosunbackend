import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { usePrivacy } from '../../context/PrivacyContext';

const CartDrawer = ({ isOpen, onClose }) => {
    const { cart, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
    const { addLog } = usePrivacy();

    if (!isOpen) return null;

    const handleCheckout = () => {
        // Trigger a HIGH SENSITIVITY privacy event
        const checkoutData = {
            orderTotal: totalPrice,
            items: cart.length,
            userAddress: '123 Fake Street, Lagos, Nigeria',
            paymentMethod: 'MASTERCARD **** 4421'
        };
        addLog('CHECKOUT_INITIATED', JSON.stringify(checkoutData), 'HIGH');
        alert('Checkout simulated! Privacy Framework is analyzing your sensitive data...');
        onClose();
    };

    return (
        <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, left: 0, zIndex: 1000, display: 'flex', justifyContent: 'flex-end' }}>
            {/* Backdrop */}
            <div 
                onClick={onClose}
                style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} 
            />
            
            {/* Drawer */}
            <div style={{ 
                position: 'relative', width: '400px', backgroundColor: '#fff', 
                height: '100%', boxShadow: '-5px 0 25px rgba(0,0,0,0.1)', 
                display: 'flex', flexDirection: 'column', animation: 'slideIn 0.3s ease' 
            }}>
                <div style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>My Cart ({cart.length})</h2>
                    <X size={24} style={{ cursor: 'pointer' }} onClick={onClose} />
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                    {cart.length === 0 ? (
                        <div style={{ textAlign: 'center', marginTop: '50px', color: '#757575' }}>
                            <ShoppingBag size={60} style={{ opacity: 0.2, marginBottom: '20px' }} />
                            <p>Your cart is empty</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {cart.map(item => (
                                <div key={item._id} style={{ display: 'flex', gap: '15px', paddingBottom: '15px', borderBottom: '1px solid #f5f5f5' }}>
                                    <img src={item.image} alt={item.name} style={{ width: '80px', height: '80px', borderRadius: '4px', objectFit: 'cover' }} />
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: '14px', fontWeight: '500' }}>{item.name}</p>
                                        <p style={{ fontSize: '16px', fontWeight: 'bold', margin: '4px 0' }}>₦ {item.price.toLocaleString()}</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '4px' }}>
                                                <button onClick={() => updateQuantity(item._id, -1)} style={{ padding: '4px 8px', border: 'none', background: 'none', cursor: 'pointer' }}><Minus size={14}/></button>
                                                <span style={{ padding: '0 10px', fontSize: '14px' }}>{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item._id, 1)} style={{ padding: '4px 8px', border: 'none', background: 'none', cursor: 'pointer' }}><Plus size={14}/></button>
                                            </div>
                                            <Trash2 
                                                size={18} 
                                                color="#ef4444" 
                                                style={{ cursor: 'pointer', marginLeft: 'auto' }} 
                                                onClick={() => removeFromCart(item._id)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {cart.length > 0 && (
                    <div style={{ padding: '20px', borderTop: '1px solid #eee', backgroundColor: '#fafafa' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                            <span style={{ color: '#757575' }}>Subtotal</span>
                            <span style={{ fontSize: '20px', fontWeight: 'bold' }}>₦ {totalPrice.toLocaleString()}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button 
                                onClick={clearCart}
                                style={{ flex: 1, padding: '15px', borderRadius: '4px', border: '1px solid #ddd', background: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
                            >
                                CLEAR ALL
                            </button>
                            <button 
                                onClick={handleCheckout}
                                style={{ flex: 2, padding: '15px', borderRadius: '4px', border: 'none', background: '#f68b1e', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
                            >
                                CHECKOUT
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
            `}</style>
        </div>
    );
};

export default CartDrawer;
