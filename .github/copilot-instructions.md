# GitHub Copilot / AI Agent Instructions for Water-Quality-Monitor 🔧

## Quick summary
- **Repo layout**: Backend (FastAPI) in `backend/app/`, Frontend (React + Vite) in `frontend/`.
- **Purpose**: Citizen-driven water pollution reporting: upload photos, create/verify reports, role-based auth.

## Quick start (dev) ✅
- Backend
  - Activate venv: `& .venv\Scripts\Activate.ps1` (Windows workspace shows `.venv` used).
  - Install: `pip install -r backend/requirements.txt`.
  - Run: `cd backend` → `uvicorn app.main:app --reload` (serves on port **8000** by default).
- Frontend
  - `cd frontend` → `npm install` → `npm run dev` (Vite dev server, typical port 5173).

## Architecture & important files 🏗️
- Backend
  - `backend/app/main.py` — FastAPI app; routers are included here (ensure any new routers are imported & `include_router` called).
  - Routers: `backend/app/routes/` (e.g., `reports.py`, `user.py`). Routes usually use **plural** prefixes (e.g., `/reports/`).
  - DB: `backend/app/database.py` (SQLAlchemy engine + `SessionLocal`, `Base`). Default `DATABASE_URL` is **Postgres**: `postgresql://postgres:7788@localhost/water_quality_monitor`.
  - Models: `backend/app/models.py` (SQLAlchemy declarative models `User`, `Station`, `Report`).
  - Schemas: `backend/app/schemas.py` — Pydantic models for request body validation.
  - Auth: `backend/app/auth.py` (JWT creation), `backend/app/utils.py` (`require_role` dependency that decodes JWT and checks `role`).
  - File uploads: `backend/app/routes/reports.py` stores uploads in an `uploads/` directory and sets `photo_url`.
- Frontend
  - API client: `frontend/src/services/api.js` — axios instance with `baseURL: "http://localhost:8000"` and request interceptor that attaches `Authorization: Bearer <token>` where `token` is read from `localStorage.getItem('token')`.
  - Auth UI: `frontend/src/pages/Login.jsx` — saves `access_token` to `localStorage` as `'token'` on login.
  - Protected routes: `frontend/src/components/ProtectedRoute.jsx` expects `localStorage` to also contain `'role'` for role-based redirects.
  - Report UI: `frontend/src/pages/ReportForm.jsx` shows how to POST multipart form data to `/reports/` including `station_name` and file upload.

## API & examples (concrete) 🧪
- Login (form urlencoded):
  - POST `/login` with form fields `username` and `password` (code uses FastAPI login endpoint returning `{ access_token, token_type }`).
- Create report (multipart/form-data):
  - POST `/reports/` with fields: `description`, `location`, `water_source`, `station_name` and `file` (UploadFile). Files are saved to `uploads/<filename>` and DB column `photo_url` holds the path.
- Get reports:
  - GET `/reports/` returns all `Report` rows (requires valid JWT with allowed role via `require_role`).

Example curl (file upload):
  curl -X POST "http://localhost:8000/reports/" -H "Authorization: Bearer <token>" -F "description=..." -F "location=..." -F "water_source=River" -F "station_name=Station A" -F "file=@photo.jpg"

## Conventions & patterns to follow 🧭
- Use plural router prefixes (e.g., `/reports/`), and keep route files under `backend/app/routes/`.
- DB session pattern: use `SessionLocal()` and a `get_db` generator dependency (see `reports.py` / `user.py`).
- Use `schemas.py` for request validation; prefer Pydantic models for JSON bodies, and `Form`/`File` for multipart.
- Passwords are hashed with `passlib` (`pbkdf2_sha256` configured in `user.py`).
- Role-based access: backend uses a JWT `role` claim and `require_role([...])`. Keep JWT signing/algorithm consistent with `auth.py`.

## Notable implementation details & gotchas ⚠️
- **Hardcoded secrets & config**: `SECRET_KEY` is set to `"SECRET123"` in code and DB URL is hardcoded. Be careful when committing changes—these should be moved to environment variables for production.
- **DB migrations**: No migration tool present (no Alembic). Creating/changing models requires manual table creation or adding a migration step.
- **Frontend / auth mismatch**: `ProtectedRoute.jsx` expects `role` in `localStorage`, but `Login.jsx` currently only stores the token. When adding role checks, either decode JWT on the client to save `role` or modify login to return role explicitly.
- **Router inclusion**: `main.py` currently includes `reports` router explicitly. If you add new routers, ensure they are included in `main.py` with `app.include_router(...)`.

## Debugging & developer tips 🔍
- To inspect a JWT quickly: paste in https://jwt.io or decode in Python (`from jose import jwt; jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])`).
- If you want a lightweight dev DB: change `DATABASE_URL` in `backend/app/database.py` to `sqlite:///./dev.db` and run a quick `Base.metadata.create_all(engine)` script to create tables.
- Use `uvicorn app.main:app --reload` for hot reloading; watch logs for 403/401 when testing role-based endpoints.

## Files to check when changing behavior 📁
- Backend: `backend/app/main.py`, `backend/app/routes/*.py`, `backend/app/models.py`, `backend/app/schemas.py`, `backend/app/utils.py`, `backend/app/auth.py`
- Frontend: `frontend/src/services/api.js`, `frontend/src/pages/Login.jsx`, `frontend/src/components/ProtectedRoute.jsx`, `frontend/src/pages/ReportForm.jsx`

---
If anything above is unclear or you want examples for additional endpoints, tell me which part to expand or where to add tests/examples. ✅
