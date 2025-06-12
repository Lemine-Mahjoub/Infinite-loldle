# Loldle Backend API

This is the backend API for the Loldle application with JWT-based authentication.

## Features

- **JWT Authentication** with 7-day token expiration
- **User Registration & Login** with password hashing (bcrypt)
- **Protected Routes** with authentication middleware
- **SQLite Database** with Prisma ORM
- **RESTful API** endpoints

## Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Setup environment variables:**
   Create a `.env` file in the backend directory:

   ```env
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   PORT=3000
   FRONTEND_URL="http://localhost:5173"
   ```

3. **Setup database:**

   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

4. **Start the server:**
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication Routes (`/auth`)

#### POST `/auth/register`

Register a new user.

**Request body:**

```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Response:**

```json
{
  "message": "User created successfully",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "username": "user123",
    "email": "user@example.com",
    "score": 0,
    "champ": "Aatrox"
  }
}
```

#### POST `/auth/login`

Login with username/email and password.

**Request body:**

```json
{
  "username": "string", // Can be username or email
  "password": "string"
}
```

**Response:**

```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "username": "user123",
    "email": "user@example.com",
    "score": 100,
    "champ": "Aatrox"
  }
}
```

#### GET `/auth/verify`

Verify if a token is still valid.

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "valid": true,
  "user": {
    "id": 1,
    "username": "user123",
    "email": "user@example.com",
    "score": 100,
    "champ": "Aatrox"
  }
}
```

#### POST `/auth/refresh`

Refresh an existing token (extends expiration by 7 days).

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "message": "Token refreshed",
  "token": "new_jwt_token_here"
}
```

### User Routes (`/users`) - All Protected

All user routes require authentication via `Authorization: Bearer <token>` header.

#### GET `/users`

Get leaderboard (all users ordered by score).

**Response:**

```json
[
  {
    "id": 1,
    "username": "user1",
    "score": 200,
    "champ": "Aatrox"
  },
  {
    "id": 2,
    "username": "user2",
    "score": 150,
    "champ": "Ahri"
  }
]
```

#### GET `/users/me`

Get current user's profile.

**Response:**

```json
{
  "id": 1,
  "username": "user123",
  "email": "user@example.com",
  "score": 100,
  "champ": "Aatrox",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### POST `/users/check`

Check if a champion guess is correct.

**Request body:**

```json
{
  "champ": {
    "name": "Aatrox"
  },
  "points": 10
}
```

**Response:**

```json
{
  "message": "Correct answer!",
  "score": 110,
  "correct": true
}
```

#### PUT `/users/score`

Update user's score.

**Request body:**

```json
{
  "score": 150
}
```

**Response:**

```json
{
  "message": "Score updated successfully",
  "score": 150
}
```

#### POST `/users/new-champion`

Assign a new random champion to the user.

**Response:**

```json
{
  "message": "New champion assigned",
  "champ": "Ahri"
}
```

## Database Schema

```prisma
model User {
  id        Int      @id @default(autoincrement())
  username  String   @unique
  email     String   @unique
  password  String
  score     Int      @default(0)
  champ     String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## JWT Token

- **Expiration:** 7 days
- **Payload includes:** userId, username, email
- **Secret:** Configurable via `JWT_SECRET` environment variable

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (duplicate username/email)
- `500` - Internal Server Error

## Development

- **Development server:** `npm run dev`
- **Build:** `npm run build`
- **Production:** `npm start`
- **Database reset:** `npx prisma migrate reset`
- **View database:** `npx prisma studio`
