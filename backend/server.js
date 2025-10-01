// Dillon Koekemoer u23537052
const express = require('express');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your-secret-key-change-in-production';

const app = express();
const port = 3001;

// MongoDB connection
const uri = 'mongodb+srv://test-user:test-password@imy220.on7r59y.mongodb.net/?retryWrites=true&w=majority&appName=IMY220';
const client = new MongoClient(uri);
let db;

// Connect to MongoDB
client.connect().then(() => {
    db = client.db('Project');
    console.log('Connected to MongoDB');
}).catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.json());
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});
app.use(express.static(path.join(__dirname, '../public')));

// Auth middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.sendStatus(401);
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Login endpoint
app.post('/api/login', async (req, res) => {
    try {
        if (!db) return res.status(500).json({ error: 'Database not connected' });
        const { email, password } = req.body;
        
        const user = await db.collection('Users').findOne({ email });
        
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Check if password is already hashed or plain text
        let isValidPassword = false;
        if (user.password.startsWith('$2b$')) {
            isValidPassword = await bcrypt.compare(password, user.password);
        } else {
            isValidPassword = password === user.password;
        }
        
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, user: { _id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Register endpoint
app.post('/api/register', async (req, res) => {
    try {
        if (!db) return res.status(500).json({ error: 'Database not connected' });
        const { name, email, password } = req.body;
        
        const existingUser = await db.collection('Users').findOne({ email });
        if (existingUser) return res.status(400).json({ error: 'User already exists' });
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.collection('Users').insertOne({ name, email, password: hashedPassword });
        
        const token = jwt.sign({ userId: result.insertedId, email }, JWT_SECRET, { expiresIn: '24h' });
        res.status(201).json({ token, user: { _id: result.insertedId, name, email } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Temporary endpoint to hash existing passwords
app.post('/api/hash-password', async (req, res) => {
    try {
        if (!db) return res.status(500).json({ error: 'Database not connected' });
        const { email, plainPassword } = req.body;
        
        const hashedPassword = await bcrypt.hash(plainPassword, 10);
        await db.collection('Users').updateOne(
            { email },
            { $set: { password: hashedPassword } }
        );
        
        res.json({ message: 'Password hashed successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Users API endpoints
app.get('/api/users', async (req, res) => {
    try {
        if (!db) return res.status(500).json({ error: 'Database not connected' });
        const users = await db.collection('Users').find({}).toArray();
        res.json(users);
    } catch (error) {
        console.error('Users fetch error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get first user for testing
app.get('/api/users/first', async (req, res) => {
    try {
        if (!db) return res.status(500).json({ error: 'Database not connected' });
        const user = await db.collection('Users').findOne({});
        if (!user) return res.status(404).json({ error: 'No users found' });
        res.json(user);
    } catch (error) {
        console.error('First user fetch error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/users/:id', async (req, res) => {
    try {
        if (!db) return res.status(500).json({ error: 'Database not connected' });
        console.log('Fetching user with ID:', req.params.id);
        
        // Check if ID is valid ObjectId format
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }
        
        const user = await db.collection('Users').findOne({ _id: new ObjectId(req.params.id) });
        console.log('User found:', user);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (error) {
        console.error('User fetch error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/users', authenticateToken, async (req, res) => {
    try {
        const result = await db.collection('Users').insertOne(req.body);
        res.status(201).json({ _id: result.insertedId, ...req.body });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/users/:id', authenticateToken, async (req, res) => {
    try {
        const result = await db.collection('Users').updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: req.body }
        );
        if (result.matchedCount === 0) return res.status(404).json({ error: 'User not found' });
        res.json({ message: 'User updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/users/:id', authenticateToken, async (req, res) => {
    try {
        const result = await db.collection('Users').deleteOne({ _id: new ObjectId(req.params.id) });
        if (result.deletedCount === 0) return res.status(404).json({ error: 'User not found' });
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add friend endpoint
app.post('/api/users/add-friend', async (req, res) => {
    try {
        if (!db) return res.status(500).json({ error: 'Database not connected' });
        
        const { userId, friendId } = req.body;
        console.log('Adding friend:', { userId, friendId });
        
        // Check if friendship already exists
        const existingFriend = await db.collection('Friends')
            .findOne({ userId, friendId });
            
        if (existingFriend) {
            return res.status(400).json({ error: 'Already friends' });
        }
        
        // Add friend relationship
        const result = await db.collection('Friends').insertOne({
            userId,
            friendId,
            status: 'accepted',
            createdAt: new Date().toISOString()
        });
        
        console.log('Friend added successfully:', result.insertedId);
        res.status(201).json({ message: 'Friend added successfully', _id: result.insertedId });
    } catch (error) {
        console.error('Add friend error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Posts API endpoints
app.get('/api/posts', async (req, res) => {
    try {
        if (!db) return res.status(500).json({ error: 'Database not connected' });
        const posts = await db.collection('Posts').find({}).toArray();
        res.json(posts);
    } catch (error) {
        console.error('Posts fetch error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/posts/:id', async (req, res) => {
    try {
        if (!db) return res.status(500).json({ error: 'Database not connected' });
        
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Invalid post ID format' });
        }
        
        const post = await db.collection('Posts').findOne({ _id: new ObjectId(req.params.id) });
        if (!post) return res.status(404).json({ error: 'Post not found' });
        res.json(post);
    } catch (error) {
        console.error('Post fetch error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/posts', authenticateToken, async (req, res) => {
    try {
        const result = await db.collection('Posts').insertOne(req.body);
        res.status(201).json({ _id: result.insertedId, ...req.body });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/posts/:id', authenticateToken, async (req, res) => {
    try {
        const result = await db.collection('Posts').updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: req.body }
        );
        if (result.matchedCount === 0) return res.status(404).json({ error: 'Post not found' });
        res.json({ message: 'Post updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/posts/:id', authenticateToken, async (req, res) => {
    try {
        const result = await db.collection('Posts').deleteOne({ _id: new ObjectId(req.params.id) });
        if (result.deletedCount === 0) return res.status(404).json({ error: 'Post not found' });
        res.json({ message: 'Post deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Feed endpoints
app.get('/api/feed/global', async (req, res) => {
    try {
        if (!db) return res.status(500).json({ error: 'Database not connected' });
        
        const activities = await db.collection('Activities')
            .find({ isGlobal: true })
            .sort({ createdAt: -1 })
            .limit(20)
            .toArray();
            
        const posts = await db.collection('Posts')
            .find({})
            .sort({ createdAt: -1 })
            .limit(10)
            .toArray();
            
        const feed = [...activities, ...posts]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 20);
            
        res.json(feed);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/feed/local/:userId', async (req, res) => {
    try {
        if (!db) return res.status(500).json({ error: 'Database not connected' });
        
        const userId = req.params.userId;
        
        // Get user's friends
        const friends = await db.collection('Friends')
            .find({ userId, status: 'accepted' })
            .toArray();
        const friendIds = friends.map(f => f.friendId);
        friendIds.push(userId); // Include user's own activities
        
        const activities = await db.collection('Activities')
            .find({ userId: { $in: friendIds } })
            .sort({ createdAt: -1 })
            .limit(20)
            .toArray();
            
        const posts = await db.collection('Posts')
            .find({ userId: { $in: friendIds } })
            .sort({ createdAt: -1 })
            .limit(10)
            .toArray();
            
        const feed = [...activities, ...posts]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 20);
            
        res.json(feed);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Friends API endpoints
app.get('/api/friends/:userId', async (req, res) => {
    try {
        if (!db) return res.status(500).json({ error: 'Database not connected' });
        
        const userId = req.params.userId;
        const friends = await db.collection('Friends')
            .find({ userId, status: 'accepted' })
            .toArray();
            
        res.json(friends);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/users/add-friend', async (req, res) => {
    try {
        if (!db) return res.status(500).json({ error: 'Database not connected' });
        
        const { userId, friendId } = req.body;
        
        // Check if friendship already exists
        const existingFriend = await db.collection('Friends')
            .findOne({ userId, friendId });
            
        if (existingFriend) {
            return res.status(400).json({ error: 'Already friends' });
        }
        
        // Add friend relationship
        const result = await db.collection('Friends').insertOne({
            userId,
            friendId,
            status: 'accepted',
            createdAt: new Date().toISOString()
        });
        
        res.status(201).json({ message: 'Friend added successfully', _id: result.insertedId });
    } catch (error) {
        console.error('Add friend error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Catch-all handler: send back React's index.html for any unknown route
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
