import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { usePrivacy } from '../../context/PrivacyContext';

const LoginPage = () => {
    const { login } = usePrivacy();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password,
                event: 'USER_AUTHENTICATION'
            });
            
            login({ name: res.data.name, email: res.data.email, role: res.data.role }, res.data.token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid email or password');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px 0' }}>
            <div style={{ backgroundColor: 'var(--crm-card)', width: '400px', borderRadius: '8px', padding: '40px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', textAlign: 'center', color: 'var(--crm-text)' }}>
                <h2 style={{ marginBottom: '10px', fontSize: '24px' }} className="outfit-font">Login</h2>
                <p style={{ fontSize: '14px', color: 'var(--crm-text-light)', marginBottom: '30px' }}>Access your Jumia account</p>

                {error && <div style={{ backgroundColor: '#fef2f2', color: '#ef4444', padding: '10px', borderRadius: '4px', marginBottom: '20px', fontSize: '14px' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ textAlign: 'left' }}>
                        <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ width: '100%', padding: '12px', border: '1px solid var(--crm-border)', borderRadius: '6px', backgroundColor: 'var(--input-bg)', color: 'var(--crm-text)' }}
                        />
                    </div>
                    <div style={{ textAlign: 'left' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>Password</label>
                            <a href="#" style={{ fontSize: '12px', color: '#f68b1e', textDecoration: 'none' }}>Forgot Password?</a>
                        </div>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ width: '100%', padding: '12px', border: '1px solid var(--crm-border)', borderRadius: '6px', backgroundColor: 'var(--input-bg)', color: 'var(--crm-text)' }}
                        />
                    </div>
                    <button
                        type="submit"
                        style={{ backgroundColor: '#f68b1e', color: '#fff', padding: '15px', border: 'none', borderRadius: '6px', fontWeight: 'bold', marginTop: '10px', cursor: 'pointer' }}
                    >
                        LOGIN
                    </button>
                </form>

                <div style={{ marginTop: '30px', fontSize: '14px', color: 'var(--crm-text-light)' }}>
                    Don't have an account? <Link to="/register" style={{ color: '#f68b1e', fontWeight: 'bold', textDecoration: 'none' }}>Register Now</Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
