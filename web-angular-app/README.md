# Fric Payment Solutions - Frontend Technical Test

## Prerequisites

- Node.js 20+
- npm or yarn

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fric-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the mock API server**
4. navigate to api-mock
   ```bash
   npm run dev
   ```
   Server runs on http://localhost:3000

4. **Start the Angular application** (in a new terminal)
   ```bash
   npm start
   ```
   Application runs on http://localhost:4200

## Available Scripts

- `npm start` - Start the Angular development server
- `npm run dev` - Start the mock API server
- `npm run build` - Build the application for production
- `npm test` - Run unit tests

## Test Accounts

Use these credentials to login:

- **Username:** alice
- **Password:** password123

- **Username:** bob
- **Password:** password456


## API Endpoints

- `POST /auth/login` - User authentication
- `GET /accounts` - Get user accounts
- `GET /accounts/:id/transactions` - Get account transactions
- `POST /transfer` - Initiate money transfer

All endpoints except login require authentication.
