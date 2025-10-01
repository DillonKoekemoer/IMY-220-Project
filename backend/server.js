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
        console.log('Authenticated user from token:', user);
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
        
        const userId = user._id.toString();
        const token = jwt.sign({ userId, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
        console.log('Login - Generated token for user:', { userId, email: user.email });
        res.json({ token, user: { _id: userId, name: user.name, email: user.email } });
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
        const [firstName, lastName] = name.split(' ');
        const userData = {
            name,
            email,
            password: hashedPassword,
            firstName: firstName || name,
            lastName: lastName || '',
            bio: '',
            location: '',
            website: ''
        };
        const result = await db.collection('Users').insertOne(userData);
        const userId = result.insertedId.toString();
        console.log('New user created with ID:', userId);
        
        const token = jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '24h' });
        res.status(201).json({ token, user: { _id: userId, name, email } });
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
        
        let user;
        
        // Try to find user with ObjectId format first
        if (ObjectId.isValid(req.params.id)) {
            user = await db.collection('Users').findOne({ _id: new ObjectId(req.params.id) });
        }
        
        // If not found and ID is string format, try string lookup
        if (!user) {
            user = await db.collection('Users').findOne({ _id: req.params.id });
        }
        
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

// Remove friend endpoint
app.delete('/api/friends/:userId/:friendId', async (req, res) => {
    try {
        if (!db) return res.status(500).json({ error: 'Database not connected' });
        
        const { userId, friendId } = req.params;
        console.log('Removing friend:', { userId, friendId });
        
        const result = await db.collection('Friends').deleteOne({ userId, friendId });
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Friendship not found' });
        }
        
        console.log('Friend removed successfully');
        res.json({ message: 'Friend removed successfully' });
    } catch (error) {
        console.error('Remove friend error:', error);
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

app.get('/api/posts/project/:projectId', async (req, res) => {
    try {
        if (!db) return res.status(500).json({ error: 'Database not connected' });
        const posts = await db.collection('Posts')
            .find({ projectId: req.params.projectId })
            .sort({ createdAt: -1 })
            .toArray();
        res.json(posts);
    } catch (error) {
        console.error('Project posts fetch error:', error);
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

// Projects API endpoints
app.get('/api/projects', async (req, res) => {
    try {
        if (!db) return res.status(500).json({ error: 'Database not connected' });
        const projects = await db.collection('Projects').find({}).toArray();
        res.json(projects);
    } catch (error) {
        console.error('Projects fetch error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/projects/:id', async (req, res) => {
    try {
        if (!db) return res.status(500).json({ error: 'Database not connected' });
        
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Invalid project ID format' });
        }
        
        const project = await db.collection('Projects').findOne({ _id: new ObjectId(req.params.id) });
        if (!project) return res.status(404).json({ error: 'Project not found' });
        res.json(project);
    } catch (error) {
        console.error('Project fetch error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/projects', async (req, res) => {
    try {
        if (!db) return res.status(500).json({ error: 'Database not connected' });
        const result = await db.collection('Projects').insertOne(req.body);
        res.status(201).json({ _id: result.insertedId, ...req.body });
    } catch (error) {
        console.error('Project create error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/projects/:id', authenticateToken, async (req, res) => {
    try {
        if (!db) return res.status(500).json({ error: 'Database not connected' });
        
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Invalid project ID format' });
        }
        
        const result = await db.collection('Projects').updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: req.body }
        );
        if (result.matchedCount === 0) return res.status(404).json({ error: 'Project not found' });
        res.json({ message: 'Project updated' });
    } catch (error) {
        console.error('Project update error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/projects/:id', authenticateToken, async (req, res) => {
    try {
        if (!db) return res.status(500).json({ error: 'Database not connected' });
        
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Invalid project ID format' });
        }
        
        const result = await db.collection('Projects').deleteOne({ _id: new ObjectId(req.params.id) });
        if (result.deletedCount === 0) return res.status(404).json({ error: 'Project not found' });
        res.json({ message: 'Project deleted' });
    } catch (error) {
        console.error('Project delete error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Feed endpoints - Projects for main feed
app.get('/api/feed/projects/global', async (req, res) => {
    try {
        if (!db) return res.status(500).json({ error: 'Database not connected' });
        
        const projects = await db.collection('Projects')
            .find({})
            .sort({ createdAt: -1 })
            .limit(20)
            .toArray();
            
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/feed/projects/local/:userId', async (req, res) => {
    try {
        if (!db) return res.status(500).json({ error: 'Database not connected' });
        
        const userId = req.params.userId;
        
        // Get user's friends
        const friends = await db.collection('Friends')
            .find({ userId, status: 'accepted' })
            .toArray();
        const friendIds = friends.map(f => f.friendId);
        friendIds.push(userId); // Include user's own projects
        
        const projects = await db.collection('Projects')
            .find({ userId: { $in: friendIds } })
            .sort({ createdAt: -1 })
            .limit(20)
            .toArray();
            
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Activity feed endpoints - Posts for sidebar
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

// Project collaboration endpoints
app.post('/api/projects/:projectId/join', authenticateToken, async (req, res) => {
    try {
        if (!db) return res.status(500).json({ error: 'Database not connected' });
        
        const { projectId } = req.params;
        const userId = req.user.userId;
        
        console.log('Join project request:', { projectId, userId });
        
        if (!ObjectId.isValid(projectId)) {
            return res.status(400).json({ error: 'Invalid project ID' });
        }
        
        const project = await db.collection('Projects').findOne({ _id: new ObjectId(projectId) });
        if (!project) return res.status(404).json({ error: 'Project not found' });
        
        // Check if user is the owner
        if (project.userId === userId) {
            return res.status(400).json({ error: 'Cannot join your own project' });
        }
        
        const collaborators = project.collaborators || [];
        if (collaborators.includes(userId)) {
            return res.status(400).json({ error: 'Already a collaborator' });
        }
        
        await db.collection('Projects').updateOne(
            { _id: new ObjectId(projectId) },
            { $push: { collaborators: userId } }
        );
        
        console.log('User joined project successfully');
        res.json({ message: 'Joined project successfully' });
    } catch (error) {
        console.error('Join project error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/projects/:projectId/leave', authenticateToken, async (req, res) => {
    try {
        if (!db) return res.status(500).json({ error: 'Database not connected' });
        
        const { projectId } = req.params;
        const userId = req.user.userId;
        
        await db.collection('Projects').updateOne(
            { _id: new ObjectId(projectId) },
            { $pull: { collaborators: userId } }
        );
        
        res.json({ message: 'Left project successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/projects/:projectId/collaborators', async (req, res) => {
    try {
        if (!db) return res.status(500).json({ error: 'Database not connected' });
        
        const { projectId } = req.params;
        const project = await db.collection('Projects').findOne({ _id: new ObjectId(projectId) });
        
        if (!project) return res.status(404).json({ error: 'Project not found' });
        
        const collaboratorIds = project.collaborators || [];
        const validIds = collaboratorIds.filter(id => ObjectId.isValid(id));
        const collaborators = await db.collection('Users')
            .find({ _id: { $in: validIds.map(id => new ObjectId(id)) } })
            .toArray();
            
        res.json(collaborators);
    } catch (error) {
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
