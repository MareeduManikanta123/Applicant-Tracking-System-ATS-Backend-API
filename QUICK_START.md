# Quick Start Guide - After Fixes

## ✅ All Issues from Evaluation Have Been Fixed

This project now fully addresses the critical feedback received. Follow these steps to verify everything is working.

---

## 1️⃣ Setup Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your actual values:
# - DATABASE_URL (PostgreSQL connection string)
# - JWT_SECRET (generate a strong random secret!)
# - EMAIL_USER, EMAIL_PASS (for Nodemailer)
# - REDIS_HOST, REDIS_PORT (optional, defaults to localhost:6379)
```

**⚠️ CRITICAL:** Set `JWT_SECRET` before starting the server. Application will fail if not set.

---

## 2️⃣ Install Dependencies

```bash
npm install
```

This now includes Jest for testing.

---

## 3️⃣ Setup Database

```bash
# Run Prisma migrations
npx prisma migrate dev

# (Optional) View database
npx prisma studio
```

---

## 4️⃣ Run Tests (NEW!)

```bash
# Run all unit tests
npm test

# Watch mode - reruns tests on file changes
npm run test:watch

# Generate coverage report
npm run test:coverage
```

**Test Files:**

- State machine transitions: `tests/applicationStateMachine.test.js`
- JWT operations: `tests/jwt.test.js`
- RBAC authorization: `tests/role.middleware.test.js`
- Service layer: `tests/application.service.test.js`

---

## 5️⃣ Start Server & Worker

**Terminal 1 - API Server:**

```bash
npm run dev
# Server runs on http://localhost:3000
```

**Terminal 2 - Email Worker:**

```bash
node src/workers/email.worker.js
# Worker processes background email jobs
```

**Terminal 3 - Redis (if not already running):**

```bash
redis-server
# Or using Docker:
docker run -d -p 6379:6379 redis:latest
```

Check API health:

```bash
curl http://localhost:3000/health
```

---

## 6️⃣ Test with Postman

Import the Postman collection:

```
ats_full_ats_api.postman_collection.json
```

Available endpoints:

- `POST /auth/register` - Create account
- `POST /auth/login` - Get JWT token
- `POST /jobs` - Create job (recruiter only)
- `POST /applications` - Apply for job (candidate only)
- `PATCH /applications/:id/stage` - Change app status (recruiter only)

---

## 🔧 What Was Fixed

### Security (Critical)

- ❌ Removed hardcoded JWT secret fallback
- ✅ JWT_SECRET now required from environment

### Architecture (Major)

- ❌ Removed dead code in application controller
- ✅ All database access now through service layer
- ❌ Consolidated duplicate Prisma clients
- ✅ Single source of truth

### Configuration (Major)

- ❌ Hardcoded Redis host/port
- ✅ Now uses environment variables

### Testing (Missing Feature)

- ❌ No tests existed
- ✅ Comprehensive Jest test suite added

---

## 📋 Verification Checklist

- [ ] JWT_SECRET set in .env
- [ ] `npm install` completed
- [ ] `npx prisma migrate dev` completed
- [ ] `npm test` passes
- [ ] API server runs: `npm run dev`
- [ ] Email worker runs: `node src/workers/email.worker.js`
- [ ] Health check returns OK: `curl http://localhost:3000/health`
- [ ] Postman collection tests pass

---

## 🎯 Key Improvements

| Issue                   | Status      | Impact                         |
| ----------------------- | ----------- | ------------------------------ |
| Hardcoded JWT secret    | ✅ FIXED    | Security vulnerability removed |
| Dead code in controller | ✅ FIXED    | Clean architecture enforced    |
| Hardcoded Redis config  | ✅ FIXED    | Multi-environment support      |
| No automated tests      | ✅ FIXED    | Test suite added               |
| Production readiness    | ✅ IMPROVED | Security checklist provided    |

---

## 📖 Next Steps

1. **Read FIXES_SUMMARY.md** - Detailed explanation of all changes
2. **Run tests** - Validate state machine and RBAC: `npm test`
3. **Deploy** - Use proper secrets management for production

---

## 🆘 Troubleshooting

**"JWT_SECRET environment variable is required"**

- Set JWT_SECRET in .env file: `JWT_SECRET=your-strong-random-secret`

**"Cannot find module 'prisma'"**

- Run: `npm install`

**"Redis connection failed"**

- Ensure Redis is running: `redis-server` or Docker
- Or update REDIS_HOST/REDIS_PORT in .env

**Tests fail with "Cannot find module"**

- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

---

**Ready to resubmit! 🚀**
