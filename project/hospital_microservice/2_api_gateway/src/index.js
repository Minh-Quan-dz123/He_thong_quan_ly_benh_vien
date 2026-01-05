require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { createProxyMiddleware } = require('http-proxy-middleware');
const jwt = require('jsonwebtoken');

const PORT = process.env.PORT || 8080;
const ADMIN_SERVICE_URL = process.env.ADMIN_SERVICE_URL || 'http://localhost:8002';
const DOCTOR_SERVICE_URL = process.env.DOCTOR_SERVICE_URL || 'http://localhost:8001';
const PATIENT_SERVICE_URL = process.env.PATIENT_SERVICE_URL || 'http://localhost:8000';

const app = express();

// JWT secret for gateway verification (use env in production)
const JWT_SECRET = process.env.JWT_SECRET || process.env.JWT_PRIVATE_KEY || 'your-jwt-secret';

// Middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// Basic rate limiter (tweak for your needs)
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Health
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Proxy helpers
function createProxy(target) {
  return createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: (path, req) => path.replace(/^\/[^/]+/, ''),
    onProxyReq: (proxyReq, req, res) => {
      // Forward original Authorization header (if present)
      if (req.headers.authorization) {
        proxyReq.setHeader('authorization', req.headers.authorization);
      }

      // Forward verified user claims (if available)
      if (req.user) {
        if (req.user.sub) proxyReq.setHeader('x-user-id', req.user.sub);
        if (req.user.role) proxyReq.setHeader('x-user-role', req.user.role);
        if (req.user.roles) proxyReq.setHeader('x-user-roles', Array.isArray(req.user.roles) ? req.user.roles.join(',') : String(req.user.roles));
        // forward whole payload as base64 JSON if needed
        try {
          proxyReq.setHeader('x-user-payload', Buffer.from(JSON.stringify(req.user)).toString('base64'));
        } catch (e) {}
      }
      // If body has been parsed by express.json(), forward it to the proxied service
      if (req.body && Object.keys(req.body).length) {
        const bodyData = JSON.stringify(req.body);
        // set content-type and content-length (overwrite if necessary)
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        try {
          proxyReq.write(bodyData);
        } catch (e) {
          // ignore write errors
        }
      }
    }
  });
}

// Authentication middleware for gateway: verify JWT and attach claims to req.user
function gatewayAuth(req, res, next) {
  const auth = req.headers['authorization'] || '';
  if (!auth) return res.status(401).json({ error: 'Missing Authorization header' });
  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ error: 'Invalid Authorization format' });
  const token = parts[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// Mount proxies
// Allow unauthenticated access to login endpoints (proxied without gatewayAuth)
app.use('/admin/login', createProxy(ADMIN_SERVICE_URL));
app.use('/doctor/login', createProxy(DOCTOR_SERVICE_URL));
app.use('/patient/login', createProxy(PATIENT_SERVICE_URL));
app.use('/patient/register', createProxy(PATIENT_SERVICE_URL));
app.use('/patient/forgot-password', createProxy(PATIENT_SERVICE_URL));
app.use('/doctor/register', createProxy(DOCTOR_SERVICE_URL));

// Allow unauthenticated access to public guides (served by admin service)
app.use('/admin/guides', createProxy(ADMIN_SERVICE_URL));

// Allow unauthenticated access to doctor public endpoints (list and detail)
app.use('/doctor/doctors', createProxy(DOCTOR_SERVICE_URL));

// Protect other routes with gatewayAuth (authentication)
app.use('/admin', gatewayAuth, createProxy(ADMIN_SERVICE_URL));
app.use('/doctor', gatewayAuth, createProxy(DOCTOR_SERVICE_URL));
app.use('/patient', gatewayAuth, createProxy(PATIENT_SERVICE_URL));

// Fallback
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

app.listen(PORT, () => {
  console.log(`API Gateway listening on port ${PORT}`);
  console.log(`Proxying /admin -> ${ADMIN_SERVICE_URL}`);
  console.log(`Proxying /doctor -> ${DOCTOR_SERVICE_URL}`);
  console.log(`Proxying /patient -> ${PATIENT_SERVICE_URL}`);
});
