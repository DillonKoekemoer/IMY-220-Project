Dillon Koekemoer u23537052

IMY 220 website project

Deliverable 0 
    This was to create the wireframe for the website we are to create.
    Website details
        Name: CodeForge
        Theme : Blacksmithing, orange, fire, ect
        Features: Upload and interact with code and other developers and friends


Deliverable 1
    Create the base structure and files for the webpage
    
    - I have created the project baed on the specs provided, making use of 4 main pages and many components that follow.
    - I have also done a significant amount of css so that one can see what it might look like for the next deliverable 

How to run project

# locally #

1. npm install
2. npm start
3. http://localhost:3000

# Docker Commands #
1. build it
    docker build -t codeforge.

2. Run the container
    docker run --rm -p 3000:3000 codeforge

3. http://localhost:3000

link to github - https://github.com/DillonKoekemoer/IMY-220-Project

Deliverable 2

    This deliverable was about connecting the backend to a MongoDB database to store and pull data instead
    of using dummy data like the previous deliverable. Below is the provided information for connection to the database
    and how it was handled.

# MongoDB info #
    Database name: Project
    Collection name: Users, Friends, Posts, Projects, 
    Connection string: mongodb+srv://test-user:test-password@imy220.on7r59y.mongodb.net/?retryWrites=true&w=majority&appName=IMY220';

    TestLoginEmail = test@gmail.com
    TestPassword = Test-password123


