# 🚀 A. Mohamed Yasar | Full-Stack MERN Portfolio

A high-performance Full-Stack Portfolio built with the MERN stack (MongoDB, Express, React, Node.js). Featuring a modern design, real-time system metrics, and automated email notifications.

---

## 🏗️ How it works

I built this project with a **decoupled architecture**, where the Frontend and Backend work separately:

1.  **Frontend (Client):** A React app in the `/client` folder that handles the UI and animations.
2.  **Backend (Server):** A Node.js/Express app in the `/server` folder that handles the data and security.

### 🔄 How They Communicate?

```mermaid
graph LR
    subgraph "Frontend Layer"
        React[React.js Client]
        UI[Material UI / Framer]
    end

    subgraph "Communication Layer"
        Axios[Axios / REST API]
    end

    subgraph "Backend Layer"
        Node[Node.js / Express]
        Logic[Controllers]
    end

    subgraph "Database Layer"
        DB[(MongoDB / JSON)]
    end

    React --> Axios
    Axios --> Node
    Node --> Logic
    Logic --> DB
```

The two layers are linked via a **REST API Bridge**:
- **Protocol:** I used **Axios** for sending requests from the frontend to the server.
- **Data:** The server responds with **JSON data** which the React frontend then displays.
- **Example:** When you click "Projects", the frontend asks for `/api/fragments/projects`, the server gets the data, and shows it on the screen.

---

## ✨ Features

-   **Modular Data Loading:** Fragment-based progressive loading for optimal performance.
-   **Modern UI/UX:** Responsive design using Material UI and Framer Motion.
-   **Data Resilience:** Fallback local storage (JSON) when database connectivity is unavailable.
-   **Automated Communication:** Integrated email system for contact form notifications and auto-replies.
-   **System Status:** Live tracking of system health and performance metrics.
-   **Admin Dashboard:** Secure JWT-protected management interface for content updates.

## 🛠️ Technology Stack

-   **Frontend:** React.js, Material UI (MUI), Lucide Icons, Framer Motion.
-   **Backend:** Node.js, Express.js, Nodemailer, JWT.
-   **Database:** MongoDB (with Local JSON Fallback).
-   **Utilities:** Axios, Dotenv, CORS, Helmet, Compression.

## 📦 Project Structure

```bash
mern-portfolio-yasar/
├── 🌐 client/          # React.js Frontend (View Layer)
│   ├── src/
│   │   ├── components/  # Modular UI Fragments
│   │   ├── services/    # API Consumer (Axios)
│   │   └── config.js    # Client-side settings
└── ⚙️ server/          # Node.js Backend (Logic Layer)
    ├── controllers/    # Request Handling logic
    ├── routes/         # API Route definitions
    ├── services/       # Email & Logic Utilities
    └── models/         # Data Schema Architecture
```

## 🚀 Rapid Deployment

1.  **Environment Setup:** Create a `.env` file in the `server` directory.
    ```env
    PORT=5001
    EMAIL_USER=your-email@gmail.com
    EMAIL_PASS=your-app-password
    RECEIVER_EMAIL=your-email@gmail.com
    ```
2.  **Server Initialization:**
    ```bash
    cd server
    npm install
    npm run dev
    ```
3.  **Client Initialization:**
    ```bash
    cd client
    npm install
    npm start
    ```

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
Built with ❤️ by **A. Mohamed Yasar**
