// Dillon Koekemoer u23537052
const express = require('express');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs');

const JWT_SECRET = 'your-secret-key-change-in-production';

const app = express();
const port = 3001;

// Create uploads directories if they don't exist
const uploadsBaseDir = path.join(__dirname, '../public/uploads');
const profilePicturesDir = path.join(uploadsBaseDir, 'profile-pictures');
const projectFilesDir = path.join(uploadsBaseDir, 'project-files');

[uploadsBaseDir, profilePicturesDir, projectFilesDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
    }
});

// Configure Multer for profile picture uploads
const profilePictureStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, profilePicturesDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Configure Multer for project file uploads
const projectFileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, projectFilesDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'project-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter for images only (profile pictures)
const imageFileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

// File filter for project files (more permissive)
const projectFileFilter = (req, file, cb) => {
    // Allow common project file types
    const allowedTypes = [
        'image/',
        'application/pdf',
        'application/zip',
        'application/x-zip-compressed',
        'text/',
        'application/json',
        'application/javascript',
        'application/xml'
    ];

    const isAllowed = allowedTypes.some(type => file.mimetype.startsWith(type));
    if (isAllowed) {
        cb(null, true);
    } else {
        cb(new Error('File type not allowed'), false);
    }
};

// Multer instances
const uploadProfilePicture = multer({
    storage: profilePictureStorage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit for profile pictures
    }
});

const uploadProjectFile = multer({
    storage: projectFileStorage,
    fileFilter: projectFileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit for project files
    }
});

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
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Helper function to generate placeholder profile picture
const getRandomPlaceholderImage = (seed) => {
    const colors = [
        'FF6B35', 'F7931E', 'FDC830', '37B9F1', '4ECDC4',
        'E63946', 'A8DADC', 'F4A261', 'E76F51', '2A9D8F',
        '264653', 'E9C46A', 'F77F00', '06D6A0', '118AB2'
    ];

    // Use seed to consistently select a color
    const colorIndex = seed ? parseInt(seed.toString().substring(0, 8), 16) % colors.length : Math.floor(Math.random() * colors.length);
    const bgColor = colors[colorIndex];

    return `placeholder-${bgColor}`;
};

// Auth middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        console.log('No token provided');
        return res.status(401).json({ error: 'Authentication token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.log('Token verification failed:', err.message);
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
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
        res.json({
            token,
            user: {
                _id: userId,
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture,
                firstName: user.firstName,
                lastName: user.lastName,
                bio: user.bio,
                location: user.location,
                website: user.website
            }
        });
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
            website: '',
            profilePicture: getRandomPlaceholderImage(email)
        };
        const result = await db.collection('Users').insertOne(userData);
        const userId = result.insertedId.toString();
        console.log('New user created with ID:', userId);

        const token = jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '24h' });
        res.status(201).json({
            token,
            user: {
                _id: userId,
                name,
                email,
                profilePicture: userData.profilePicture,
                firstName: userData.firstName,
                lastName: userData.lastName,
                bio: userData.bio,
                location: userData.location,
                website: userData.website
            }
        });
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

