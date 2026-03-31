# 🌍 TravelLens (Posts App)

## 🚀 Demo

<p align="center">
	<a href="https://toviasnunez.github.io/chxme-fullstack-app/" target="_blank">
		<img src="https://img.shields.io/badge/Click%20me-Demo-blue?style=for-the-badge&logo=github" alt="Live Demo" />
	</a>
</p>

This project includes a demo mode that allows the application to run without a database.

👉 The demo showcases:

* Example travel posts
* UI and user experience
* Core functionality without backend dependency

---

## 📌 Overview

TravelLens is a web application designed to share travel experiences, rate destinations, and provide useful tips for other travelers.
The platform allows users to explore different places around the world through structured posts that include ratings, descriptions, and practical insights.

The application is built as a full-stack project with a frontend (Angular) and a backend (Node.js/Express), and includes a **demo mode** for public access without requiring a database.

---

## 🎯 Objective

The main goal of this application is to:

* Help users discover new travel destinations
* Provide structured and comparable travel experiences
* Allow users to rate and review places
* Share practical travel tips (e.g. what to visit, what to avoid, recommendations)

Additionally, the project serves as a demonstration of modern web development and architecture practices.

---

## 🧩 Domain

This application belongs to the **Travel & Experience Sharing domain**, focusing on:

* Destination reviews
* Travel ratings
* User-generated content
* Location-based insights

---

## ⚙️ Features

### ✈️ Core Features

* Create and view travel posts
* Rate destinations
* Add travel descriptions and tips
* Upload images for each post

### 🔐 Authentication

* User signup & login
* Token-based authentication (JWT)
* Authorization for editing and deleting posts

### 🧪 Demo Mode

* Runs without a database
* Displays predefined example posts
* Create / update / delete actions are disabled
* Ideal for public demo and portfolio presentation

---

## 🏗️ Tech Stack

**Frontend**

* Angular
* TypeScript
* RxJS

**Backend**

* Node.js
* Express
* MongoDB (in full mode)

---

## 📦 Project Structure

* `frontend/` → Angular application
* `backend/` → Node.js / Express API
* `demo/` → Static demo data

---

## 💡 Future Improvements

* Advanced filtering and search
* Map integration (locations visualization)
* User profiles and history
* Recommendation system based on ratings

---

## 👨‍💻 Author

Developed as part of a full-stack project and portfolio demonstration.

---

## 📝 Software Description

### 🖥️ Run the local backend server

```bash
npm run start:server
```

### 🖥️ Run the frontend server

```bash
ng serve
```

---

## 🗄️ Backend Structure

### 📂 controllers
- **posts:** create, get, get by ID, update, delete post
- **users:** create user, user login

### 🛡️ middleware
- **token:** import jsonwebtoken
- **file:** MIME_TYPE_MAP, storage (multer)

### 🗃️ models
- **post.js:** postSchema (mongoose.Schema)
- **user.js:** userSchema (mongoose.Schema)

### 🚦 routes
- **Post:** create, get, get by id, update, delete (token verification)
- **User:** signup, login

### ⚙️ app.js
- Connect to mongoose
- Handle image upload
- Set headers
- Export post/user routes

### 📦 package.json
- Deployment scripts

### 🖥️ server.js
- Start backend server

---

## 💻 Frontend Structure

### 📁 app/
- **🔐 auth:**
  - 🔑 login: User login
  - 📝 signup: User registration
  - 🗝️ auth-data.model: Interface for user data
  - 🛡️ auth-interceptor: HTTP auth token handling
  - 🗺️ auth-routing: Routing for auth components
  - 🚧 auth-guard: Route protection
  - 📦 auth.module: Auth module
  - ⚙️ auth.service: Auth logic (token, status, local storage, etc.)
- **❗ error:** Error dialog handling
- **🔻 footer:** Footer component
- **🔺 header:** Header component
- **📝 posts:**
  - ✍️ post-create: Create/update post
  - 📃 post-list: List posts
  - 🗂️ post.model: Post interface
  - 📦 posts.module: Posts module
  - 🔄 posts.service: CRUD for posts
- **🎨 angular-material.module:** Angular Material imports
- **🗺️ app-routing.module:** Routing setup
- **🧩 app.module:** Main app module
- **❗ error-interceptor:** HTTP error handling

### 🗂️ assets/
- 📄 JSON local data

---

*Siehe README für weitere Details und Screenshots.*
