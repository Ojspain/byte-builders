# Byte Builders

**CSCI 342 - Group 3**

Group Members:

- Isaiah Hardy
- Luke Lundeen
- Naima Zida-Brown
- Oliver Spain
- Teagan O'Reilly

## Project Overview

Byte Builders is a bug-themed social application designed to allow users to interact, explore species pages, and write bug reviews. The project is built using the MERN stack (MongoDB, Express, React, Node.js) and styled with Tailwind CSS.

## Project Structure

- `/frontend`: Contains the Vite + React client application, Tailwind configuration, and UI components.
- `/backend`: Contains the Node.js + Express server, which will handle API routing and database connections.

## Setup Instructions

To set up the project locally, install the dependencies for both the frontend and backend environments.

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Ojspain/byte-builders
   cd byte-builders
   ```

2. **Install Frontend Dependencies:**

   ```bash
   cd frontend
   npm install
   ```

3. **Install Backend Dependencies:**
   ```bash
   cd ../backend
   npm install
   ```

## How to Run the Project Locally

Two separate terminal instances are needed to start the full application.

**Starting the Backend Server:**
Open a terminal, navigate to the backend directory, and start the development server:

```bash
cd backend
npm run dev
```

**Starting the Frontend Client:**
Open a second terminal, navigate to the frontend directory, and start the development server:

```bash
cd frontend
npm run dev
```

## Navigation

- **`/` (Home Page):** The main landing area featuring the primary post feed. Includes functionality for sorting the feed and viewing recent interactions.
- **`/signup` (Sign Up Page):** The interface through which users can create an account to track their saved posts and follow other.
- **`/login` (Log In Page):** The interface through which returning users can access their account.
- **`/species` (Species Page):** A dedicated area for exploring and viewing information about specific bug species.
- **`/search` (Search Page):** Allows users to query the database to find specific species, tags, or posts.
- **`/new-post` (New Post Page):** The form interface for users to create and submit new content to the platform.
- **`/profile` (Profile Page):** The user-specific dashboard displaying user details and personal post history.
- **`/saved` (Saved Page):** A collection of posts and species that the user has bookmarked for later viewing.
- **`/*` (Not Found):** A fallback route to handle 404 errors for unrecognized URLs.
