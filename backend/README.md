
# 🌱 AgriSmart Backend API

The **Backend API** is the backend service for the **AgriSmart** platform. It provides APIs for farmer authentication, agricultural assistance, irrigation management, buyer needs, SMS notifications, and database operations.

The backend is built using **Node.js, Express.js, PostgreSQL, and JWT authentication**.

---

## 🚀 Features

- 🔐 JWT-based user authentication
- 👤 User signup, signin, signout, and session management
- 🗄️ PostgreSQL database integration
- 🤖 Agricultural AI assistant
- 💧 Irrigation management
- 🛒 Buyer needs management
- 📱 SMS notification service
- 🛡️ Protected API routes
- 🌐 RESTful API architecture
- 🔄 Supabase-independent backend
- ❤️ Health check endpoint
- 🧪 End-to-end API testing

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js | JavaScript runtime |
| Express.js | Backend framework |
| PostgreSQL | Relational database |
| JWT | Authentication |
| bcrypt | Password hashing |
| dotenv | Environment variables |
| CORS | Frontend-backend communication |

---

## 📁 Project Structure

```text
backend/
│
├── middleware/
│   └── auth.js
│
├── routes/
│   ├── assistant.js
│   ├── auth.js
│   ├── buyerNeeds.js
│   └── irrigation.js
│
├── services/
│   └── smsService.js
│
├── .gitignore
├── database-schema.sql
├── database.js
├── e2e_ps.ps1
├── e2e_test.js
├── package.json
├── package-lock.json
├── README.md
└── server.js
````

### Folder Description

* **middleware/** - Contains middleware used by the Express application.
* **routes/** - Contains API route definitions.
* **services/** - Contains reusable backend services such as SMS functionality.
* **database.js** - Handles the PostgreSQL database connection.
* **database-schema.sql** - Contains the PostgreSQL database schema.
* **server.js** - Main entry point of the backend server.
* **ASSISTANT.md** - Documentation related to the agricultural assistant.
* **e2e_test.js** - End-to-end API testing.
* **e2e_ps.ps1** - PowerShell testing script.

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Aaiyub-shaikh/svitxhackfest
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

---

## 🗄️ Database Setup

The backend uses **PostgreSQL** as its database.

Create the database:

```sql
CREATE DATABASE smart_farm;
```

Run the database schema:

```bash
psql -U postgres -d smart_farm -f database-schema.sql
```

Make sure PostgreSQL is running before starting the backend.

---

## 🔐 Environment Variables

Create a `.env` file inside the `backend` directory.

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=smart_farm

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3001
NODE_ENV=development

# Frontend Configuration
FRONTEND_URL=http://localhost:8080

# SMS setup
MSG91_AUTH_KEY=your_auth_key
MSG91_SENDER_ID=your_id
MSG91_TEMPLATE_ID=your_template_id
```

---

## ▶️ Running the Server

Start the backend:

```bash
npm start
```

For development with automatic restart:

```bash
npm run dev
```

The server will run on:

```text
http://localhost:3001
```

---

## ❤️ Health Check

Use the following endpoint to check whether the backend is running:

```http
GET /health
```

Example:

```text
http://localhost:3001/health
```

---

## 🔐 Authentication API

The backend uses **JWT authentication** instead of Supabase Authentication.

### Signup

```http
POST /api/auth/signup
```

### Signin

```http
POST /api/auth/signin
```

### Signout

```http
POST /api/auth/signout
```

### Current Session

```http
GET /api/auth/session
```

Protected endpoints require a JWT token:

```http
Authorization: Bearer <token>
```

Passwords are securely hashed using **bcrypt** before being stored in the database.

---

## 🤖 Agricultural Assistant API

The agricultural assistant provides backend support for AI-powered farmer assistance.

Base route:

```text
/api/assistant
```

It can be used for features such as:

* Agricultural questions
* Crop-related assistance
* Farming recommendations
* Farmer guidance
* AI-powered agricultural support


---

## 💧 Irrigation API

The irrigation module provides APIs for managing irrigation-related functionality.

Base route:

```text
/api/irrigation
```

The module can support:

* Irrigation information
* Irrigation scheduling
* Water management
* Farm irrigation operations

---

## 🛒 Buyer Needs API

The buyer needs module manages agricultural requirements and buyer-related information.

Base route:

```text
/api/buyer-needs
```

It can support:

* Creating buyer requirements
* Viewing buyer requirements
* Updating requirements
* Managing agricultural demand

---

## 📱 SMS Service

The SMS service is located at:

```text
services/smsService.js
```

It can be used for sending important notifications to farmers, such as:

* Irrigation alerts
* Agricultural notifications
* Important farm updates
* System notifications

SMS credentials should be stored securely in the `.env` file.

---

## 🔄 Migration from Supabase

This backend was created to replace the previous Supabase-based architecture with a custom Express and PostgreSQL backend.

### Previous Architecture

```text
Frontend
    │
    ▼
Supabase
    │
    ├── Authentication
    ├── Database
    └── APIs
```

### Current Architecture

```text
Frontend
    │
    ▼
Express.js Backend
    │
    ├── JWT Authentication
    ├── REST APIs
    ├── Services
    └── Business Logic
            │
            ▼
        PostgreSQL
```

### Main Changes

| Feature           | Previous            | Current                   |
| ----------------- | ------------------- | ------------------------- |
| Authentication    | Supabase Auth       | JWT                       |
| Database          | Supabase PostgreSQL | PostgreSQL                |
| API               | Supabase Client     | Express REST API          |
| Password Security | Supabase            | bcrypt                    |
| Backend           | Supabase            | Express.js                |
| Database Control  | Managed             | Self-managed              |
| Real-time         | Supabase            | Not currently implemented |

---

## 🧪 Testing

The project includes end-to-end testing files:

```text
e2e_test.js
e2e_ps.ps1
```

The API can also be tested using tools such as:

* Postman
* Thunder Client
* cURL

Example health check:

```bash
curl http://localhost:3001/health
```

---

## 🔒 Security

Before deploying the backend to production:

* Use a strong and unique `JWT_SECRET`
* Never commit `.env`
* Never expose database credentials
* Use HTTPS
* Configure CORS properly
* Validate incoming requests
* Add rate limiting
* Use secure PostgreSQL credentials
* Keep dependencies updated
* Avoid exposing sensitive error information

---

## 🚀 Future Improvements

Planned improvements include:

* Role-based access control
* Farmer and administrator roles
* Refresh token authentication
* Password reset
* Email/phone verification
* API rate limiting
* Swagger/OpenAPI documentation
* Real-time IoT data
* Weather API integration
* Crop disease detection
* AI-based crop recommendations
* Advanced irrigation automation
* Farmer analytics
* Notification management
* Docker deployment
* CI/CD integration

---

## 🌱 About AgriSmart

**AgriSmart** is an agricultural technology platform that combines **AI, IoT, and modern web technologies** to provide farmers with useful agricultural services and information.

The platform aims to help farmers with:

* 🌾 Agricultural assistance
* 🤖 AI-powered recommendations
* 💧 Smart irrigation
* 📊 Farm data management
* 📱 Notifications and alerts
* 🛒 Buyer requirements
* 🌱 Crop and disease monitoring
* 🗣️ Localized farmer assistance

---

## 📌 Project Status

**🚧 Active Development**

The backend is currently under active development, with additional AI, IoT, irrigation, notification, and agricultural features being integrated.

---

## 📄 License

This project is developed for educational, research, and project purposes.

