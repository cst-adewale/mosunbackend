import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, Shield, Activity, Database, Settings, 
    LogOut, Bell, Search, User, FileText, PieChart 
} from 'lucide-react';

const AdminLayout = () => {
    const navigate = useNavigate();

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--crm-bg)', color: 'var(--crm-text)' }}>
            {/* Sidebar */}
            <aside className="sidebar" style={{ 
                width: '260px', 
                backgroundColor: 'var(--crm-sidebar)', 
                borderRight: '1px solid var(--crm-border)', 
                padding: '30px 20px', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '40px',
                position: 'fixed',
                height: '100vh',
                zIndex: 100,
                transition: 'all 0.3s ease'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 10px' }}>
                    <div style={{ width: '32px', height: '32px', backgroundColor: '#10b981', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Shield size={20} color="#fff" />
                    </div>
                    <span style={{ fontWeight: '800', fontSize: '18px', color: 'var(--crm-text)', letterSpacing: '-0.5px' }}>PRIVACY.OS</span>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <SidebarLink to="/admin" icon={<LayoutDashboard size={18} />} label="Overview" />
                    <SidebarLink to="/" icon={<Activity size={18} />} label="Back to Store" />
                </nav>

                <div style={{ marginTop: 'auto', padding: '20px', backgroundColor: 'var(--crm-bg)', borderRadius: '16px', textAlign: 'center' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'var(--crm-border)', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={24} color="var(--crm-text-light)" />
                    </div>
                    <p style={{ fontWeight: 'bold', fontSize: '14px' }}>Admin Panel</p>
                    <p style={{ fontSize: '12px', color: 'var(--crm-text-light)' }}>Security Lead</p>
                    <button 
                        onClick={() => navigate('/')}
                        style={{ marginTop: '12px', width: '100%', padding: '8px', borderRadius: '8px', backgroundColor: 'var(--crm-sidebar)', border: '1px solid var(--crm-border)', color: 'var(--crm-text)', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
                    >
                        <LogOut size={14} /> Exit Store
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="main-content" style={{ flex: 1, marginLeft: '260px', padding: '40px', transition: 'all 0.3s ease' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <div>
                        <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--crm-text)' }}>Privacy Command Center</h1>
                        <p style={{ color: 'var(--crm-text-light)', fontSize: '14px' }}>Real-time monitoring for NDPA 2023 compliance</p>
                    </div>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <div style={{ position: 'relative' }}>
                            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} size={16} color="var(--crm-text-light)" />
                            <input type="text" placeholder="Search logs..." style={{ padding: '10px 15px 10px 40px', borderRadius: '10px', border: '1px solid var(--crm-border)', backgroundColor: 'var(--input-bg)', color: 'var(--crm-text)', fontSize: '14px', width: '240px' }} />
                        </div>
                        <button style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: 'var(--crm-sidebar)', border: '1px solid var(--crm-border)', color: 'var(--crm-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                            <Bell size={18} />
                        </button>
                    </div>
                </header>

                <Outlet />
            </div>
        </div>
    );
};

const SidebarLink = ({ to, icon, label }) => (
    <NavLink to={to} end style={({ isActive }) => ({ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px', 
        padding: '12px 16px', 
        borderRadius: '12px', 
        cursor: 'pointer',
        backgroundColor: isActive ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
        color: isActive ? '#10b981' : 'var(--crm-text-light)',
        fontWeight: isActive ? '700' : '500',
        textDecoration: 'none',
        transition: 'all 0.2s ease-in-out'
    })}>
        {icon}
        <span style={{ fontSize: '14px' }}>{label}</span>
    </NavLink>
);

export default AdminLayout;
