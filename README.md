# TechCenter

TechCenter is a modern fullstack e-commerce platform focused on the Mozambican market, specialized in selling premium devices such as iPhones, Samsung smartphones, MacBooks and AirPods.

The platform was built with performance, scalability and modern user experience in mind, featuring authentication, password recovery, live product search, dynamic product variations, responsive UI and secure backend architecture.

---

# 🌍 About The Project

TechCenter was designed to provide a premium online shopping experience for customers in Mozambique.

Users can:
- Browse premium devices
- Search products instantly
- View product variations
- Create accounts
- Login securely
- Recover forgotten passwords
- Explore products by brand and series

The project follows a modern fullstack architecture using Next.js on the frontend and Fastify on the backend.

---

# 🚀 Technologies Used

## Frontend

- Next.js
- React
- Tailwind CSS
- TypeScript
- Lucide React

## Backend

- Node.js
- Fastify
- MySQL
- JWT Authentication
- bcrypt
- Zod
- Nodemailer

---

# ✨ Features

## 🔐 Authentication System

- User registration
- User login
- JWT authentication
- Password hashing with bcrypt
- Protected routes
- Account validation

---

## 📧 Password Recovery

- Forgot password workflow
- Email verification
- 6-digit recovery code
- Password reset system

---

## 🛒 Product System

- Brand-based organization
- Product variations
- Storage selection
- Color selection
- Dynamic pricing
- Product detail pages
- Responsive product cards

---

## 🔎 Search System

- Live search suggestions
- Search autocomplete
- Debounced requests
- Search results page
- Optimized product fetching

---

## 🎨 User Experience

- Fully responsive design
- Mobile navigation menu
- Interactive UI
- Smooth transitions
- Loading states
- Modern product showcase

---

# 🛠️ Project Architecture

```bash
TechCenter/
│
├── backend/
│   ├── app.js
│   ├── login.js
│   ├── server.js
│   ├── forgotpassword.js
│   ├── SearchProducts.js
│   ├── carrinho.js
│   ├── mail.js
│   └── .env
│
├── frontend/
│   ├── app/
│   │   ├── components/
│   │   ├── iphones/
│   │   ├── samsungs/
│   │   ├── macbooks/
│   │   ├── airpods/
│   │   ├── login/
│   │   ├── signup/
│   │   ├── forgot-password/
│   │   ├── search/
│   │   ├── globals.css
│   │   └── produtos/
│   │
│   ├── public/
│   └── .env.local
│
└── README.md
```

---

# 🔌 API Routes

## Authentication

```http
POST /signup
POST /login
POST /forgot-password
POST /reset-password
```

## Products

```http
GET /products
GET /products/brand/:brand
GET /products/:id
```

---

# 🔐 Authentication

TechCenter uses JWT authentication to secure private routes and user sessions.

Example token generation:

```js
const token = fastify.jwt.sign(
  { id: user.id, name: user.name },
  { expiresIn: '1d' }
);
```

Passwords are encrypted using bcrypt:

```js
const hash = await bcrypt.hash(password, 10);
```

---

# 📧 Password Recovery Flow

The password recovery system works in 3 steps:

1. User enters email  
2. Verification code is sent  
3. User resets password  

Example email sending:

```js
await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: email,
  subject: "FORGOT YOUR PASSWORD?",
  text: `Your code is: ${code}`
});
```

---

# 🔎 Product Search

The platform includes a real-time search system with debounce optimization and autocomplete suggestions.

Example route:

```http
GET /api/products?search=iphone
```

Search optimization using debounce:

```js
setTimeout(() => fetchProducts(query.trim()), 350);
```

AbortController is also used to cancel duplicated requests.

---

# 🛒 Product Variations

Each product supports:

- Multiple colors
- Multiple storage options
- Different prices
- Dynamic images

Example variation object:

```json
{
  "product_id": 1,
  "color": "Black",
  "storage": "256GB",
  "price": 95000
}
```

---

# 🗄️ Database

The project uses MySQL for data persistence.

## Main Tables

| Table | Description |
|-------|-------------|
| `login` | Stores user credentials and account info |
| `brands` | Product brands (Apple, Samsung, etc.) |
| `products` | Main product catalog |
| `products_variations` | Color, storage, and price variants per product |

---

# ⚙️ Environment Variables

## Backend `.env`

```env
PORT=3333

DB_HOST=localhost
DB_USER=root
DB_PASS=yourpassword
DB_NAME=techcenter

JWT_SECRET=your_secret_key

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

## Frontend `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:3333
```

---

# 📦 Installation

## Clone Repository

```bash
git clone https://github.com/AshleyGotora/ecommerce-TechCenter.git
```

---

## Backend Setup

```bash
cd backend
npm install
npm run dev
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

# 📱 Product Categories

- iPhones
- Samsung Devices
- MacBooks
- AirPods

---

# 🎨 Frontend Highlights

- Next.js App Router
- Dynamic routes
- Client and Server Components
- Responsive layouts
- Interactive product variations
- Search autocomplete
- Mobile optimized navigation

---

# 🔒 Security Features

- Password hashing
- JWT authentication
- Schema validation with Zod
- Protected purchase actions
- Email verification system

---

# 🌐 Deployment

Deployment coming soon.

## Planned Platforms
- **Frontend** → Vercel
- **Backend** → Railway or Render

---

# 🚧 Project Status

The project is still under development.

## Planned Features

- Shopping cart system
- Order management
- Admin dashboard
- M-Pesa integration
- Visa/Mastercard payments
- Google Authentication
- Product stock system
- Wishlist
- Product reviews
- Order history

---

# ⚠️ Future Improvements

## Backend

- Admin role protection
- Better route organization
- Refresh tokens
- Rate limiting
- Reset code expiration
- Stock management
- Order system
- Payment gateway integration

## Frontend

- Dark mode
- Skeleton loaders
- Better SEO
- Animations
- Pagination
- State management

## Infrastructure

- Docker support
- VPS deployment
- Redis caching
- CI/CD pipelines
- Cloud image storage

---

# 📄 License

This project is licensed under the MIT License.

---

# 👩‍💻 Developer

Developed by [Ashley Gotora](https://github.com/AshleyGotora).

---

# 🌟 TechCenter

Premium technology for the Mozambican market.