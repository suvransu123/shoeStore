# SoleStyle - Premium Shoe Store

A full-stack e-commerce application for a shoe store, featuring a modern UI, admin product management, and a robust cart system.

## Key Features

- **Product Management**: Admins can add, edit, and delete products with image uploads.
*   **Cloudinary Integration**: Automatic image optimization and storage via Cloudinary.
*   **Admin Authentication**: Secure login using credentials stored in `.env` (no database record required for master admin).
*   **Shopping Cart**: Full cart functionality with quantity management and persistency.
*   **INR Pricing**: All prices are displayed in Indian Rupees (₹) and rounded to the nearest whole number.
*   **Modern UI**: Responsive design with a clean aesthetic and smooth interactions.

## 🛠️ Technology Stack

### Backend
- **Node.js & Express**: Fast and minimalist web framework.
- **MongoDB & Mongoose**: NoSQL database for flexible data storage.
- **JWT & Cookies**: Secure authentication flow.
- **Multer & Cloudinary**: For handling image file uploads.
- **Dotenv**: Environment variable management.

### Frontend
- **React**: Modern component-based UI library.
- **Vite**: Ultra-fast build tool and dev server.
- **Axios**: For making API requests to the backend.
- **React Router**: For seamless client-side navigation.
- **React Hot Toast**: Beautiful notification alerts.

## Setup & Installation

### 1. Prerequisites
- Node.js installed on your machine.
- A MongoDB account and database URI.
- A Cloudinary account for image storage.

### 2. Backend Configuration
Navigate to the `backend` folder and create a `.env` file:
```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=development

# Master Admin Credentials
ADMIN_EMAIL=admin123@gmail.com
ADMIN_PASSWORD=admin123

# Cloudinary Credentials
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Frontend Configuration
The frontend is configured to proxy requests to `http://localhost:5001/api`. No additional env setup is required for local dev.

##  How to Run

### Step 1: Install Dependencies
Open two terminals, one for each directory:

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### Step 2: Start the Servers

**Backend Terminal:**
```bash
npm run dev
```

**Frontend Terminal:**
```bash
npm run dev
```

### Step 3: Access the App
Open your browser and navigate to the local URL provided by Vite (usually `http://localhost:5173`).

---

##  Backend Dependencies
- `bcryptjs`: Password hashing.
- `cloudinary`: Image storage API.
- `cookie-parser`: Handling browser cookies.
- `cors`: Cross-Origin Resource Sharing.
- `dotenv`: Environment variables.
- `express`: Web framework.
- `jsonwebtoken`: Authentication tokens.
- `mongoose`: MongoDB object modeling.
- `multer`: File upload middleware.

##  Frontend Dependencies
- `axios`: API client.
- `react`: UI library.
- `react-dom`: Browser rendering.
- `react-hot-toast`: Notifications.
- `react-router-dom`: Routing.
