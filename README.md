# CodeForge

**Author:** Dillon Koekemoer (u23537052)
**Course:** IMY 220 
**GitHub:** [https://github.com/DillonKoekemoer/IMY-220-Project](https://github.com/DillonKoekemoer/IMY-220-Project)

## About

CodeForge is a collaborative version control platform with a forge/blacksmithing theme. Users can create projects, manage files, collaborate with team members, and connect with other developers.

**Test Account:**
Email: test@gmail.com
Password: Test-password123

## Technical Overview

### Database Connection Method
- **System:** MongoDB Atlas
- **Connection String:** `mongodb+srv://test-user:test-password@imy220.on7r59y.mongodb.net/`
- **Database Name:** `Project`
- **Collections:** Users, Friends, Projects, Posts

The application connects to MongoDB Atlas on startup via the connection string in [backend/server.js](backend/server.js)

### File Storage
- **Location:** `public/uploads/` directory
- **Structure:**
  - `profile-pictures/` - User avatars
  - `project-files/` - Project materials (code, documents, images)
- **Middleware:** Multer handles file uploads
- **Storage Method:** Files are stored on the local filesystem with metadata (filename, mimetype, size) saved to MongoDB
- **Access:** Files are served statically via Express and can be downloaded by authorized users

### JWT Authentication
- **Library:** jsonwebtoken
- **Flow:**
  1. User logs in with email/password
  2. Backend verifies credentials and generates JWT token
  3. Token contains user ID and email
  4. Frontend stores token in localStorage
  5. All API requests include token in Authorization header
  6. Backend middleware verifies token on protected routes
- **Security:** Passwords are hashed with bcrypt before storage

## Running with Docker

### Prerequisites
- Docker Desktop installed and running

### Option 1: Docker Compose (Recommended)

```bash
# Build and start
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

### Option 2: Docker CLI

```bash
# Build the image
docker build -t codeforge-app .

# Run the container
docker run -d -p 3000:3000 -p 3001:3001 --name codeforge-container codeforge-app

# View logs
docker logs -f codeforge-container

# Stop
docker stop codeforge-container
docker rm codeforge-container
```

### Access the Application
- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:3001](http://localhost:3001)

### Port Mappings
- `3000:3000` - React frontend served via Webpack dev server
- `3001:3001` - Express backend API


## Technologies

**Frontend:** React 18, React Router v6, Tailwind CSS
**Backend:** Node.js, Express, MongoDB Atlas, JWT, Multer, bcrypt

## Project Structure

IMY-220-Project/
├── backend/
│   ├── server.js              # Express server & API routes
│   └── package.json
├── frontend/
│   └── src/
│       ├── components/        # React components
│       ├── pages/             # Page components
│       ├── services/api.js    # API client
│       └── styles/            # Tailwind CSS
├── public/uploads/            # File storage
│   ├── profile-pictures/
│   └── project-files/
├── Dockerfile
├── docker-compose.yml
└── package.json

**Dillon Koekemoer** | u23537052 | University of Pretoria
