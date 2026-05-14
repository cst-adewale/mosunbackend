import React, { useEffect, useRef } from 'react';
import { usePrivacy } from '../../context/PrivacyContext';
import { Shield, Activity, AlertCircle, Clock, Terminal, Database } from 'lucide-react';
import { PrivacyLineChart, SensitivityDoughnut } from '../../components/admin/PrivacyCharts';

const AdminDashboard = () => {
    const { logs, consoleLines, stats, chartData } = usePrivacy();
    const consoleRef = useRef(null);
    const [viewedLogId, setViewedLogId] = React.useState(null);

    const getStepType = (text) => {
        if (text.includes('INFO') || text.includes('SCANNING') || text.includes('DATA MINIMIZATION')) return 'neutral';
        if (text.includes('DETECTED') || text.includes('ANALYZING') || text.includes('EGRESS MONITOR')) return 'warning';
        if (text.includes('RISK EVALUATION')) return 'critical';
        if (text.includes('POLICY APPLIED') || text.includes('COMMITTING') || text.includes('ACTION') || text.includes('SECURITY')) return 'success';
        return 'neutral';
    };

    // Determine which lines to show: historical or live
    const displayLines = viewedLogId 
        ? logs.find(l => l._id === viewedLogId)?.logicSteps.map(text => ({ 
            text, 
            type: getStepType(text) 
        })) || []
        : consoleLines;

    // Auto-scroll console to bottom
    useEffect(() => {
        if (consoleRef.current) {
            consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
        }
    }, [displayLines]);

    const getLineColor = (type) => {
        switch (type) {
            case 'neutral': return 'var(--crm-text-light)';
            case 'warning': return '#f59e0b';
            case 'critical': return '#ef4444';
            case 'success': return '#10b981';
            default: return 'var(--crm-text)';
        }
    };

    return (
        <div className="admin-dashboard-container fade-in">
            {/* Top Statistics Cards */}
            <div className="admin-grid-top">
                <StatCard label="Privacy Score" value={`${stats.privacyScore}%`} change="Safe" color="#10b981" />
                <StatCard label="PII Detected" value={stats.piiCount} change={stats.growth} color="#38bdf8" />
                <StatCard label="Critical Alerts" value={stats.activeAlerts} change="Mitigated" color="#f43f5e" />
                <StatCard label="Requests Processed" value={stats.totalRequests} change="Active" color="#6366f1" />
            </div>

            <div className="admin-grid-main">
                {/* Left Column: Console & Charts */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* THE LIVE CONSOLE */}
                    <div style={{ backgroundColor: 'var(--crm-card)', borderRadius: '16px', border: '1px solid var(--crm-border)', overflow: 'hidden' }}>
                        <div style={{ padding: '15px 20px', borderBottom: '1px solid var(--crm-border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 10px rgba(16, 185, 129, 0.4)' }}></div>
                            <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--crm-text)' }}>{viewedLogId ? 'Historical Audit Analysis' : 'Live Framework Analysis'}</h3>
                            <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                                {viewedLogId ? (
                                    <button 
                                        onClick={() => setViewedLogId(null)}
                                        style={{ fontSize: '10px', padding: '4px 8px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                    >
                                        RETURN TO LIVE
                                    </button>
                                ) : (
                                    <span style={{ fontSize: '10px', padding: '4px 8px', backgroundColor: 'var(--crm-bg)', borderRadius: '4px', color: 'var(--crm-text-light)', fontWeight: 'bold' }}>
                                        SOCKET: ACTIVE
                                    </span>
                                )}
                            </div>
                        </div>
                        <div 
                            ref={consoleRef}
                            style={{ height: '280px', backgroundColor: 'var(--crm-card)', padding: '15px', overflowY: 'auto', fontFamily: 'monospace', fontSize: '12px', scrollBehavior: 'smooth' }}
                        >
                            {displayLines.length === 0 ? (
                                <p style={{ color: '#94a3b8' }}>{'>'} Awaiting intercepted traffic... System actively monitoring Network & Egress layers.</p>
                            ) : (
                                displayLines.map((line, idx) => (
                                    <div key={idx} style={{ marginBottom: '4px', display: 'flex', gap: '10px' }}>
                                        <span style={{ color: 'var(--crm-border)' }}>{idx + 1}</span>
                                        <span style={{ color: getLineColor(line.type) }}>{line.text}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>


                    {/* Real Charts */}
                    <div className="admin-chart-grid">
                        <div style={{ backgroundColor: 'var(--crm-card)', padding: '20px', borderRadius: '16px', border: '1px solid var(--crm-border)', minHeight: '250px' }}>
                            <h4 style={{ fontSize: '13px', color: 'var(--crm-text-light)', marginBottom: '15px', fontWeight: 'bold' }}>Sensitivity Distribution</h4>
                            <div style={{ height: '160px' }}>
                                <SensitivityDoughnut chartData={chartData} />
                            </div>
                        </div>
                        <div style={{ backgroundColor: 'var(--crm-card)', padding: '20px', borderRadius: '16px', border: '1px solid var(--crm-border)', minHeight: '250px' }}>
                            <h4 style={{ fontSize: '13px', color: 'var(--crm-text-light)', marginBottom: '15px', fontWeight: 'bold' }}>Traffic Volume (24h)</h4>
                            <div style={{ height: '160px' }}>
                                <PrivacyLineChart chartData={chartData} />
                            </div>
                        </div>
                    </div>
                </div>


                {/* Right Column: Audit Trail */}
                <div style={{ backgroundColor: 'var(--crm-card)', borderRadius: '16px', border: '1px solid var(--crm-border)', display: 'flex', flexDirection: 'column', maxHeight: '600px' }}>
                    <div style={{ padding: '15px 20px', borderBottom: '1px solid var(--crm-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--crm-text)' }}>Recent Audit History</h3>
                        <button 
                            onClick={() => {
                                let csvContent = "data:text/csv;charset=utf-8,Timestamp,Event,User,Role,Endpoint,Sensitivity,RiskScore,DataSummary\n";
                                logs.forEach(log => {
                                    csvContent += `${new Date(log.timestamp).toISOString()},${log.event},${log.user.name},${log.user.role},${log.endpoint},${log.sensitivity},${log.riskScore},"${log.dataSummary}"\n`;
                                });
                                const link = document.createElement("a");
                                link.setAttribute("href", encodeURI(csvContent));
                                link.setAttribute("download", `ndpr_compliance_report.csv`);
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            }}
                            style={{ padding: '6px 12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                            Download NDPR
                        </button>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto', padding: '15px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {logs.length === 0 ? (
                                <p style={{ color: '#94a3b8', textAlign: 'center', marginTop: '30px', fontSize: '13px' }}>No audit data available.</p>
                            ) : (
                                logs.map(log => (
                                    <div 
                                        key={log._id} 
                                        onClick={() => setViewedLogId(log._id)}
                                        style={{ 
                                            display: 'flex', 
                                            gap: '12px', 
                                            cursor: 'pointer', 
                                            padding: '10px', 
                                            borderRadius: '8px', 
                                            transition: 'all 0.2s',
                                            backgroundColor: viewedLogId === log._id ? 'var(--crm-bg)' : 'transparent',
                                            border: viewedLogId === log._id ? '1px solid var(--crm-border)' : '1px solid transparent'
                                        }}
                                        onMouseEnter={(e) => { if (viewedLogId !== log._id) e.currentTarget.style.backgroundColor = 'var(--crm-bg)' }}
                                        onMouseLeave={(e) => { if (viewedLogId !== log._id) e.currentTarget.style.backgroundColor = 'transparent' }}
                                        title="Click to view full analysis in console"
                                    >
                                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: log.riskScore > 7 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            {log.riskScore > 7 ? <AlertCircle size={16} color="#ef4444" /> : <Clock size={16} color="#10b981" />}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                                                <p style={{ fontWeight: '700', fontSize: '13px', color: 'var(--crm-text)' }}>{log.event}</p>
                                                <span style={{ fontSize: '10px', color: 'var(--crm-text-light)' }}>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                            <p style={{ fontSize: '11px', color: 'var(--crm-text-light)' }}>{log.user.name} ({log.user.role})</p>
                                            <div style={{ marginTop: '6px', display: 'flex', gap: '6px' }}>
                                                <span style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '10px', backgroundColor: 'var(--crm-bg)', color: 'var(--crm-text-light)', fontWeight: 'bold' }}>
                                                    Score: {log.riskScore}/10
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .admin-dashboard-container {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                .admin-grid-top {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                }
                .admin-grid-main {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 20px;
                }
                .admin-chart-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                    gap: 20px;
                }
                @media (max-width: 1024px) {
                    .admin-grid-main {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
};

const StatCard = ({ label, value, change, color }) => (
    <div style={{ backgroundColor: 'var(--crm-card)', padding: '20px', borderRadius: '16px', border: '1px solid var(--crm-border)', transition: 'all 0.2s ease' }}>
        <p style={{ color: 'var(--crm-text-light)', fontSize: '12px', marginBottom: '8px', fontWeight: 'bold', textTransform: 'uppercase' }}>{label}</p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--crm-text)' }}>{value}</h2>
            <span style={{ fontSize: '11px', fontWeight: '700', color: color }}>{change}</span>
        </div>
    </div>
);

export default AdminDashboard;
