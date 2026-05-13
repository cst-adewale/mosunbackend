import React from 'react';
import { Search, ShoppingCart, User, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const Navbar = ({ onCartClick }) => {
    const { totalItems } = useCart();
    
    return (
        <nav style={{ backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 100 }}>
            {/* Top Banner (Optional Jumia detail) */}
            <div style={{ backgroundColor: '#f68b1e', color: '#fff', fontSize: '12px', padding: '4px 0', textAlign: 'center' }}>
                Free Delivery on millions of items!
            </div>

            <div className="container flex align-center justify-between" style={{ padding: '10px 15px' }}>
                {/* Logo & Menu */}
                <div className="flex align-center gap-20">
                    <Menu size={24} style={{ cursor: 'pointer' }} />
                    <Link to="/" style={{ fontSize: '24px', fontWeight: 'bold', color: '#f68b1e', textTransform: 'uppercase', textDecoration: 'none' }}>
                        JUMIA <span style={{ color: '#282828' }}>Mock</span>
                    </Link>
                </div>

                {/* Search Bar */}
                <div className="flex align-center" style={{ flex: 1, margin: '0 40px', border: '1px solid #ccc', borderRadius: '4px', padding: '5px 10px' }}>
                    <Search size={18} color="#757575" />
                    <input
                        type="text"
                        placeholder="Search products, brands and categories"
                        style={{ border: 'none', outline: 'none', width: '100%', marginLeft: '10px', fontSize: '14px' }}
                    />
                    <button style={{ backgroundColor: '#f68b1e', color: '#fff', padding: '8px 20px', borderRadius: '4px', marginLeft: '10px', fontWeight: 'bold' }}>
                        SEARCH
                    </button>
                </div>

                {/* Links */}
                <div className="flex align-center gap-20">
                    <Link to="/login" className="flex align-center gap-10" style={{ fontWeight: '500', textDecoration: 'none', color: '#333' }}>
                        <User size={20} />
                        <span>Account</span>
                    </Link>
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
                    <Link to="/admin" style={{ fontSize: '12px', color: '#f68b1e', border: '1px solid #f68b1e', padding: '4px 8px', borderRadius: '4px', textDecoration: 'none' }}>
                        ADMIN
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
