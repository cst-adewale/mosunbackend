import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from './CartDrawer';

const JumiaLayout = () => {
    const [isCartOpen, setIsCartOpen] = useState(false);

    return (
        <div className="jumia-app">
            <Navbar onCartClick={() => setIsCartOpen(true)} />
            <main className="container" style={{ minHeight: '80vh', padding: '20px 0' }}>
                <Outlet />
            </main>
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            <Footer />
        </div>
    );
};

export default JumiaLayout;