// Upload profile picture endpoint
app.post('/api/users/:id/profile-picture', authenticateToken, uploadProfilePicture.single('profilePicture'), async (req, res) => {
    try {
        if (!db) return res.status(500).json({ error: 'Database not connected' });

        console.log('Profile picture upload request for user:', req.params.id);
        console.log('Authenticated user:', req.user);
        console.log('File received:', req.file ? req.file.filename : 'none');

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const userId = req.params.id;
        const profilePicturePath = `/uploads/profile-pictures/${req.file.filename}`;

        // Get the old profile picture to delete it
        const user = await db.collection('Users').findOne({ _id: new ObjectId(userId) });
        if (user && user.profilePicture && !user.profilePicture.startsWith('placeholder-')) {
            const oldPicturePath = path.join(__dirname, '../public', user.profilePicture);
            if (fs.existsSync(oldPicturePath)) {
                fs.unlinkSync(oldPicturePath);
            }
        }

        // Update user's profile picture
        const result = await db.collection('Users').updateOne(
            { _id: new ObjectId(userId) },
            { $set: { profilePicture: profilePicturePath } }
        );

        if (result.matchedCount === 0) {
            // Delete uploaded file if user not found
            fs.unlinkSync(req.file.path);
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            message: 'Profile picture updated successfully',
            profilePicture: profilePicturePath
        });
    } catch (error) {
        console.error('Profile picture upload error:', error);
        // Clean up uploaded file on error
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
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

// Send friend request endpoint
app.post('/api/users/send-friend-request', async (req, res) => {
    try {
        if (!db) return res.status(500).json({ error: 'Database not connected' });
        
        const { userId, friendId } = req.body;
        console.log('Sending friend request:', { userId, friendId });
        
        // Check if request already exists
        const existingRequest = await db.collection('Friends')
            .findOne({ $or: [{ userId, friendId }, { userId: friendId, friendId: userId }] });
            
        if (existingRequest) {
            return res.status(400).json({ error: 'Friend request already exists or already friends' });
        }
        
        // Add friend request
        const result = await db.collection('Friends').insertOne({
            userId,
            friendId,
            status: 'pending',
            createdAt: new Date().toISOString()
        });
        
        console.log('Friend request sent successfully:', result.insertedId);
        res.status(201).json({ message: 'Friend request sent successfully', _id: result.insertedId });
    } catch (error) {
        console.error('Send friend request error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Accept friend request endpoint
app.post('/api/users/accept-friend-request', async (req, res) => {
    try {
        if (!db) return res.status(500).json({ error: 'Database not connected' });
        
        const { userId, friendId } = req.body;
        
        const result = await db.collection('Friends').updateOne(
            { userId: friendId, friendId: userId, status: 'pending' },
            { $set: { status: 'accepted' } }
        );
        
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Friend request not found' });
        }
        
        // Create reciprocal friendship
        await db.collection('Friends').insertOne({
            userId,
            friendId,
            status: 'accepted',
            createdAt: new Date().toISOString()
        });
        
        res.json({ message: 'Friend request accepted' });
    } catch (error) {
        console.error('Accept friend request error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Check friendship status endpoint
app.get('/api/users/friendship-status/:userId/:friendId', async (req, res) => {
    try {
        if (!db) return res.status(500).json({ error: 'Database not connected' });
        
        const { userId, friendId } = req.params;
        
        const friendship = await db.collection('Friends')
            .findOne({ userId, friendId });
            
        const pendingRequest = await db.collection('Friends')
            .findOne({ userId: friendId, friendId: userId, status: 'pending' });
            
        if (friendship && friendship.status === 'accepted') {
            res.json({ status: 'friends' });
        } else if (friendship && friendship.status === 'pending') {
            res.json({ status: 'request_sent' });
        } else if (pendingRequest) {
            res.json({ status: 'request_received' });
        } else {
            res.json({ status: 'none' });
        }
    } catch (error) {
        console.error('Check friendship status error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Remove friend/unfriend endpoint
app.delete('/api/friends/:userId/:friendId', async (req, res) => {
    try {
        if (!db) return res.status(500).json({ error: 'Database not connected' });
        
        const { userId, friendId } = req.params;
        console.log('Removing friend:', { userId, friendId });
        
        // Remove both directions of friendship
        await db.collection('Friends').deleteMany({
            $or: [
                { userId, friendId },
                { userId: friendId, friendId: userId }
            ]
        });
        
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

        const projectData = {
            ...req.body,
            createdAt: req.body.createdAt || new Date().toISOString(),
            status: req.body.status || 'checked-in',
            files: [],
            members: [req.body.userId],
            owner: req.body.userId,
            lastStatusChange: new Date().toISOString()
        };

        const result = await db.collection('Projects').insertOne(projectData);
        res.status(201).json({ _id: result.insertedId, ...projectData });
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

// Upload project image endpoint
app.post('/api/projects/:id/image', authenticateToken, uploadProfilePicture.single('projectImage'), async (req, res) => {
    try {
        if (!db) return res.status(500).json({ error: 'Database not connected' });

        console.log('Project image upload request for project:', req.params.id);
        console.log('Authenticated user:', req.user);
        console.log('File received:', req.file ? req.file.filename : 'none');

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const projectId = req.params.id;
        const projectImagePath = `/uploads/profile-pictures/${req.file.filename}`;

        // Get the old project image to delete it
        const project = await db.collection('Projects').findOne({ _id: new ObjectId(projectId) });
        if (project && project.projectImage && !project.projectImage.startsWith('http')) {
            const oldImagePath = path.join(__dirname, '../public', project.projectImage);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        // Update project's image
        const result = await db.collection('Projects').updateOne(
            { _id: new ObjectId(projectId) },
            { $set: { projectImage: projectImagePath } }
        );

        if (result.matchedCount === 0) {
            // Delete uploaded file if project not found
            fs.unlinkSync(req.file.path);
            return res.status(404).json({ error: 'Project not found' });
        }

        res.json({
            message: 'Project image updated successfully',
            projectImage: projectImagePath
        });
    } catch (error) {
        console.error('Project image upload error:', error);
        // Clean up uploaded file on error
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ error: error.message });
    }
});

// Upload project files endpoint
app.post('/api/projects/:id/files', authenticateToken, uploadProjectFile.array('projectFiles', 10), async (req, res) => {
    try {
        if (!db) return res.status(500).json({ error: 'Database not connected' });

        console.log('Project files upload request for project:', req.params.id);
        console.log('Files received:', req.files ? req.files.length : 0);

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        const projectId = req.params.id;
        const files = req.files.map(file => ({
            filename: file.filename,
            originalName: file.originalname,
            path: `/uploads/project-files/${file.filename}`,
            size: file.size,
            mimetype: file.mimetype,
            uploadedAt: new Date().toISOString()
        }));

        // Update project with new files
        const result = await db.collection('Projects').updateOne(
            { _id: new ObjectId(projectId) },
            { $push: { files: { $each: files } } }
        );

        if (result.matchedCount === 0) {
            // Delete uploaded files if project not found
            req.files.forEach(file => {
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            });
            return res.status(404).json({ error: 'Project not found' });
        }

        res.json({
            message: 'Files uploaded successfully',
            files: files
        });
    } catch (error) {
        console.error('Project files upload error:', error);
        // Clean up uploaded files on error
        if (req.files) {
            req.files.forEach(file => {
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            });
        }
        res.status(500).json({ error: error.message });
    }
});

// Delete project file endpoint
app.delete('/api/projects/:id/files/:fileId', authenticateToken, async (req, res) => {
    try {
        if (!db) return res.status(500).json({ error: 'Database not connected' });

        const projectId = req.params.id;
        const fileId = req.params.fileId;

        const project = await db.collection('Projects').findOne({ _id: new ObjectId(projectId) });
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const file = project.files?.find(f => f._id?.toString() === fileId || f.filename === fileId);
        if (file) {
            const filePath = path.join(__dirname, '../public', file.path);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        const result = await db.collection('Projects').updateOne(
            { _id: new ObjectId(projectId) },
            { $pull: { files: { $or: [{ _id: fileId }, { filename: fileId }] } } }
        );

        res.json({ message: 'File deleted successfully' });
    } catch (error) {
        console.error('Project file delete error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update project status (checked in/out)
app.patch('/api/projects/:id/status', authenticateToken, async (req, res) => {
    try {
        if (!db) return res.status(500).json({ error: 'Database not connected' });

        const { status } = req.body;
        if (!['checked-in', 'checked-out'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status. Must be "checked-in" or "checked-out"' });
        }

        const result = await db.collection('Projects').updateOne(
            { _id: new ObjectId(req.params.id) },
            {
                $set: {
                    status: status,
                    lastStatusChange: new Date().toISOString()
                }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.json({ message: 'Project status updated', status });
    } catch (error) {
        console.error('Project status update error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Remove member from project
app.delete('/api/projects/:projectId/members/:userId', authenticateToken, async (req, res) => {
    try {
        if (!db) return res.status(500).json({ error: 'Database not connected' });

        const { projectId, userId } = req.params;
        const requesterId = req.user.userId;

        // Check if requester is the project owner
        const project = await db.collection('Projects').findOne({ _id: new ObjectId(projectId) });
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        if (project.userId !== requesterId && project.owner?.toString() !== requesterId) {
            return res.status(403).json({ error: 'Only project owner can remove members' });
        }

        // Remove the member
        const result = await db.collection('Projects').updateOne(
            { _id: new ObjectId(projectId) },
            { $pull: { members: userId, collaborators: userId } }
        );

        res.json({ message: 'Member removed successfully' });
    } catch (error) {
        console.error('Remove member error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Transfer project ownership
app.patch('/api/projects/:projectId/transfer-ownership', authenticateToken, async (req, res) => {
    try {
        if (!db) return res.status(500).json({ error: 'Database not connected' });

        const { projectId } = req.params;
        const { newOwnerId } = req.body;
        const requesterId = req.user.userId;

        if (!newOwnerId) {
            return res.status(400).json({ error: 'New owner ID is required' });
        }

        // Check if requester is the current project owner
        const project = await db.collection('Projects').findOne({ _id: new ObjectId(projectId) });
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        if (project.userId !== requesterId && project.owner?.toString() !== requesterId) {
            return res.status(403).json({ error: 'Only current owner can transfer ownership' });
        }

        // Verify new owner exists and is a member of the project
        const newOwner = await db.collection('Users').findOne({ _id: new ObjectId(newOwnerId) });
        if (!newOwner) {
            return res.status(404).json({ error: 'New owner user not found' });
        }

        // Transfer ownership
        const result = await db.collection('Projects').updateOne(
            { _id: new ObjectId(projectId) },
            {
                $set: {
                    userId: newOwnerId,
                    owner: new ObjectId(newOwnerId),
                    transferredAt: new Date().toISOString(),
                    previousOwner: requesterId
                }
            }
        );

        res.json({
            message: 'Project ownership transferred successfully',
            newOwnerId
        });
    } catch (error) {
        console.error('Transfer ownership error:', error);
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

// Get friend requests endpoint
app.get('/api/friend-requests/:userId', async (req, res) => {
    try {
        if (!db) return res.status(500).json({ error: 'Database not connected' });
        
        const userId = req.params.userId;
        const requests = await db.collection('Friends')
            .find({ friendId: userId, status: 'pending' })
            .toArray();
            
        res.json(requests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user's projects endpoint
app.get('/api/users/:userId/projects', async (req, res) => {
    try {
        if (!db) return res.status(500).json({ error: 'Database not connected' });
        
        const userId = req.params.userId;
        const projects = await db.collection('Projects')
            .find({ userId })
            .sort({ createdAt: -1 })
            .toArray();
            
        res.json(projects);
    } catch (error) {
        console.error('User projects fetch error:', error);
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
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});