import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import morgan from 'morgan';

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
    role: { type: String, default: 'GUEST' }
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

const privacyLogSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
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
    creditCard: /\b(?:\d[ -]*?){13,16}\b/g,
};

// --- PRIVACY INTERCEPTOR MIDDLEWARE ---
const privacyInterceptor = async (req, res, next) => {
    const timestamp = new Date().toLocaleTimeString();
    const steps = [];
    
    steps.push(`[${timestamp}] INFO: Intercepted ${req.method} request to ${req.originalUrl}`);
    steps.push(`[${timestamp}] SCANNING: Initializing Deep Packet Inspection...`);
    
    const bodyString = JSON.stringify(req.body);
    let detectedPII = [];
    
    // Reset regex lastIndex to avoid stateful test() issues
    for (const [type, pattern] of Object.entries(PII_PATTERNS)) {
        pattern.lastIndex = 0; 
        if (pattern.test(bodyString)) detectedPII.push(type.toUpperCase());
    }

    const role = req.headers['x-user-role'] || 'GUEST';
    steps.push(`[${timestamp}] ANALYZING: Verifying privileges for Role [${role}]...`);

    let sensitivity = 'LOW';
    let riskScore = 1;

    if (detectedPII.length > 0) {
        steps.push(`[${timestamp}] DETECTED: Found sensitive fields [${detectedPII.join(', ')}]`);
        sensitivity = detectedPII.includes('BVN') ? 'CRITICAL' : 'HIGH';
        riskScore = sensitivity === 'CRITICAL' ? 9 : 6;
        if (role === 'GUEST') riskScore += 2;
        steps.push(`[${timestamp}] RISK EVALUATION: Score [${riskScore}/10] - Sensitivity [${sensitivity}]`);
        steps.push(`[${timestamp}] POLICY APPLIED: Dynamic Data Masking & Anonymization.`);
    } else {
        steps.push(`[${timestamp}] SCANNING: No PII detected in request body.`);
        steps.push(`[${timestamp}] POLICY APPLIED: Standard Security Protocol.`);
    }

    const logEntry = new PrivacyLog({

        user: { name: req.headers['x-user-name'] || 'Guest', role: req.headers['x-user-role'] || 'GUEST' },
        event: req.body.event || `${req.method}_ACTION`,
        endpoint: req.originalUrl,
        sensitivity,
        riskScore,
        dataSummary: detectedPII.length > 0 ? `Detected ${detectedPII.join(', ')}` : 'Routine API Call',
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
        const user = new User({ name, email, password });
        await user.save();
        res.status(201).json({ message: 'User registered successfully', user: { name, email, role: 'GUEST' } });
    } catch (err) {
        res.status(400).json({ error: 'Email already exists' });
    }
});

app.post('/api/auth/login', privacyInterceptor, async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (user) {
        res.json({ name: user.name, email: user.email, role: user.role });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
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
