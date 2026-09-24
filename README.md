# Gadgets4U Electronics Rental

Gadgets4U is an electronics rental website with a static responsive frontend and a Node.js + Express + MongoDB backend.

## Technology Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Database: MongoDB / MongoDB Atlas
- Authentication: JWT
- Password security: bcryptjs
- API logging: Morgan

## Project Structure

```text
electronics-rental-main/
├── backend/
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Booking.js
│   │   └── Contact.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── user.js
│   │   ├── bookings.js
│   │   └── contact.js
│   ├── .env.example
│   ├── package.json
│   ├── seed.js
│   └── server.js
├── public/
│   ├── index.html
│   ├── products.html
│   ├── login.html
│   ├── register.html
│   ├── rental-booking.html
│   ├── profile.html
│   └── ...
└── README.md
```

## MongoDB Setup

### Option 1: Local MongoDB

Install MongoDB Community Server and make sure MongoDB is running.

Use:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/gadgets4u
JWT_SECRET=replace_with_a_long_random_secret
PORT=5000
```

### Option 2: MongoDB Atlas

1. Create a MongoDB Atlas cluster.
2. Create a database user.
3. Add your IP address under Network Access.
4. Copy the MongoDB connection string.
5. Create `backend/.env`.
6. Put the Atlas URI in `MONGODB_URI`.

Example:

```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/gadgets4u?retryWrites=true&w=majority
JWT_SECRET=replace_with_a_long_random_secret
PORT=5000
```

Do not commit `.env` to GitHub.

## Install Backend

Open a terminal inside the `backend` folder:

```bash
npm install
```

## Seed the Products

Run:

```bash
npm run seed
```

This inserts all 17 Gadgets4U products into MongoDB and creates an admin account.

Admin credentials created by the seed script:

```text
Email: admin@gadgets4u.com
Password: Admin@123
```

Change this password before using the application for a real deployment.

## Start the Application

Development:

```bash
npm run dev
```

Normal start:

```bash
npm start
```

Open:

```text
http://localhost:5000
```

The Express server serves the frontend from the `public` folder, so you do not need a separate frontend server.

## Backend API

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Products

```text
GET    /api/products
GET    /api/products/:id
POST   /api/products          Admin
PUT    /api/products/:id     Admin
DELETE /api/products/:id     Admin
```

### Cart

```text
GET    /api/user/cart
POST   /api/user/cart
PUT    /api/user/cart/:productId
DELETE /api/user/cart/:productId
```

### Wishlist

```text
GET    /api/user/wishlist
POST   /api/user/wishlist/:productId
DELETE /api/user/wishlist/:productId
```

### Bookings

```text
POST  /api/bookings
GET   /api/bookings/mine
PATCH /api/bookings/:id/cancel

GET   /api/bookings             Admin
PATCH /api/bookings/:id/status  Admin
```

### Contact

```text
POST  /api/contact
GET   /api/contact              Admin
PATCH /api/contact/:id/status   Admin
```

### Health Check

```text
GET /api/health
```

## What is Stored in MongoDB?

### users

Stores:
- Name
- Email
- Phone
- Hashed password
- Role
- Cart
- Wishlist

### products

Stores:
- Product name
- Image
- Description
- Weekly rental price
- Security deposit
- Category
- Stock
- Active status

### bookings

Stores:
- Booking reference
- User
- Product
- Customer details
- Start date
- Duration
- Delivery address
- Rental price
- Security deposit
- Booking status

### contacts

Stores:
- Name
- Email
- Subject
- Message
- Support status

## Important

The frontend now uses the backend API whenever a user is logged in. Guest cart/wishlist data can still be held locally until login.

Passwords are never stored as plain text. They are hashed with bcrypt.

JWT tokens are stored in browser localStorage for this student project. For a production deployment, use secure, HTTP-only cookies and HTTPS.

## Recommended Testing Flow

1. Start MongoDB or configure MongoDB Atlas.
2. Run `npm install`.
3. Create `backend/.env`.
4. Run `npm run seed`.
5. Run `npm start`.
6. Open `http://localhost:5000`.
7. Register a new customer account.
8. Login.
9. Add products to cart.
10. Add products to wishlist.
11. Complete a rental booking.
12. Open Profile and verify rental history.
13. Submit the Contact form.
14. Check the MongoDB collections to verify that data is being stored.

## API Authentication

Protected requests require:

```text
Authorization: Bearer <JWT_TOKEN>
```

The frontend automatically attaches this token after login.


### Backend setup

From the `backend` folder:

```bash
npm install
```

Create `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/gadgets4u
JWT_SECRET=change_this_secret
```

Then seed the database:

```bash
npm run seed
```

Start the application:

```bash
npm start
```

Open `http://localhost:5000`.

The seed command creates the 17 demo products and an admin account:
`admin@gadgets4u.com` / `Admin@123`.
