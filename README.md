# CodeFr Online IDE

An online Integrated Development Environment (IDE) for the CodeFr programming language.

## Features

- Write and edit CodeFr code snippets
- Run code in a safe environment using Docker containerization
- Save and manage code snippets
- Participate in coding challenges
- Social features (like, share, comment)

## Prerequisites

- Docker and Docker Compose
- Node.js and npm (if running locally without Docker)
- MongoDB (if running locally without Docker)

## Getting Started

1. Clone the repository
2. Copy `.env.example` to `.env` and update the environment variables
3. Run with Docker:
   ```bash
   docker-compose up
   ```

   Or run locally:
   ```bash
   # Install dependencies
   npm install
   cd client && npm install
   cd ..

   # Run the development server
   npm run dev:full
   ```

4. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Project Structure

```
codefr-online-ide/
├── client/                 # React frontend
├── server/                 # Node.js backend
│   ├── routes/            # API routes
│   └── index.js           # Server entry point
├── docker-compose.yml     # Docker configuration
├── Dockerfile.backend     # Backend Docker configuration
├── Dockerfile.frontend    # Frontend Docker configuration
└── package.json          # Project dependencies
```

## API Documentation

### Authentication
- `POST /api/users/register` - Register a new user
  - Body: `{ username, email, password }`
  - Returns: User object and JWT token

- `POST /api/users/login` - Login user
  - Body: `{ email, password }`
  - Returns: User object and JWT token

- `POST /api/users/forgot-password` - Request password reset
  - Body: `{ email }`
  - Returns: Success message

- `POST /api/users/reset-password/:token` - Reset password using token
  - Body: `{ password }`
  - Returns: Success message

### User Management
- `GET /api/users` - Get authenticated user information
  - Headers: `Authorization: Bearer [token]`
  - Returns: User object

- `PUT /api/users/password` - Change user password
  - Headers: `Authorization: Bearer [token]`
  - Body: `{ currentPassword, newPassword }`
  - Returns: Success message

### Profile Routes
- `GET /api/profiles` - Get user profiles
- `GET /api/profiles/:id` - Get specific profile
- `PUT /api/profiles/:id` - Update profile

### Dashboard Routes
- `GET /api/dashboard` - Get dashboard data
- `GET /api/dashboard/stats` - Get user statistics

### Code Snippets
- `GET /api/code-snippets` - Get all snippets
- `POST /api/code-snippets` - Create new snippet
- `GET /api/code-snippets/:id` - Get snippet by ID
- `PUT /api/code-snippets/:id` - Update snippet
- `DELETE /api/code-snippets/:id` - Delete snippet

### Challenges
- `GET /api/challenges` - Get all challenges
- `GET /api/challenges/:id` - Get challenge details
- `POST /api/challenges` - Create new challenge
- `PUT /api/challenges/:id` - Update challenge
- `DELETE /api/challenges/:id` - Delete challenge

### Solutions
- `POST /api/solutions` - Submit solution
- `GET /api/solutions/:id` - Get solution details
- `GET /api/solutions/challenge/:challengeId` - Get solutions for challenge

### Code Execution
- `POST /api/execution` - Execute code
  - Body: `{ code, language }`
  - Returns: Execution results

### Comments
- `GET /api/comments/:resourceId` - Get comments for resource
- `POST /api/comments` - Add comment
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment


## License

This project is licensed under the MIT License - see the LICENSE file for details.
