import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { usePrivacy } from '../../context/PrivacyContext';

const RegisterPage = () => {
    const navigate = useNavigate();
    const { addLog } = usePrivacy();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: ''
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // This request will be intercepted by our Privacy Engine on the server
            const res = await axios.post('http://localhost:5000/api/auth/register', {
                ...formData,
                event: 'USER_REGISTRATION'
            });
            
            alert('Registration Successful! Please login.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px 0' }}>
            <div style={{ backgroundColor: '#fff', width: '450px', borderRadius: '8px', padding: '40px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                <h2 style={{ marginBottom: '10px', fontSize: '24px' }} className="outfit-font">Create Account</h2>
                <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '30px' }}>Register to enjoy the Advanced Privacy Framework</p>

                {error && <div style={{ backgroundColor: '#fef2f2', color: '#ef4444', padding: '10px', borderRadius: '4px', marginBottom: '20px', fontSize: '14px' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
                    <div>
                        <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>Full Name</label>
                        <input 
                            type="text" 
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            placeholder="John Doe" 
                            style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '6px' }} 
                        />
                    </div>

                    <div>
                        <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>Email Address</label>
                        <input 
                            type="email" 
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            placeholder="email@example.com" 
                            style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '6px' }} 
                        />
                    </div>

                    <div>
                        <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>Phone Number (PII Test)</label>
                        <input 
                            type="tel" 
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            placeholder="08012345678" 
                            style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '6px' }} 
                        />
                    </div>

                    <div>
                        <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>Password</label>
                        <input 
                            type="password" 
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            placeholder="Min 8 characters" 
                            style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '6px' }} 
                        />
                    </div>

                    <button
                        type="submit"
                        style={{ backgroundColor: '#f68b1e', color: '#fff', padding: '15px', border: 'none', borderRadius: '6px', fontWeight: 'bold', marginTop: '10px', cursor: 'pointer' }}
                    >
                        CREATE ACCOUNT
                    </button>
                </form>

                <div style={{ marginTop: '30px', fontSize: '14px', color: '#64748b' }}>
                    Already have an account? <Link to="/login" style={{ color: '#f68b1e', fontWeight: 'bold', textDecoration: 'none' }}>Login</Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
