# 🌾 Grihinir Bari (গৃহিণীর বাড়ি)

<p align="center">
  <a href="https://grihinirbari.com">
    <img src="public/favicon.ico" alt="Grihinir Bari Logo" width="80" height="80" />
  </a>
</p>

<h3 align="center">100% Pure Cold-Pressed Wooden Ghani Mustard Oil • ১০০% খাঁটি কাঠের ঘানিভাঙা সরিষার তেল</h3>

<p align="center">
  A modern, high-performance e-commerce web platform and administrative dashboard built for <b>Grihinir Bari</b> using Next.js 16, React 19, TypeScript, Tailwind CSS, MongoDB, and Clerk Auth.
</p>

<p align="center">
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=nextdotjs" alt="Next.js"></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React"></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/TypeScript-6.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript"></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS"></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/MongoDB-Mongoose-green?style=for-the-badge&logo=mongodb" alt="MongoDB"></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/Clerk-Auth-6C47FF?style=for-the-badge&logo=clerk" alt="Clerk"></a>
</p>

---

## 📋 Table of Contents

- [🌟 Features](#-features)
  - [🌐 Public Web Portal](#-public-web-portal)
  - [⚙️ Admin Management Dashboard](#%EF%B8%8F-admin-management-dashboard)
- [💻 Tech Stack](#-tech-stack)
- [📂 Project Architecture](#-project-architecture)
- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
  - [Running the Application](#running-the-application)
- [🔑 Environment Variables](#-environment-variables)
- [🛡️ Security & Role-Based Access Control (RBAC)](#%EF%B8%8F-security--role-based-access-control-rbac)
- [📜 Available Scripts](#-available-scripts)
- [📄 License & Authors](#-license--authors)

---

## 🌟 Features

### 🌐 Public Web Portal

- **Authentic E-Commerce Storefront**: Product listings, size/variant selector, cart, checkout with Cash on Delivery (COD).
- **Interactive Bengali Typography & Branding**: Custom Bengali font integration and localization.
- **Recipe & Blog Showcase**: Articles, cooking tips, health benefits of pure cold-pressed mustard oil.
- **Customer Reviews & Ratings**: Product reviews and customer feedback.
- **Fast Search & Coupon System**: Instant search, category filters, and promotional discount codes.
- **Contact & Inquiries**: Direct contact form with email notifications (`Nodemailer` integration).
- **Responsive & Accessible**: Optimized for mobile, tablet, and desktop viewports.

### ⚙️ Admin Management Dashboard

- **Real-Time Analytics & Sales Overview**: Visualizations using `Recharts` and order tracking.
- **Product & Inventory Management**: SKU tracking, stock management, categories, and brands.
- **Order Processing & Invoicing**: Order fulfillment workflow, delivery charges management, and printable receipts.
- **Coupons & Promotions**: Discount code generation and subscriber campaign broadcasting.
- **Media Library Manager**: Centralized asset upload and management using `UploadThing`.
- **User & Permission Control**: Granular permission matrix for managing administrative staff.
- **System Maintenance Toggle**: One-click maintenance mode flag.

---

## 💻 Tech Stack

| Domain                   | Technologies                                                                                                                                                          |
| :----------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Core Framework**       | [Next.js 16](https://nextjs.org/) (App Router), [React 19](https://react.dev/), [TypeScript 6](https://www.typescriptlang.org/)                                       |
| **Styling & UI**         | [Tailwind CSS](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/), [Lucide Icons](https://lucide.dev/), [Framer Motion](https://www.framer.com/motion/) |
| **Database & ORM**       | [MongoDB](https://www.mongodb.com/), [Mongoose](https://mongoosejs.com/)                                                                                              |
| **Authentication**       | [Clerk Auth](https://clerk.com/) (`@clerk/nextjs`)                                                                                                                    |
| **Media & Storage**      | [UploadThing](https://uploadthing.com/)                                                                                                                               |
| **Data Viz & Utilities** | [Recharts](https://recharts.org/)                                                                                                                                     |
| **Email & Services**     | [Nodemailer](https://nodemailer.com/), `Zod` validation                                                                                                               |

---

## 📂 Project Architecture

```
grihinir-bari/
├── app/                      # Next.js App Router Structure
│   ├── (auth)/               # Auth routes (Sign-In, Sign-Up)
│   ├── (root)/               # Main public e-commerce pages (Home, Shop, Blog, Cart, Checkout)
│   ├── api/                  # API endpoints (UploadThing, webhooks, contact, email)
│   ├── dashboard/            # Administrative dashboard pages
│   ├── globals.css           # Global Tailwind CSS styles
│   └── layout.tsx            # Master layout wrapper
├── components/
│   ├── shared/               # Reusable shared components (Header, Footer, ProductCard, MediaLibrary)
│   └── ui/                   # Radix UI primitives & design tokens
├── constants/                # Navigation routes, static links & RBAC permissions
├── hooks/                    # Custom React hooks (useCart, useWishlist)
├── lib/                      # Database connectors (Mongoose), actions, and utility helpers
├── public/                   # Static public assets, fonts, icons, and logos
├── types/                    # TypeScript interfaces & type definitions
├── next.config.ts            # Next.js build configuration
├── tailwind.config.ts        # Tailwind CSS theme extension
└── package.json              # Project dependencies & npm scripts
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:

- **Node.js**: `v18.x` or higher
- **npm**: `v9.x` or higher (or `pnpm` / `yarn`)
- **MongoDB Database**: Local MongoDB instance or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster.

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/ninazmul/grihinir-bari.git
   cd grihinir-bari
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

### Environment Configuration

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Populate `.env.local` with your operational API keys and credentials (see [Environment Variables](#-environment-variables) below).

### Running the Application

1. **Start the local development server:**

   ```bash
   npm run dev
   ```

2. **Open the browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the public application.
   Navigate to [http://localhost:3000/dashboard](http://localhost:3000/dashboard) to access the admin portal.

---

## 🔑 Environment Variables

| Variable                            | Description                                                     |
| :---------------------------------- | :-------------------------------------------------------------- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Public key for Clerk Authentication frontend SDK                |
| `CLERK_SECRET_KEY`                  | Private secret key for Clerk Backend authentication             |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL`     | Route redirect path for sign-in (`/sign-in`)                    |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL`     | Route redirect path for sign-up (`/sign-up`)                    |
| `MONGODB_URI`                       | MongoDB connection URI string                                   |
| `UPLOADTHING_TOKEN`                 | Secret API token for UploadThing cloud media storage            |
| `NEXT_PUBLIC_SERVER_URL`            | Public production URL base                                      |
| `CONTACT_RECEIVER`                  | Email address receiving contact form submissions                |
| `EMAIL_USER` / `EMAIL_PASS`         | SMTP email server credentials for outbound messaging            |
| `SMTP_HOST` / `SMTP_PORT`           | Outbound mail server configuration (`smtp.gmail.com`, `587`)    |

---

## 🛡️ Security & Role-Based Access Control (RBAC)

Grihinir Bari utilizes a robust RBAC architecture:

- **Authentication**: Secured via Clerk Middleware protecting `/dashboard` and backend API endpoints.
- **Granular Permissions**: Managed via `constants/permissions.ts` defining user roles (Super Admin, Admin, Content Manager, Editor, Viewer).
- **Data Protection**: Input validation powered by `Zod` schemas.

---

## 📜 Available Scripts

In the project directory, you can run:

| Command         | Action                                                       |
| :-------------- | :----------------------------------------------------------- |
| `npm run dev`   | Runs the app in development mode with Webpack hot reloading. |
| `npm run build` | Builds the production-optimized application bundle.          |
| `npm run start` | Starts the production Next.js server.                        |
| `npm run lint`  | Runs ESLint checks across TypeScript and React code.         |

---

## 📄 License & Authors

- **Author**: Nazmul ([@ninazmul](https://github.com/ninazmul)) - `nazmulsaw@gmail.com`
- **Organization**: [Grihinir Bari](https://grihinirbari.com)
- **License**: MIT License
