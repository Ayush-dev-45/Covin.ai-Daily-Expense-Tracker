# Daily Expenses Sharing Application

A real-time expense sharing application built with Node.js, Express, MongoDB, and Socket.IO. This application allows users to split expenses among friends and keep track of balances.

## Features

- User authentication with JWT
- Real-time expense notifications using Socket.IO
- Expense sharing with multiple split types (equal, exact, percentage)
- Balance sheet generation and PDF export
- Real-time updates for shared expenses

## API Documentation

### Authentication Endpoints

#### Register User
- **URL**: `/api/users/register`
- **Method**: `POST`
- **Body**:
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "mobileNumber": "1234567890",
  "password": "password123"
}
```
- **Success Response**: 
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "email": "user@example.com",
      "name": "John Doe",
      "mobileNumber": "1234567890"
    },
    "token": "jwt_token_here"
  }
}
```

#### Login User
- **URL**: `/api/users/login`
- **Method**: `POST`
- **Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
- **Success Response**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "email": "user@example.com",
      "name": "John Doe"
    },
    "token": "jwt_token_here"
  }
}
```

### Expense Endpoints

#### Add New Expense
- **URL**: `/api/expenses`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer jwt_token_here`
- **Body**:
```json
{
  "description": "Dinner",
  "amount": 100,
  "splitType": "equal",
  "participants": [
    {
      "user": "user_id_1",
      "share": 50
    },
    {
      "user": "user_id_2",
      "share": 50
    }
  ]
}
```
- **Success Response**:
```json
{
  "success": true,
  "message": "Expense added successfully",
  "data": {
    "description": "Dinner",
    "amount": 100,
    "splitType": "equal",
    "participants": [...],
    "paidBy": {
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

#### Get All Expenses
- **URL**: `/api/expenses`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer jwt_token_here`
- **Success Response**:
```json
{
  "success": true,
  "message": "Expenses retrieved successfully",
  "data": [
    {
      "description": "Dinner",
      "amount": 100,
      "splitType": "equal",
      "participants": [...],
      "paidBy": {
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  ]
}
```

### Balance Sheet Endpoints

#### Get Balance Sheet
- **URL**: `/api/balance-sheets`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer jwt_token_here`
- **Success Response**:
```json
{
  "success": true,
  "message": "Balance sheet retrieved successfully",
  "data": {
    "user_id_1": 50,
    "user_id_2": -50
  }
}
```

#### Download Balance Sheet PDF
- **URL**: `/api/balance-sheets/download`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer jwt_token_here`
- **Response**: PDF file download

## Real-time Features

The application uses Socket.IO for real-time updates. Here are the available events:

### Client-side Events
```javascript
// Connect to Socket.IO server
const socket = io('http://localhost:3000');

// Join user's expense room
socket.emit('join-expense-room', userId);

// Listen for expense updates
socket.on('expense-update', (data) => {
  console.log('Expense update:', data);
  // data.type: 'NEW_EXPENSE'
  // data.expense: expense details
});

// Listen for balance updates
socket.on('balance-update', (data) => {
  console.log('Balance update:', data);
  // data.type: 'BALANCE_UPDATED'
  // data.balanceSheet: updated balances
});
```

### Server-side Events
- `connection`: Triggered when a client connects
- `join-expense-room`: Adds user to a room for expense notifications
- `disconnect`: Triggered when a client disconnects
- `expense-update`: Sent when a new expense is added
- `balance-update`: Sent when balance sheet is updated

## Installation and Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```
MONGODB_URI=mongodb://localhost:27017/daily-expenses-app
JWT_SECRET=your_jwt_secret_here
PORT=3000
```

4. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## Error Handling

All endpoints return standardized error responses:
```json
{
  "success": false,
  "message": "Error message here"
}
```

Common HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error