# Backend Express.js Project with MongoDB Authentication

This is an Express.js backend project with MongoDB integration and JWT-based authentication system.

## Features

- User registration and login
- JWT access tokens and refresh tokens
- Password hashing with bcrypt
- MongoDB integration with Mongoose
- Protected routes with authentication middleware
- CORS enabled
- Environment variable configuration

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```
MONGODB_URI=mongodb://localhost:27017/backend_auth
JWT_SECRET=your_jwt_secret_key_here
JWT_REFRESH_SECRET=your_refresh_token_secret_key_here
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
PORT=3000
```

3. Make sure MongoDB is running on your system.

### Run the server

```bash
npm start
```

The server will start on http://localhost:3000

## API Endpoints

### Authentication Routes

- `POST /api/auth/register` - Register a new user
  - Body: `{ "username", "email", "password" }`
  
- `POST /api/auth/login` - Login user
  - Body: `{ "email", "password" }`
  
- `POST /api/auth/refresh-token` - Refresh access token
  - Body: `{ "refreshToken" }`
  
- `POST /api/auth/logout` - Logout user (requires auth)
  - Header: `Authorization: Bearer <access_token>`
  - Body: `{ "refreshToken" }`
  
- `GET /api/auth/profile` - Get user profile (requires auth)
  - Header: `Authorization: Bearer <access_token>`

## Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── middleware/
│   └── auth.js              # Authentication middleware
├── models/
│   └── User.js              # User model schema
├── routes/
│   └── auth.js              # Authentication routes
├── utils/
│   └── tokens.js            # JWT token utilities
├── .env                     # Environment variables
├── index.js                 # Main server file
└── package.json             # Dependencies and scripts
```

## Development

1. Make sure MongoDB is running
2. Update the `.env` file with your configuration
3. Run `npm start` to start the development server
4. Use tools like Postman or curl to test the API endpoints

## Security Features

- Passwords are hashed using bcrypt
- JWT tokens with expiration
- Refresh token rotation
- Protected routes with middleware
- Input validation
