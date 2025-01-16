# CodeBuddy[Currently Under Development...]

CodeBuddy is a MERN stack-based web application designed to connect developers based on shared skills, interests, and profiles. It fosters collaboration, teamwork, and active participation in coding events. Whether you're looking for a project partner, a coding buddy, or a hackathon teammate, CodeBuddy simplifies the process.

---
 
## Features

- **Developer Matching**: Connect with developers sharing similar skills and interests.
- **Secure Authentication**: JWT-based authentication ensures user data protection.
- **State Management**: Efficient user interactions with Redux for seamless state handling.
- **Responsive UI**: Built with React and DaisyUI for an engaging user experience.

---

## Tech Stack

- **Frontend**: React, DaisyUI
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT
- **State Management**: Redux

---

## CodeBuddy's APIs
   ### authRouters
   - POST => /signup
   - POST => /login
   - POST => /logout

   ### profileRouters
   - GET => /profile/view
   - PATCH => /profile/edit
   - PATCH => /profile/password

   ### ConnectinRequestRoutes
   - POST => /request/send/:status/:userId     => status = ["interested", "ignored"]
   - POST => /request/review/:status/:requestId    => status = ["accepted", "rejected"]

   ### userRouters
   - GET => /user/requests
   - GET => /user/connections
   - GET => /user/feed    -> get you the profile of other users on platform

---

## Workflow

1. **User Registration/Login**: Users create and manage profiles.
2. **Profile Matching**: Matches are displayed based on skills and interests.
3. **Collaboration Hub**: Tools for initiating/joining projects and real-time interactions.

---

## Getting Started

### Prerequisites

- **Node.js**
- **MongoDB**
- **npm**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Sandipkushwaha20/CodeBuddy.git
   ```
2. **Navigate to the project directory**:
   ```bash
   cd CodeBuddy
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Start the server**:
   ```bash
   npm run dev
   ```


