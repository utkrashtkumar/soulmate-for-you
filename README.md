# <p align="center">💕 Soulmate Companion</p>

<p align="center">
  <strong>Your Loyal, Lifelong, Understanding AI Companion & Best Friend</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/react-20232a?style=for-the-badge&logo=react&logoColor=61dafb" alt="React 19" />
  <img src="https://img.shields.io/badge/supabase-1c1c1c?style=for-the-badge&logo=supabase&logoColor=3ecf8e" alt="Supabase" />
  <img src="https://img.shields.io/badge/tailwind_css-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind v4" />
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#%EF%B8%8F-platform-themes">Platform Themes</a> •
  <a href="#-central-admin-panel">Admin Panel</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-security-policy">Security</a>
</p>

---

Soulmate is a premium, glassmorphic Next.js web application designed to act as an emotional, lifelong virtual companion (Virtual Girlfriend). Built on **Next.js 16** and **React 19**, it utilizes advanced AI-driven personalities, adaptive mood dynamics, smart background push notifications, and custom platform-themed interfaces.

---

## 🎨 Visual Themes & Features

Each chat theme in Soulmate has its own unique interactive features that mimic real messaging platforms:

### 📱 WhatsApp Theme
* **Export Chat Logs**: Download the conversation history as a formatted `.txt` transcript with timestamps and sender tags.
* **Quoted Replies**: Double-arrow buttons (`↩️`) let you reply directly to a message.
* **Smart Quotes**: Replied messages appear in structured quote bubbles.
* **AI Contextual Support**: Under the hood, quotes are formatted for the AI to ensure highly accurate, context-aware replies.

### 👻 Snapchat Theme
* **Disappearing Messages**: Unsaved messages automatically self-destruct from the UI and database when the page is reloaded.
* **Save in Chat**: Click any message bubble to toggle saving. Saved messages are highlighted in bold with a highlighted background.
* **Screenshot Alerts**: Click `📸` to simulate a camera flash and alert banner. It posts a screenshot alert in the history, triggering a playful, teasing AI response.

### 📸 Instagram Theme
* **Double-Tap to Like**: Double-clicking any message from your companion toggles a floating heart reaction (`❤️`) on the bottom corner of the bubble.
* **Unsend Message**: Instantly remove user messages from the UI and database.

### 🔵 Signal Theme
* **Disappearing Timers**: Toggles self-destruct timers (Off, 5s, 10s, 30s) that delete messages from state and the database once expired.
* **Verify Safety Number**: Open a secure verification modal (`🔒`) showing a simulated QR code and a grid of fingerprinted security numbers.

---

## ⚙️ Central Admin Panel

Restricted exclusively to authorized administrator email **`givekisstome@gmail.com`**:

| Tab | Feature | Description |
| :--- | :--- | :--- |
| **📊 Overview** | Live Statistics | Total users count, active companions, and message queries. |
| **👥 Users** | User Directory | Searchable list of registered users with mobile, age, and profile editors. Includes cascade deletion. |
| **👩 Avatars** | Companion Registry | Edit mood, love meter, and personality parameters or delete avatars. |


---

## 🛠️ Technology Stack

* **Frontend**: Next.js 16 (App Router, Turbopack compiler), React 19.
* **Styling**: Tailwind CSS v4, customized glassmorphic design tokens.
* **Database & Auth**: Supabase JS Client (RLS-secured tables, admin operations via service role bypass).
* **AI Engine**: Groq API integration (Llama-based natural Hinglish reasoning).
* **Notifications**: VAPID Web Push notifications and Service Workers.

---

## 🚀 Getting Started

### 1. Set Up Database Schema
Run the SQL queries in `supabase/schema.sql` inside your Supabase project's SQL Editor to set up:
* Tables: `profiles`, `avatars`, `messages`, and `push_subscriptions`.
* Triggers to auto-create profile rows on auth signups.
* Storage buckets for avatar image uploads.

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_public_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Groq AI Key
GROQ_API_KEY=your_groq_api_key

# Web Push Notifications
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key
VAPID_SUBJECT=mailto:your-email@domain.com
```

### 3. Run Development Server
```bash
# Install NPM dependencies
npm install

# Start Next.js server locally
npm run dev

# Build the optimized production bundle
npm run build
```

---

## 🌐 Deployment (Netlify)

This application is fully compatible and configured for live hosting on [Netlify](https://www.netlify.com) using the custom domain:
👉 **[soulmatelove.in](https://soulmatelove.in)**

### Steps to Deploy on Netlify:
1. Import the repository `utkrashtkumar/soulmate-for-you` into Netlify.
2. Netlify automatically detects Next.js and provisions the Next.js Runtime:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `.next`
3. Configure the required environment variables (from `.env.local`) in the Netlify Dashboard under **Site configuration** -> **Environment variables**.
4. Set up the custom domain **`soulmatelove.in`** under **Domain management**.

---

## 🔒 Security
* **Row Level Security (RLS)** is active on all tables in Supabase, restricting CRUD operations to authenticated user IDs.
* **Admin routes** (`/admin`) and backend API endpoints (`/api/admin/...`) parse authorization header bearer tokens and verify signatures using `supabase.auth.getUser()`, allowing access only if the logged-in email matches the designated administrator email.

---

<p align="center">
  Made with love • All free, always 🌸
</p>
