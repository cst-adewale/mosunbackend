const Footer = () => {
    return (
        <footer style={{ backgroundColor: '#313133', color: '#fff', padding: '40px 0', marginTop: '40px' }}>
            <div className="container grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px' }}>
                <div>
                    <h4 style={{ marginBottom: '20px' }}>LET US HELP YOU</h4>
                    <ul style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '8px', color: '#ccc' }}>
                        <li>Help Center</li>
                        <li>How to shop on Jumia?</li>
                        <li>Delivery options and timelines</li>
                        <li>How to return a product on Jumia?</li>
                    </ul>
                </div>
                <div>
                    <h4 style={{ marginBottom: '20px' }}>ABOUT JUMIA</h4>
                    <ul style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '8px', color: '#ccc' }}>
                        <li>About us</li>
                        <li>Jumia careers</li>
                        <li>Jumia Express</li>
                        <li>Terms and Conditions</li>
                        <li>Privacy Notice</li>
                    </ul>
                </div>
                <div>
                    <h4 style={{ marginBottom: '20px' }}>MAKE MONEY WITH JUMIA</h4>
                    <ul style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '8px', color: '#ccc' }}>
                        <li>Sell on Jumia</li>
                        <li>Become a Logistics Service Partner</li>
                        <li>Jumia City Partner Program</li>
                    </ul>
                </div>
                <div>
                    <h4 style={{ marginBottom: '20px' }}>JUMIA INTERNATIONAL</h4>
                    <ul style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '8px', color: '#ccc' }}>
                        <li>Algeria | Egypt | Ghana | Ivory Coast</li>
                        <li>Kenya | Morocco | Senegal | Tunisia | Uganda</li>
                    </ul>
                </div>
            </div>
            <div style={{ textAlign: 'center', borderTop: '1px solid #444', marginTop: '40px', paddingTop: '20px', fontSize: '12px', color: '#757575' }}>
                © 2026 Jumia Mock - Built for Final Year Project (Data Privacy Monitoring Framework)
            </div>
        </footer>
    );
};

export default Footer;
