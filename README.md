# Hirevia Phase-1 MVP

Welcome to the Hirevia repository! This monorepo is divided into three distinct projects to maintain clean architecture between our server, HR web platform, and Applicant mobile application.

## Project Structure

```text
Hirevia_MobileApp/
├── backend/                  # Node.js + Express REST API (TypeScript)
├── web-portal/               # Next.js (React) web app for HR users
└── app/                      # React Native (Expo) mobile app for Applicants
```

---

## 1. Backend (Node.js REST API)
The `backend/` folder contains the core logic, database models, and authentication verification. It uses **MongoDB** as its database, **Express** for routing, and **Zod** for request validation.

### Architecture Overview
This is built using a classic Layered Architecture:
*   **Models (`src/models/`)**: Defines Mongoose schemas (e.g. `User`, `Company`, `Job`, `Application`).
*   **Repositories (`src/repositories/`)**: Contains all direct database queries (e.g. `save()`, `findOne()`). Keeps controllers clean.
*   **Services (`src/services/`)**: Contains core application business logic (e.g. hashing passwords, generating JWTs, checking application limits).
*   **Controllers (`src/controllers/`)**: Manages HTTP Requests and Responses, passing data to/from Services.
*   **Middlewares (`src/middlewares/`)**: Global utilities for handling Errors, Zod Validation, Multer (resume PDF uploads), and JWT Authentication (`requireAuth`).

### How to Run Locally

1. Open your terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install the Node.js packages:
   ```bash
   npm install
   ```
3. Start the development server (runs with hot-reloading for TypeScript):
   ```bash
   npm run dev
   ```
*(Note: A `.env` file must exist locally at `backend/.env` with `PORT`, `MONGODB_URI`, and `JWT_SECRET`.)*

---

## 2. Web Portal (Next.js - HR Dashboard)
The `web-portal/` folder contains the frontend for HR users. It's built with **Next.js (App Router)** and utilizes **Tailwind CSS** for styling.

### How to Run Locally

1. Open a **new** terminal tab and navigate to the portal folder:
   ```bash
   cd web-portal
   ```
2. Install the React dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
4. Open your web browser and go to `http://localhost:3000` (or `3001` if port is in use).

---

## 3. Applicant App (React Native - Expo)
The `app/` folder contains the mobile application specifically tailored for Applicants to search and apply for jobs. It is built using **React Native** via the **Expo** framework for ease of testing on actual iOS/Android devices.

### How to Run Locally

1. Open a **new** terminal tab and navigate to the app folder:
   ```bash
   cd app
   ```
2. Install the mobile dependencies:
   ```bash
   npm install
   ```
3. Start the Expo bundler:
   ```bash
   npx expo start --clear
   ```
4. **To view the app:**
   *   **Physical Device:** Download the "Expo Go" app on your iPhone or Android and scan the QR code that appears in the terminal.
   *   **Simulator:** Press `i` to open in the iOS Simulator, or press `a` to open in the Android Emulator (if Android Studio is installed).

---

## Git Workflow & Development Rules
- **DO NOT** edit code inside `node_modules/`, `dist/`, or `.next/`.
- Try to keep React Native UI components inside `app/src/screens/` and Next.js components inside `web-portal/src/components/`.
- Ensure all backend responses stick to the standard format: `{ success: boolean, message: string, data?: any }` as enforced by the `errorHandler.ts`.
