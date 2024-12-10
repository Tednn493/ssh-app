# Shared Shopping Basket App

A prototype shopping application that enables multiple users to collaborate on shared shopping baskets. Users can create basket codes, join existing baskets, and manage their items while tracking both individual and total basket costs.

## Features

- Generate and share basket codes for collaborative shopping
- Join existing shopping baskets using codes
- Track individual user spending within shared baskets
- View total basket costs
- User-specific item management (users can only modify their own items)
- Regular polling to keep basket data updated

## Project Structure

```
├── back-end/
│   ├── models.py      # Database models and initialization
│   ├── server.py      # Main server application
│   └── requirements.txt
└── front-end/
    ├── components/
    │   ├── BasketScreen.js
    │   ├── HomeScreen.js
    │   ├── ProductSearch.js
    │   └── StyledComponents.js
    ├── assets/        # Application images
    ├── api_url.example.js
    ├── api.js
    ├── App.js
    └── app.json
```

## Prerequisites

- Python 3.x
- Node.js v18.17.1 or higher
- Expo CLI v0.22.0
- npm (comes with Node.js)

## Setup

### Backend Setup

1. Navigate to the backend directory:

```bash
cd back-end
```

2. Install Python dependencies:

```bash
pip install -r requirements.txt
```

3. Start the server:

```bash
python server.py
```

The server's IP address will be printed to the terminal once running.

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd front-end
```

2. Install npm dependencies:

```bash
npm install
```

3. Configure the API URL:

```bash
cp api_url.example.js api_url.js
```

Edit `api_url.js` to set your backend server's IP address.

4. Start the Expo development server:

```bash
npx expo start
```

## Development

### Backend

The backend uses:

- Flask for the web server
- SQLAlchemy for database management

### Frontend

The frontend is built with:

- React Native
- Expo
- HTTP polling for data updates

## Configuration

- Backend: The server will print its IP address on startup
- Frontend: Update `api_url.js` with your backend server's IP address before running the application

## Version Check Commands

To verify your installed versions:

```bash
node --version    # Should be v18.17.1 or higher
npx expo --version    # Should be 0.22.0
```
