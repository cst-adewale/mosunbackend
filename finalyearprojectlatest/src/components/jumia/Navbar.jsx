import React from 'react';
import { Search, ShoppingCart, User, Menu, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { usePrivacy } from '../../context/PrivacyContext';
import { useTheme } from '../../context/ThemeContext';

const Navbar = ({ onCartClick }) => {
    const { totalItems } = useCart();
    const { activeUser, logout } = usePrivacy();
    const { theme, toggleTheme } = useTheme();
    
    return (
        <nav style={{ backgroundColor: 'var(--crm-sidebar)', borderBottom: '1px solid var(--crm-border)', position: 'sticky', top: 0, zIndex: 100, color: 'var(--crm-text)' }}>
            {/* Top Banner (Optional Jumia detail) */}
            <div style={{ backgroundColor: '#f68b1e', color: '#fff', fontSize: '12px', padding: '4px 0', textAlign: 'center' }}>
                Free Delivery on millions of items!
            </div>

            <div className="container flex align-center justify-between" style={{ padding: '10px 15px' }}>
                {/* Logo & Menu */}
                <div className="flex align-center gap-20">
                    <Menu size={24} style={{ cursor: 'pointer' }} />
                    <Link to="/" style={{ fontSize: '24px', fontWeight: 'bold', color: '#f68b1e', textTransform: 'uppercase', textDecoration: 'none' }}>
                        JUMIA <span style={{ color: 'var(--crm-text)' }}>Mock</span>
                    </Link>
                </div>

                {/* Search Bar */}
                <div className="flex align-center" style={{ flex: 1, margin: '0 40px', border: '1px solid var(--crm-border)', borderRadius: '4px', padding: '5px 10px', backgroundColor: 'var(--input-bg)' }}>
                    <Search size={18} color="#757575" />
                    <input
                        type="text"
                        placeholder="Search products, brands and categories"
                        style={{ border: 'none', outline: 'none', width: '100%', marginLeft: '10px', fontSize: '14px', backgroundColor: 'transparent', color: 'var(--crm-text)' }}
                    />
                    <button style={{ backgroundColor: '#f68b1e', color: '#fff', padding: '8px 20px', borderRadius: '4px', marginLeft: '10px', fontWeight: 'bold' }}>
                        SEARCH
                    </button>
                </div>

                {/* Links */}
                <div className="flex align-center gap-20">
                    {activeUser.email ? (
                        <div className="flex align-center gap-10">
                            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Hi, {activeUser.name.split(' ')[0]}</span>
                            <Link to="/privacy-center" style={{ fontSize: '12px', color: '#3b82f6', textDecoration: 'none', fontWeight: 'bold', border: '1px solid #3b82f6', padding: '4px 8px', borderRadius: '4px' }}>
                                Privacy Center
                            </Link>
                            <button onClick={logout} style={{ fontSize: '12px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 'bold' }}>
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="flex align-center gap-10" style={{ fontWeight: '500', textDecoration: 'none', color: 'var(--crm-text)' }}>
                            <User size={20} />
                            <span>Account</span>
                        </Link>
                    )}
                    <div 
                        onClick={onCartClick}
                        className="flex align-center gap-10" 
                        style={{ cursor: 'pointer', fontWeight: '500', position: 'relative' }}
                    >
                        <ShoppingCart size={20} />
                        <span>Cart</span>
                        {totalItems > 0 && (
                            <span style={{ 
                                position: 'absolute', top: '-8px', left: '12px', 
                                backgroundColor: '#f68b1e', color: '#fff', 
                                fontSize: '10px', width: '18px', height: '18px', 
                                borderRadius: '50%', display: 'flex', alignItems: 'center', 
                                justifyContent: 'center', fontWeight: 'bold' 
                            }}>
                                {totalItems}
                            </span>
                        )}
                    </div>
                    
                    {/* Theme Toggle Button */}
                    <button 
                        onClick={toggleTheme}
                        style={{ 
                            background: 'none', 
                            padding: '8px', 
                            borderRadius: '50%', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            color: 'var(--crm-text)'
                        }}
                    >
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>

                    <Link to="/admin" style={{ fontSize: '12px', color: '#f68b1e', border: '1px solid #f68b1e', padding: '4px 8px', borderRadius: '4px', textDecoration: 'none' }}>
                        ADMIN
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
