const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db.json')

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'your_jwt_secret_here';

// Middleware
app.use(cors());
app.use(bodyParser.json());
// Delay middleware (simulate 5 seconds latency)
app.use((req, res, next) => {
    if (req.path === '/status') {
        return next(); // skip delay for health check
    }
    setTimeout(() => next(), 3000);
});

// Mock data
const users = db.users
const accounts = db.accounts
const transactions = db.transactions


// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({error: 'Access token required'});
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({error: 'Invalid or expired token'});
        }
        req.user = user;
        next();
    });
};

// Routes

// Login endpoint (not protected)
app.post('/auth/login', (req, res) => {
    const {username, password} = req.body;

    if (!username || !password) {
        return res.status(400).json({error: 'Username and password required'});
    }

    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.status(401).json({error: 'Invalid credentials'});
    }

    const token = jwt.sign(
        {id: user.id, username: user.username, name: user.name, role: user.role},
        JWT_SECRET,
        {expiresIn: '24h'}
    );

    res.json({
        token,
        user: {
            id: user.id,
            name: user.name,
            role: user.role
        }
    });
});

// Get accounts (protected)
app.get('/accounts', authenticateToken, (req, res) => {
    const userAccounts = accounts.filter(acc => acc.userId === req.user.id);
    res.json(userAccounts);
});

// Get transactions for a user (userId as param)
app.get('/accounts/:userId/transactions', authenticateToken, (req, res) => {
    const { userId } = req.params;
    const { from, to, query, page = 1, pageSize = 20 } = req.query;

    // Check if the userId matches the authenticated user
    if (userId !== req.user.id) {
        return res.status(403).json({ error: 'Forbidden: Cannot access transactions of another user' });
    }

    // Get user's account IDs
    const userAccounts = accounts.filter(acc => acc.userId === userId);
    const accountIds = userAccounts.map(acc => acc.id);

    // ✅ Filter transactions by accountId
    let userTransactions = transactions
        .filter(tx => accountIds.includes(tx.accountId))
        .map(tx => {
            const account = accounts.find(acc => acc.id === tx.accountId);
            return {
                ...tx,
                account
            };
        });

    // Filter by date range
    if (from) {
        userTransactions = userTransactions.filter(tx => new Date(tx.date) >= new Date(from));
    }

    if (to) {
        userTransactions = userTransactions.filter(tx => new Date(tx.date) <= new Date(to));
    }

    // Filter by query in description
    if (query) {
        userTransactions = userTransactions.filter(tx =>
            tx.description.toLowerCase().includes(query.toLowerCase())
        );
    }

    // Sort transactions (most recent first)
    userTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + parseInt(pageSize);
    const paginatedTransactions = userTransactions.slice(startIndex, endIndex);

    res.json({
        items: paginatedTransactions,
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        total: userTransactions.length
    });
});



// Initiate transfer (protected)
app.post('/transfer', authenticateToken, (req, res) => {
    const {fromAccountId, toAccountNumber, amount, currency, note} = req.body;

    // Validation
    if (!fromAccountId || !toAccountNumber || !amount || !currency) {
        return res.status(400).json({error: 'Missing required fields'});
    }

    if (amount <= 0) {
        return res.status(400).json({error: 'Amount must be positive'});
    }

    // Check if fromAccount belongs to user
    const fromAccount = accounts.find(acc => acc.id === fromAccountId && acc.userId === req.user.id);

    if (!fromAccount) {
        return res.status(404).json({error: 'Source account not found'});
    }

    // Check if sufficient balance
    if (fromAccount.balance < amount) {
        return res.status(400).json({error: 'Insufficient balance'});
    }

    // In a real implementation, we would process the transfer here
    // For mock purposes, we'll just simulate a successful transfer

    // Update account balance (mock)
    fromAccount.balance -= amount;

    // Create a transaction record (mock)
    const newTransaction = {
        id: `tx_${Date.now()}`,
        date: new Date().toISOString(),
        amount: -amount,
        currency,
        description: note || `Transfer to ${toAccountNumber}`,
        status: 'pending'
    };

    if (!transactions[fromAccountId]) {
        transactions[fromAccountId] = [];
    }
    transactions[fromAccountId].unshift(newTransaction);

    // Simulate processing delay
    const estimatedCompletion = new Date();
    estimatedCompletion.setHours(estimatedCompletion.getHours() + 24);

    res.json({
        transferId: `tr_${Date.now()}`,
        status: 'pending',
        estimatedCompletion: estimatedCompletion.toISOString()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({error: 'Something went wrong!'});
});

// Status endpoint
app.get('/status', (req, res) => {
    try {
        res.status(200).json({status: 'ok', message: 'Server is running'});
    } catch (error) {
        res.status(500).json({status: 'error', message: 'Server encountered an error'});
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({error: 'Endpoint not found'});
});

// Start server
app.listen(PORT, () => {
    console.log(`Mock API server running on port ${PORT}`);
    console.log(`Base URL: http://localhost:${PORT}`);
});

module.exports = app;