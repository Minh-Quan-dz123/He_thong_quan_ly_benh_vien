# Hospital API Gateway (Prototype)

Lightweight API Gateway using Express + http-proxy-middleware.

Default proxy routes:
- `/admin/*` -> ADMIN_SERVICE_URL (default `http://localhost:8002`)
- `/doctor/*` -> DOCTOR_SERVICE_URL (default `http://localhost:8001`)
- `/patient/*` -> PATIENT_SERVICE_URL (default `http://localhost:8000`)

Quick start

1. Copy `.env.example` to `.env` and edit service URLs if needed.
2. Install dependencies:

```bash
npm install
```

3. Run locally:

```bash
npm start
```

Docker

```bash
docker build -t hospital-api-gateway .
docker run -p 8080:8080 --env-file .env hospital-api-gateway
```

Notes

- This is a simple prototype. Add centralized auth, logging, tracing, and proper error handling for production.
- Adjust rate-limiting, timeouts, and retries as needed.
