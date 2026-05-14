import React, { useState } from 'react';
import { usePrivacy } from '../../context/PrivacyContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Shield, Trash2, AlertTriangle, CheckCircle, Database } from 'lucide-react';

export default function PrivacyCenter() {
    const { activeUser, logout } = usePrivacy();
    const navigate = useNavigate();
    const [isDeleting, setIsDeleting] = useState(false);

    if (!activeUser.email) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <p style={{ color: 'var(--crm-text-light)' }}>Please log in to view your Privacy Center.</p>
            </div>
        );
    }

    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm("WARNING: Under NDPR Article 2.6 (Right to be Forgotten), this will permanently erase your account, history, and all personally identifiable information. Proceed?");
        if (!confirmDelete) return;

        setIsDeleting(true);
        try {
            const token = localStorage.getItem('token');
            await axios.delete('http://localhost:5000/api/user/delete', {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'x-user-role': activeUser.role,
                    'x-user-name': activeUser.name
                },
                data: { event: 'NDPR_RIGHT_TO_ERASURE_REQUEST' }
            });
            
            alert('Your data has been permanently erased in compliance with NDPR.');
            logout();
            navigate('/');
        } catch (err) {
            alert('Failed to delete account. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px' }} className="fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' }}>
                <Shield color="#f68b1e" size={36} />
                <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--crm-text)' }} className="outfit-font">My Privacy Center</h1>
            </div>

            <div style={{ backgroundColor: 'var(--crm-card)', borderRadius: '16px', padding: '30px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', border: '1px solid var(--crm-border)', marginBottom: '30px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--crm-text)' }}>
                    <Database size={20} color="#3b82f6"/> Your Data Profile
                </h2>
                <div style={{ backgroundColor: 'var(--crm-bg)', padding: '20px', borderRadius: '12px', border: '1px solid var(--crm-border)', color: 'var(--crm-text)' }}>
                    <p style={{ marginBottom: '10px' }}><strong>Name:</strong> {activeUser.name}</p>
                    <p style={{ marginBottom: '10px' }}><strong>Email:</strong> {activeUser.email}</p>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <strong>Status:</strong> 
                        <span style={{ color: '#10b981', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircle size={16}/> Active Data Masking Enabled
                        </span>
                    </p>
                </div>
            </div>

            <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '16px', padding: '30px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#ef4444', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertTriangle size={20} /> NDPR Right to be Forgotten
                </h2>
                <p style={{ color: 'var(--crm-text)', fontSize: '14px', opacity: 0.8, marginBottom: '20px', lineHeight: '1.5' }}>
                    Under the Nigeria Data Protection Regulation (NDPR), you have the right to request the permanent deletion of your personal data from our servers. This action is irreversible.
                </p>
                
                <button 
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                    style={{ 
                        display: 'flex', alignItems: 'center', gap: '8px', 
                        backgroundColor: '#ef4444', color: 'white', fontWeight: 'bold', 
                        padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: isDeleting ? 'not-allowed' : 'pointer' 
                    }}
                >
                    <Trash2 size={18} />
                    {isDeleting ? 'Erasing Data...' : 'Permanently Delete My Data'}
                </button>
            </div>
        </div>
    );
}
