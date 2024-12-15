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

### User Routes
- `GET /api/users` - Get user information
- `POST /api/users` - Register new user

### Code Snippet Routes
- `GET /api/code-snippets` - Get all snippets
- `POST /api/code-snippets` - Create new snippet
- `GET /api/code-snippets/:id` - Get snippet by ID
- `PUT /api/code-snippets/:id` - Update snippet
- `DELETE /api/code-snippets/:id` - Delete snippet

### Challenge Routes
- `GET /api/challenges` - Get all challenges
- `GET /api/challenges/:id` - Get challenge details
- `POST /api/challenges/:id/solutions` - Submit solution

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
