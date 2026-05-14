import React, { useEffect, useRef } from 'react';
import { usePrivacy } from '../../context/PrivacyContext';
import { Shield, Activity, AlertCircle, Clock, Terminal, Database } from 'lucide-react';
import { PrivacyLineChart, SensitivityDoughnut } from '../../components/admin/PrivacyCharts';

const AdminDashboard = () => {
    const { logs, consoleLines, stats, chartData } = usePrivacy();
    const consoleRef = useRef(null);

    // Auto-scroll console to bottom
    useEffect(() => {
        if (consoleRef.current) {
            consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
        }
    }, [consoleLines]);

    const getLineColor = (type) => {
        switch (type) {
            case 'neutral': return '#64748b';
            case 'warning': return '#f59e0b';
            case 'critical': return '#ef4444';
            case 'success': return '#10b981';
            default: return '#1e293b';
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }} className="fade-in">
            {/* Top Statistics Cards */}
            <div className="admin-grid-top" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                <StatCard label="Privacy Score" value={`${stats.privacyScore}%`} change="Safe" color="#10b981" />
                <StatCard label="PII Detected" value={stats.piiCount} change={stats.growth} color="#38bdf8" />
                <StatCard label="Critical Alerts" value={stats.activeAlerts} change="Mitigated" color="#f43f5e" />
                <StatCard label="Requests Processed" value={stats.totalRequests} change="Active" color="#6366f1" />
            </div>

            <div className="admin-grid-main" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
                {/* Left Column: Console & Charts */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    {/* THE LIVE CONSOLE */}
                    <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 10px rgba(16, 185, 129, 0.4)' }}></div>
                            <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Live Framework Analysis</h3>
                            <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                                <span style={{ fontSize: '11px', padding: '4px 8px', backgroundColor: '#f1f5f9', borderRadius: '6px', color: '#64748b' }}>SOCKET: ACTIVE</span>
                            </div>
                        </div>
                        <div 
                            ref={consoleRef}
                            style={{ height: '320px', backgroundColor: '#ffffff', padding: '20px', overflowY: 'auto', fontFamily: 'monospace', fontSize: '12px', scrollBehavior: 'smooth' }}
                        >
                            {consoleLines.length === 0 ? (
                                <p style={{ color: '#94a3b8' }}>{'>'} Awaiting intercepted traffic...</p>
                            ) : (
                                consoleLines.map((line, idx) => (
                                    <div key={idx} style={{ marginBottom: '6px', display: 'flex', gap: '10px' }}>
                                        <span style={{ color: '#e2e8f0' }}>{idx + 1}</span>
                                        <span style={{ color: getLineColor(line.type) }}>{line.text}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>


                    {/* Real Charts */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                        <div style={{ backgroundColor: '#ffffff', padding: '25px', borderRadius: '24px', border: '1px solid #e2e8f0', minHeight: '280px' }}>
                            <h4 style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px' }}>Sensitivity Distribution</h4>
                            <div style={{ height: '180px' }}>
                                <SensitivityDoughnut chartData={chartData} />
                            </div>
                        </div>
                        <div style={{ backgroundColor: '#ffffff', padding: '25px', borderRadius: '24px', border: '1px solid #e2e8f0', minHeight: '280px' }}>
                            <h4 style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px' }}>Traffic Volume (24h)</h4>
                            <div style={{ height: '180px' }}>
                                <PrivacyLineChart chartData={chartData} />
                            </div>
                        </div>
                    </div>
                </div>


                {/* Right Column: Audit Trail */}
                <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Recent Audit History</h3>
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
                            style={{ padding: '8px 16px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                            Download NDPR Report
                        </button>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {logs.length === 0 ? (
                                <p style={{ color: '#94a3b8', textAlign: 'center', marginTop: '40px' }}>No audit data available.</p>
                            ) : (
                                logs.map(log => (
                                    <div key={log._id} style={{ display: 'flex', gap: '15px' }}>
                                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: log.riskScore > 7 ? '#fef2f2' : '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            {log.riskScore > 7 ? <AlertCircle size={18} color="#ef4444" /> : <Clock size={18} color="#10b981" />}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                                <p style={{ fontWeight: '700', fontSize: '14px' }}>{log.event}</p>
                                                <span style={{ fontSize: '11px', color: '#94a3b8' }}>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                            <p style={{ fontSize: '12px', color: '#64748b' }}>{log.user.name} ({log.user.role})</p>
                                            <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                                                <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '12px', backgroundColor: '#f1f5f9', color: '#475569' }}>
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
        </div>
    );
};

const StatCard = ({ label, value, change, color }) => (
    <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '24px', border: '1px solid #e2e8f0', transition: 'all 0.2s ease' }}>
        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '12px' }}>{label}</p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b' }}>{value}</h2>
            <span style={{ fontSize: '12px', fontWeight: '600', color: color }}>{change}</span>
        </div>
    </div>
);

export default AdminDashboard;
