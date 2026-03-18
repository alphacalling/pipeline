## MERN Pipeline - Full Stack CRUD (JavaScript)

Simple full-stack CRUD app built with **MongoDB, Express, React, and Node.js**.

### Structure

- **backend**: Express API + MongoDB model
  - `server.js`: API and server entry
  - `.env.example`: example environment variables
- **client**: Vite + React + Tailwind single-page app that talks to the backend via `/api/*`

### Backend setup

1. Install dependencies:

```bash
cd backend
npm install
```

2. Create your `.env` file:

```bash
cd backend
cp .env.example .env   # or create manually on Windows
```

Edit `.env` if needed:

```text
MONGO_URI=mongodb://127.0.0.1:27017/mern_pipeline_db
PORT=5000
```

3. Start MongoDB locally (e.g. `mongod` or MongoDB service).

4. Run the backend server:

```bash
cd backend
npm run dev
```

The API will be available at `http://localhost:5000/`.

### Frontend (Vite + Tailwind) setup

1. Install dependencies:

```bash
cd client
npm install
```

2. Run the dev server:

```bash
cd client
npm run dev
```

This starts Vite on `http://localhost:5173/` with a proxy to the backend API at `http://localhost:5000`. Make sure the backend is running first.

### API endpoints

- `GET /api/items` – list items
- `POST /api/items` – create item
- `PUT /api/items/:id` – update item
- `DELETE /api/items/:id` – delete item

