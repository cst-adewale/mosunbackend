import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { usePrivacy } from '../../context/PrivacyContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock, CreditCard, Truck } from 'lucide-react';

export default function Checkout() {
    const { cart, totalItems, totalPrice, clearCart } = useCart();
    const { activeUser } = usePrivacy();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);

    const [savedCards, setSavedCards] = useState([]);
    const [useSavedCard, setUseSavedCard] = useState('');

    const [formData, setFormData] = useState({
        address: '',
        city: '',
        phone: '',
        cardNumber: '',
        expiry: '',
        cvv: '',
        saveCard: false
    });

    useEffect(() => {
        if (!activeUser.email) {
            alert('Security Requirement: Please log in or create an account to access the Secure Checkout.');
            navigate('/login');
        } else {
            const token = localStorage.getItem('token');
            axios.get('http://localhost:5000/api/user/cards', {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(res => setSavedCards(res.data))
            .catch(err => console.error("Could not fetch cards", err));
        }
    }, [activeUser, navigate]);

    if (totalItems === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <h2 className="text-xl font-bold mb-4">Your cart is empty</h2>
                <button onClick={() => navigate('/')} className="bg-[#f68b1e] text-white px-6 py-2 rounded font-bold">
                    Continue Shopping
                </button>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!activeUser.email) {
            alert('Please login to complete your checkout.');
            navigate('/login');
            return;
        }

        setIsProcessing(true);
        try {
            const token = localStorage.getItem('token');
            
            let payload = {
                ...formData,
                items: cart.map(item => item._id),
                total: totalPrice,
                event: 'ECOMMERCE_CHECKOUT'
            };

            // If using a saved card, we send the secure token instead of raw card numbers
            if (useSavedCard) {
                payload.paymentToken = useSavedCard;
                payload.cardNumber = savedCards.find(c => c.token === useSavedCard)?.maskedNumber;
            }

            await axios.post('http://localhost:5000/api/checkout', payload, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'x-user-role': activeUser.role,
                    'x-user-name': activeUser.name
                }
            });

            alert('Payment Successful! Data secured by the Privacy Framework.');
            clearCart();
            navigate('/');
        } catch (err) {
            alert('Checkout failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px', display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 600px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Lock size={24} color="#10b981" /> Secure Checkout
                </h1>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Delivery Section */}
                    <div style={{ backgroundColor: 'var(--crm-card)', padding: '20px', borderRadius: '8px', border: '1px solid var(--crm-border)', color: 'var(--crm-text)' }}>
                        <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--crm-border)', paddingBottom: '10px' }}>
                            <Truck size={18} /> Delivery Information
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>
                            <input type="text" placeholder="Full Delivery Address" required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} style={inputStyle} />
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <input type="text" placeholder="City / State" required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} style={inputStyle} />
                                <input type="tel" placeholder="Receiver's Phone" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={inputStyle} />
                            </div>
                        </div>
                    </div>

                    {/* Payment Section */}
                    <div style={{ backgroundColor: 'var(--crm-card)', padding: '20px', borderRadius: '8px', border: '1px solid var(--crm-border)', color: 'var(--crm-text)' }}>
                        <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--crm-border)', paddingBottom: '10px' }}>
                            <CreditCard size={18} /> Payment & Billing
                        </h2>

                        {savedCards.length > 0 && (
                            <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: 'var(--crm-bg)', borderRadius: '8px', border: '1px solid var(--crm-border)' }}>
                                <p style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '10px' }}>Use a Saved Card</p>
                                {savedCards.map(card => (
                                    <label key={card.token} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', cursor: 'pointer' }}>
                                        <input 
                                            type="radio" 
                                            name="savedCard" 
                                            value={card.token} 
                                            checked={useSavedCard === card.token}
                                            onChange={(e) => setUseSavedCard(e.target.value)}
                                        />
                                        <span style={{ fontFamily: 'monospace', fontSize: '14px' }}>{card.maskedNumber}</span>
                                        <span style={{ fontSize: '12px', color: 'var(--crm-text-light)' }}>Exp: {card.expiry}</span>
                                    </label>
                                ))}
                                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px', cursor: 'pointer', borderTop: '1px solid var(--crm-border)', paddingTop: '10px' }}>
                                    <input 
                                        type="radio" 
                                        name="savedCard" 
                                        value="" 
                                        checked={useSavedCard === ''}
                                        onChange={(e) => setUseSavedCard(e.target.value)}
                                    />
                                    <span style={{ fontSize: '13px', fontWeight: 'bold' }}>Enter a new card</span>
                                </label>
                            </div>
                        )}

                        {!useSavedCard && (
                            <>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>
                                    <input type="text" placeholder="Card Number (16 Digits)" required={!useSavedCard} value={formData.cardNumber} onChange={e => setFormData({...formData, cardNumber: e.target.value})} style={inputStyle} maxLength="16" />
                                    <div style={{ display: 'flex', gap: '15px' }}>
                                        <input type="text" placeholder="MM/YY" required={!useSavedCard} value={formData.expiry} onChange={e => setFormData({...formData, expiry: e.target.value})} style={inputStyle} />
                                        <input type="password" placeholder="CVV" required={!useSavedCard} value={formData.cvv} onChange={e => setFormData({...formData, cvv: e.target.value})} style={inputStyle} maxLength="3" />
                                    </div>
                                </div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '15px', fontSize: '13px', cursor: 'pointer' }}>
                                    <input type="checkbox" checked={formData.saveCard} onChange={e => setFormData({...formData, saveCard: e.target.checked})} />
                                    Save this card securely for future purchases
                                </label>
                            </>
                        )}

                        <p style={{ fontSize: '11px', color: 'var(--crm-text-light)', marginTop: '15px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Lock size={12} /> {useSavedCard ? "Using secure payment token." : "Your payment data is actively masked by our Advanced Privacy Framework before being stored."}
                        </p>
                    </div>

                    <button type="submit" disabled={isProcessing} style={{ backgroundColor: '#f68b1e', color: 'white', padding: '15px', borderRadius: '4px', fontWeight: 'bold', fontSize: '16px', border: 'none', cursor: isProcessing ? 'not-allowed' : 'pointer' }}>
                        {isProcessing ? 'Processing Securely...' : `Pay ₦${totalPrice.toLocaleString()}`}
                    </button>
                </form>
            </div>

            {/* Order Summary */}
            <div style={{ flex: '1 1 300px', backgroundColor: 'var(--crm-card)', padding: '20px', borderRadius: '8px', border: '1px solid var(--crm-border)', height: 'fit-content', color: 'var(--crm-text)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', borderBottom: '1px solid var(--crm-border)', paddingBottom: '10px', marginBottom: '15px' }}>Order Summary</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                    {cart.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                            <span style={{ color: '#475569', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '70%' }}>{item.name}</span>
                            <span style={{ fontWeight: 'bold' }}>₦{item.price.toLocaleString()}</span>
                        </div>
                    ))}
                </div>
                <div style={{ borderTop: '1px solid var(--crm-border)', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '18px' }}>
                    <span>Total</span>
                    <span style={{ color: '#f68b1e' }}>₦{totalPrice.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
}

const inputStyle = {
    width: '100%',
    padding: '12px',
    border: '1px solid var(--crm-border)',
    borderRadius: '4px',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: 'var(--input-bg)',
    color: 'var(--crm-text)'
};
