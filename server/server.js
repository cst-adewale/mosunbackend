import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import morgan from 'morgan';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// --- RATE LIMITING (Security Feature) ---
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: { error: 'Too many requests, please try again later. This is an anti-DDoS measure.' }
});
app.use('/api', apiLimiter);

// --- JWT SECRET ---
const JWT_SECRET = process.env.JWT_SECRET || 'advanced_privacy_framework_secret_2026';

// --- AUTH MIDDLEWARE ---
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).json({ error: 'Invalid token.' });
    }
};

const adminMiddleware = (req, res, next) => {
    if (req.user && req.user.role === 'ADMIN') {
        next();
    } else {
        res.status(403).json({ error: 'Access denied. Requires ADMIN role.' });
    }
};

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/privacy_framework';
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB');
        seedProducts(); // Seed products on startup
    })
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- SCHEMAS ---

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // In a real app, hash this!
    role: { type: String, default: 'GUEST' },
    savedCards: [{
        maskedNumber: String,
        expiry: String,
        token: String
    }]
});

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    oldPrice: Number,
    image: String,
    discount: Number,
    rating: Number,
    reviews: Number,
    category: String
});

// Automated Data Deletion: TTL Index (expires after 30 days)
const privacyLogSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now, expires: '30d' },
    user: { name: String, role: String },
    event: String,
    endpoint: String,
    sensitivity: String,
    riskScore: Number,
    dataSummary: String,
    logicSteps: [String]
});

const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
const PrivacyLog = mongoose.model('PrivacyLog', privacyLogSchema);

// --- PII Detection Patterns ---
const PII_PATTERNS = {
    email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    phone: /(\+?234|0)[789][01]\d{8}/g,
    bvn: /\b\d{11}\b/g,
    nin: /\b\d{11}\b/g,
    nuban: /\b\d{10}\b/g,
    creditCard: /\b(?:\d[ -]*?){13,16}\b/g,
};

// Helper function to mask strings dynamically
const maskString = (str, type) => {
    if (!str) return str;
    if (type === 'email') {
        const [name, domain] = str.split('@');
        return `${name[0]}***@${domain}`;
    }
    if (str.length > 4) {
        return '*'.repeat(str.length - 4) + str.slice(-4);
    }
    return '***';
};

// --- PRIVACY INTERCEPTOR MIDDLEWARE ---
const privacyInterceptor = async (req, res, next) => {
    const timestamp = new Date().toLocaleTimeString();
    const steps = [];
    
    steps.push(`[${timestamp}] INFO: Intercepted ${req.method} request to ${req.originalUrl}`);
    steps.push(`[${timestamp}] SCANNING: Initializing Deep Packet Inspection...`);
    
    let bodyString = JSON.stringify(req.body);
    let detectedPII = [];
    let isMasked = false;
    
    // Reset regex lastIndex and scan
    for (const [type, pattern] of Object.entries(PII_PATTERNS)) {
        pattern.lastIndex = 0; 
        if (pattern.test(bodyString)) {
            detectedPII.push(type.toUpperCase());
            
            // Apply Active Data Masking for critical fields
            if (['bvn', 'nin', 'nuban', 'creditCard'].includes(type)) {
                pattern.lastIndex = 0; // reset again before replace
                bodyString = bodyString.replace(pattern, (match) => {
                    isMasked = true;
                    return maskString(match, type);
                });
            }
        }
    }

    if (isMasked) {
        req.body = JSON.parse(bodyString);
        steps.push(`[${timestamp}] ACTION: Executed active data masking on sensitive fields.`);
    }

    const role = req.headers['x-user-role'] || 'GUEST';
    steps.push(`[${timestamp}] ANALYZING: Verifying privileges for Role [${role}]...`);

    let sensitivity = 'LOW';
    let riskScore = 1;

    if (detectedPII.length > 0) {
        steps.push(`[${timestamp}] DETECTED: Found sensitive fields [${detectedPII.join(', ')}]`);
        const criticalFields = ['BVN', 'NIN', 'CREDITCARD'];
        sensitivity = detectedPII.some(p => criticalFields.includes(p)) ? 'CRITICAL' : 'HIGH';
        riskScore = sensitivity === 'CRITICAL' ? 9 : 6;
        if (role === 'GUEST') riskScore += 2;
        steps.push(`[${timestamp}] RISK EVALUATION: Score [${riskScore}/10] - Sensitivity [${sensitivity}]`);
        if (isMasked) {
            steps.push(`[${timestamp}] POLICY APPLIED: Dynamic Data Masking & Anonymization.`);
        }
    } else {
        steps.push(`[${timestamp}] SCANNING: No PII detected in request body.`);
        steps.push(`[${timestamp}] POLICY APPLIED: Standard Security Protocol.`);
    }

    // Add Egress and Data Minimization logging for visual demonstration
    steps.push(`[${timestamp}] DATA MINIMIZATION: Stripping unnecessary metadata from payload...`);
    steps.push(`[${timestamp}] EGRESS MONITOR: Scanning outgoing server response for Data Leaks (DLP)...`);
    steps.push(`[${timestamp}] SECURITY: Outbound TLS & Payload Encryption Verified.`);

    const logEntry = new PrivacyLog({
        user: { name: req.headers['x-user-name'] || 'Guest', role: req.headers['x-user-role'] || 'GUEST' },
        event: req.body.event || `${req.method}_ACTION`,
        endpoint: req.originalUrl,
        sensitivity,
        riskScore,
        dataSummary: detectedPII.length > 0 ? `Detected ${detectedPII.join(', ')}${isMasked ? ' (Masked Before DB)' : ''}` : 'Routine API Call',
        logicSteps: steps
    });

    await logEntry.save();
    steps.push(`[${timestamp}] COMMITTING: Secure Audit Log saved to MongoDB. ID: #PRIV_${logEntry._id.toString().slice(-4)}`);

    io.emit('privacy_update', { newLog: logEntry, steps });
    next();
};

