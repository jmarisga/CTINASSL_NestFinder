# NestFinder - Real Estate Platform

A modern, full-stack MERN (MongoDB, Express, React, Node.js) real estate platform for browsing and managing properties in Laguna City, Philippines.

##  Features

### User Features

- Browse property listings (Apartments, Houses, Villa Houses)
- Filter properties by type and search
- User authentication (Register/Login)
- Schedule property visits
- View property details with images and descriptions

### Admin Features

- Secure admin dashboard
- Manage properties (Create, Read, Update, Delete)
- Manage users and roles
- View and manage property visit schedules
- Dashboard statistics

## Tech Stack

**Backend:**

- Node.js + Express API
- MongoDB + Mongoose for data persistence
- JWT authentication with role-based access control
- Security: Helmet, CORS, bcrypt, express-rate-limit

**Frontend:**

- HTML5, CSS3, JavaScript (jQuery)
- Bootstrap 5 for responsive design
- Modal-based authentication
- Dynamic property rendering

## Installation

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas cloud)
- npm or yarn

### Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone https://github.com/jmarisga/CTINASSL_NestFinder.git
   cd CTINASSL_NestFinder
   ```

2. **Backend Setup:**

   ```bash
   cd backend
   npm install
   ```

3. **Create environment file:**

   ```bash
   # Copy the example file
   cp .env.example .env
   
   # Edit .env with your configuration
   # Windows: notepad .env
   # macOS/Linux: nano .env
   ```

4. **Configure MongoDB:**
   - For local MongoDB: Use `mongodb://127.0.0.1:27017/nestfinder`
   - For MongoDB Atlas: Use your connection string

5. **Start MongoDB** (if running locally):
   - **Windows:** Start MongoDB service from Services panel
   - **macOS:** `brew services start mongodb-community`
   - **Linux:** `sudo systemctl start mongod`

6. **Create Admin User:**

   ```bash
   node scripts/setup-admin.js
   ```

7. **Start the Backend Server:**

   ```bash
   npm run dev
   # or for production: npm start
   ```
  
   Server will run on http://localhost:5000

8. **Frontend Setup:**
   - Open the `frontend` folder
   - Serve using any web server:
     - **VS Code:** Use Live Server extension
     - **Node.js:** `npx serve frontend`
     - **Python:** `cd frontend && python -m http.server 8080`

9. **Access the Application:**

   - **User Site:** http://localhost:8080 (or your server port)
   - **Admin Panel:** http://localhost:8080/admin/admin-login.html
   - **API:** http://localhost:5000/api

## 📝 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Properties (Public)

- `GET /api/properties` - Get all properties
- `GET /api/properties/:id` - Get single property

### Visits (Authenticated)

- `POST /api/visits` - Schedule a visit
- `GET /api/visits` - Get user's visits

### Admin (Admin Only)

- `POST /api/admin/login` - Admin login
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/users` - Manage users
- `GET /api/admin/properties` - Manage properties
- `GET /api/admin/visits` - Manage visits

## Security Features

- Password hashing with bcrypt (12 rounds)
- JWT tokens with 2h expiry (8h for admin)
- Rate limiting (100 req/15min global, 50 req/15min auth)
- Helmet security headers
- CORS protection
- Input validation
- Role-based access control

## Deployment

For production deployment:

1. Set environment variables on your hosting platform
2. Use `NODE_ENV=production`
3. Configure HTTPS/SSL
4. Use a process manager (PM2)
5. Set up MongoDB Atlas for database
6. Configure CORS for your domain

## 📄 License

This project is part of CTINASSL coursework.

## 👥 Authors

- Jersey Marisga (@jmarisga)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

For detailed backend documentation, see [backend/README.md](backend/README.md)
