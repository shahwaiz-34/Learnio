# 📚 My Courses SaaS

A modern Learning Management System (LMS) built with **Next.js**, **Convex**, **Tailwind CSS**, **shadcn/ui**, **Clerk Authentication**, and **Stripe** for subscription payments.

## 🚀 Overview

My Courses SaaS is a full-stack course platform where users can securely sign up, purchase subscriptions, access premium courses, and receive automated email notifications after successful transactions.

The application uses Convex as the backend database for real-time data synchronization while Next.js powers the frontend for high performance and SEO.

---

## ✨ Features

- 🔐 Secure Authentication with Clerk
- 👤 User Dashboard
- 📚 Browse Available Courses
- 💳 Stripe Subscription & Payment Integration
- 📧 Automatic Email Notifications
- ⚡ Real-time Database using Convex
- 📱 Fully Responsive Design
- 🎨 Modern UI with shadcn/ui
- 🌙 Clean Tailwind CSS Styling
- 🔒 Protected Premium Content
- 🚀 Fast Performance with Next.js App Router

---

## 🛠 Tech Stack

### Frontend

- Next.js 15
- React
- TypeScript
- Tailwind CSS
- shadcn/ui

### Backend

- Convex Database
- Convex Server Functions

### Authentication

- Clerk Authentication

### Payments

- Stripe
- Stripe Webhooks

### Email

- Email API Integration (Customer Confirmation Emails)

---

## 📂 Project Structure

```
my-courses-saas/
│
├── app/
├── components/
├── convex/
├── hooks/
├── lib/
├── public/
├── styles/
├── middleware.ts
├── next.config.ts
├── package.json
└── README.md
```

---

## ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/your-username/my-courses-saas.git
```

Navigate to the project

```bash
cd my-courses-saas
```

Install dependencies

```bash
npm install
```

Run the development server

```bash
npm run dev
```

---

## 🔑 Environment Variables

Create a `.env.local` file and configure the following variables:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=

STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

EMAIL_API_KEY=
EMAIL_FROM=
```

---

## 💳 Stripe Integration

- Secure Checkout
- Subscription Management
- Webhook Verification
- Payment Confirmation
- Automatic Access to Premium Courses

---

## 📧 Email Notifications

After a successful purchase, customers automatically receive:

- Payment Confirmation
- Subscription Details
- Welcome Email
- Course Access Information

---

## 📸 Screenshots

Add screenshots here.

```
/public/screenshots
```

Example:

- Home Page
- Course Page
- Dashboard
- Checkout
- Profile

---

## 🚀 Deployment

Deploy easily on **Vercel**.

```bash
npm run build
```

---

## Future Improvements

- Course Progress Tracking
- Video Streaming
- Quiz System
- Certificates
- Instructor Dashboard
- Admin Analytics
- Coupons & Discounts
- Multi-language Support

---

## Contributing

Contributions are welcome.

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to your branch
5. Open a Pull Request

---

## License

This project is licensed under the MIT License.

---

## Author

Developed by **Your Name**

If you like this project, don't forget to ⭐ the repository.