<div align="center">

# 🚀 VIRTUAL-INTERVIEW

_Transforming Interviews Into Seamless, Smarter Experiences_

![last-commit](https://img.shields.io/github/last-commit/Harsh121415/virtual-interview?style=flat&logo=git&logoColor=white&color=0080ff)
![repo-top-language](https://img.shields.io/github/languages/top/PravinSliet123/virtual-interview?style=flat&color=0080ff)
![repo-language-count](https://img.shields.io/github/languages/count/PravinSliet123/virtual-interview?style=flat&color=0080ff)

---

### 🛠 Built with the tools and technologies:

![JSON](https://img.shields.io/badge/JSON-000000.svg?style=flat&logo=JSON&logoColor=white)
![Markdown](https://img.shields.io/badge/Markdown-000000.svg?style=flat&logo=Markdown&logoColor=white)
![npm](https://img.shields.io/badge/npm-CB3837.svg?style=flat&logo=npm&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=flat&logo=JavaScript&logoColor=black)
![React](https://img.shields.io/badge/React-61DAFB.svg?style=flat&logo=React&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6.svg?style=flat&logo=TypeScript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748.svg?style=flat&logo=Prisma&logoColor=white)
![Formik](https://img.shields.io/badge/Formik-2563EB.svg?style=flat&logo=Formik&logoColor=white)
![Radix UI](https://img.shields.io/badge/Radix%20UI-161618.svg?style=flat&logo=Radix-UI&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3.svg?style=flat&logo=ESLint&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991.svg?style=flat&logo=OpenAI&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4.svg?style=flat&logo=Axios&logoColor=white)

</div>

---

## 📚 Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Testing](#testing)

---

## 📝 Overview

_Virtual-Interview_ helps modernize and streamline the interview experience by combining automation and interactivity to provide smarter, real-time interview workflows.

---

## ⚙️ Getting Started

### ✅ Prerequisites

This project requires the following dependencies:

- **Programming Language:** JavaScript  
- **Package Manager:** npm

---

### 📥 Installation

Build Virtual-Interview from source and install dependencies:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/PravinSliet123/virtual-interview
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env.local` file in the root directory and add the following variables:

   ```env
   # Database
   DATABASE_URL="your_database_url_here"

   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
   CLERK_SECRET_KEY="your_clerk_secret_key"

   # Application
   NEXT_PUBLIC_BASE_URL="http://localhost:3000"

   # Email Configuration (Gmail App Password)
   NEXT_EMAIL_APP_PASSWORD="your_gmail_app_password_here"

   # OpenAI API (if using AI features)
   OPENAI_API_KEY="your_openai_api_key_here"

   # PayPal (if using payment features)
   NEXT_PUBLIC_PAYPAL_CLIENT_ID="your_paypal_client_id"
   PAYPAL_CLIENT_SECRET="your_paypal_client_secret"
   ```

4. **Set up Gmail App Password for Email Service:**

   To enable email functionality, you need to set up a Gmail App Password:
   
   - Go to your Google Account settings
   - Enable 2-Factor Authentication if not already enabled
   - Go to Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this password as `NEXT_EMAIL_APP_PASSWORD` in your environment variables

5. **Set up the database:**

   ```bash
   npx prisma generate
   npx prisma db push
   ```
