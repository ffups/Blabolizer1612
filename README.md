# Blabolizer1612

## Summary of Application

Blabolizer1612 is a full-stack web application built with Next.js (frontend) and Node.js (backend). It allows users to register a username, save and delete cities associated with their username, and demonstrates privacy-friendly analytics. All data is stored in a Supabase database.

## How to Runnnnn

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- Internet connection (for Supabase)

### 1. Clone the repository

```sh
git clone https://github.com/ffups/Blabolizer1612
cd Blabolizer1612
```

### 2. Set up environment variables

#### Backend

Create a `.env` file in `Blabolizer1612/backend/` with the following content 

```
see form submission!
```

> **Note:** The repository includes a connection string to a remote Supabase database. If you want to use your own, create a [Supabase](https://supabase.com/) project and update the variables above.  
> The current Supabase instance allows external connections.

#### Frontend

Create a `.env.local` file in `Blabolizer1612/front-end/` with:

```
NEXT_PUBLIC_API_URL=http://localhost:3000/
```

### 3. Install dependencies

#### Backend

```sh
cd backend
npm install
```

#### Frontend

```sh
cd ../front-end
npm install
```

### 4. Run the application

#### Start the backend

```sh
cd ../backend
npm start
```

#### Start the frontend

```sh
cd ../front-end
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database

- Uses [Supabase](https://supabase.com/) (PostgreSQL) as the database.
- The connection string is provided in the `.env` file.
- If you want to run your own local database, set up Supabase locally or use your own PostgreSQL instance and update the `.env` accordingly.

## User Registration

- You can create a user by entering a username on the `/name` page.
- No pre-created users are required.

## Environment Variables

- See above for required variables.

---
