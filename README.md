# Project Overview

This repository contains a full-stack e-commerce application built with a modern architecture.  
It includes a TypeScript React frontend (Vite + Tailwind) and a Node.js + Express backend (MongoDB). The codebase is organized for development, testing, and future production deployment.

---

## Tech Stack
- **Frontend:** Vite, React, TypeScript, Tailwind CSS, Redux Toolkit, Zod, Framer Motion  
- **Backend:** Node.js, Express, MongoDB (Mongoose), Zod, JWT authentication  
- **Utilities:** Axios, dotenv, Sentry (example hooks), eslint, prettier

---

## Prerequisites
- Node.js (v16+ recommended; v18+ preferred)  
- npm, pnpm, or yarn
- MongoDB instance (Atlas or local)  

---

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/vibek01/ECOM_D1

# 2. Frontend
cd sneakers-frontend
npm install
npm run dev
# Open http://localhost:5173

# 3. Backend
cd backend
npm install
npm run dev
# Default API: http://localhost:5000

# 5. Environment variables

# Frontend .env
VITE_API_BASE=http://localhost:5000/api
VITE_SENTRY_DSN=     # optional