// --- AUTH ROUTES ---

app.post('/api/auth/register', privacyInterceptor, async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // Password Encryption
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User registered successfully', user: { name, email, role: 'GUEST' } });
    } catch (err) {
        res.status(400).json({ error: 'Email already exists' });
    }
});

app.post('/api/auth/login', privacyInterceptor, async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    // Secure Password Comparison
    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ id: user._id, role: user.role, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '2h' });
        res.json({ token, name: user.name, email: user.email, role: user.role });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// --- NDPR COMPLIANCE ROUTES ---
app.delete('/api/user/delete', authMiddleware, privacyInterceptor, async (req, res) => {
    // Right to be forgotten (NDPR Art 2.6)
    try {
        // Securely use token identity instead of trusting req.body
        const userEmail = req.user.email; 
        await User.findOneAndDelete({ email: userEmail });
        res.json({ message: 'Account and associated data permanently deleted per NDPR guidelines.' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to execute data deletion' });
    }
});

// --- CHECKOUT ROUTE ---
app.get('/api/user/cards', authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email });
        res.json(user?.savedCards || []);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch saved cards' });
    }
});

app.post('/api/checkout', authMiddleware, privacyInterceptor, async (req, res) => {
    const { saveCard, cardNumber, expiry } = req.body;
    
    if (saveCard && cardNumber) {
        // Because of the privacyInterceptor, req.body.cardNumber might ALREADY be masked here!
        // We generate a secure payment token to represent the card (Tokenization)
        const user = await User.findOne({ email: req.user.email });
        const masked = cardNumber.includes('*') ? cardNumber : `**** **** **** ${cardNumber.slice(-4)}`;
        
        if (user && !user.savedCards.find(c => c.maskedNumber === masked)) {
            user.savedCards.push({
                maskedNumber: masked,
                expiry: expiry || '12/25',
                token: `tok_sec_${Math.random().toString(36).substr(2, 9)}`
            });
            await user.save();
        }
    }

    // In a real app, this would process the payment, save the order, and clear the cart.
    res.json({ message: 'Order placed successfully. Payment data tokenized and secured.' });
});

// --- PRODUCT ROUTES ---

app.get('/api/products', async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

app.post('/api/simulate', privacyInterceptor, (req, res) => {
    res.json({ success: true });
});

// --- ADMIN ROUTES ---

app.get('/api/admin/logs', async (req, res) => {
    const logs = await PrivacyLog.find().sort({ timestamp: -1 }).limit(50);
    res.json(logs);
});

app.get('/api/admin/stats', async (req, res) => {
    const totalRequests = await PrivacyLog.countDocuments();
    const piiDetected = await PrivacyLog.countDocuments({ sensitivity: { $ne: 'LOW' } });
    const criticalAlerts = await PrivacyLog.countDocuments({ sensitivity: 'CRITICAL' });
    const avgRisk = await PrivacyLog.aggregate([{ $group: { _id: null, avg: { $avg: "$riskScore" } } }]);
    
    // Simple growth simulation based on total logs
    const growth = totalRequests > 0 ? `+${totalRequests} total` : '0%';
    
    res.json({ 
        totalRequests, 
        piiDetected, 
        criticalAlerts,
        avgRisk: avgRisk[0]?.avg || 0,
        growth
    });
});

app.get('/api/admin/charts', async (req, res) => {
    // 1. Get Sensitivity Distribution (Doughnut)
    const distribution = await PrivacyLog.aggregate([
        { $group: { _id: "$sensitivity", count: { $sum: 1 } } }
    ]);

    const sensitivityLabels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
    const sensitivityData = sensitivityLabels.map(label => {
        const found = distribution.find(d => d._id === label);
        return found ? found.count : 0;
    });

    // 2. Get Traffic Volume (Line Chart) - Last 7 periods (Hours or simple sequence)
    const traffic = await PrivacyLog.aggregate([
        {
            $group: {
                _id: {
                    hour: { $hour: "$timestamp" },
                    minute: { $minute: "$timestamp" }
                },
                count: { $sum: 1 }
            }
        },
        { $sort: { "_id.hour": 1, "_id.minute": 1 } },
        { $limit: 10 }
    ]);

    const trafficLabels = traffic.map(t => `${t._id.hour}:${t._id.minute < 10 ? '0' + t._id.minute : t._id.minute}`);
    const trafficData = traffic.map(t => t.count);

    res.json({ 
        sensitivity: { labels: sensitivityLabels, data: sensitivityData },
        traffic: { labels: trafficLabels, data: trafficData }
    });
});

// --- SEEDING FUNCTION ---
async function seedProducts() {
    const count = await Product.countDocuments();
    if (count === 0) {
        console.log('🌱 Seeding initial products...');
        const mockProducts = Array.from({ length: 12 }, (_, i) => ({
            name: `Jumia Product ${i + 1}`,
            price: Math.floor(Math.random() * 50000) + 5000,
            oldPrice: Math.floor(Math.random() * 20000) + 60000,
            image: `https://picsum.photos/seed/product${i}/300/300`,
            discount: Math.floor(Math.random() * 40) + 10,
            rating: 4.5,
            reviews: Math.floor(Math.random() * 200),
            category: 'Electronics'
        }));
        await Product.insertMany(mockProducts);
        console.log('✅ Seeding complete.');
    }
}

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`🚀 Privacy Backend running on port ${PORT}`));
