# 🧑‍💼 Applicant Tracking System (ATS) – Backend API

A full-scale backend system built to manage job applications using modern enterprise practices—state machines, RBAC, asynchronous workers, transactional database logic, and clean architecture.

This project is an end-to-end implementation of a real ATS platform that supports multi-tenant companies, job posting workflows, candidate submissions, recruiter operations, and automated communication pipelines.

---

## 🚀 Core Project Highlights

### 🔐 Authentication & RBAC

- JWT-based authentication
- Three system roles:
  - `CANDIDATE`
  - `RECRUITER`
  - `HIRING_MANAGER` (read-only access)

- Access restricted at route + service level

### 💼 Job Management Features

Recruiters can:

- Create job postings
- Update job details
- Close jobs
- List jobs belonging only to their company

### 📄 Application Workflow (State Machine)

Applications follow controlled stage transitions:

```
APPLIED → SCREENING → INTERVIEW → OFFER → HIRED
       ↘
        REJECTED
```

Rules enforced:

- Cannot skip between stages
- Cannot return backward
- Rejection allowed from any stage
- All invalid transitions are blocked

### 📝 Application Audit Logging

Every stage update generates a history record:

- Previous stage
- New stage
- User who changed it
- Timestamp
- Stored atomically using DB transactions

### 📧 Email Notifications (Async)

- Redis + BullMQ background workers
- Nodemailer email service integration
- API remains responsive due to queueing

Notifications sent to:

- Candidate (on apply + stage change)
- Recruiter (on new application)

---

# 🧱 System Architecture Overview

The system is structured using professional layered architecture:

```
Client Request
   → Routes
       → Controllers
           → Services
               → Prisma Database Layer
                   → State Machine Validation
                       → Queue Messaging
                           → Background Email Worker
```

**Technology Stack**

- Node.js + Express
- PostgreSQL + Prisma ORM
- JWT Authentication
- BullMQ + Redis Queue
- Nodemailer
- Docker (optional Redis)

**Clean Code Approach**

- Fully modular
- Abstracted business logic in services
- Controller thinness maintained
- Environment-controlled secrets

---

# 🗂️ Database Schema (ERD Overview)

### Main Entities:

**User**

- Candidate or recruiter identity

**Company**

- Multiple employees (recruiters/hiring managers)

**Job**

- Owned by a company
- Recruiter can manage only within company scope

**Application**

- Belongs to a single candidate & job
- Contains current workflow stage

**ApplicationHistory**

- Logs every state change

Full diagram included as:

- Prisma studio screenshot
- ERD draw.io export

---

# 🔑 RBAC Permission Matrix

| Endpoint / Feature        | Candidate | Recruiter | Hiring Manager |
| ------------------------- | --------- | --------- | -------------- |
| Register / Login          | ✔️        | ✔️        | ✔️             |
| Apply for Jobs            | ✔️        | ❌        | ❌             |
| View Own Applications     | ✔️        | ❌        | ❌             |
| Create Jobs               | ❌        | ✔️        | ❌             |
| Update / Close Jobs       | ❌        | ✔️        | ❌             |
| Change Application Stage  | ❌        | ✔️        | ❌             |
| View all job applications | ❌        | ✔️        | 👁️ View        |

---

# 📡 API Endpoints

### Authentication

```
POST /auth/register
POST /auth/login
```

### Job Management (Recruiter Only)

```
POST   /jobs
GET    /jobs
PATCH  /jobs/:id
PATCH  /jobs/:id/close
```

### Applications

```
POST /applications
GET  /applications/my                     (Candidate)
GET  /applications/job/:jobId             (Recruiter)
PATCH /applications/:id/stage             (Recruiter)
```

All routes require:

```
Authorization: Bearer <Token>
```

---

# 🧪 Testing Overview

### Manual API Testing

A full Postman collection is included in repo:

```
ats_full_ats_api.postman_collection.json
```

Supports:

- Applying
- Job creation
- Stage changes
- Permission checks
- Email validation

### Automated Testing

Comprehensive test suite included with Jest:

**Unit Tests:**

- `tests/applicationStateMachine.test.js` - State machine transition validation
- `tests/jwt.test.js` - JWT token generation and verification
- `tests/role.middleware.test.js` - RBAC authorization enforcement
- `tests/application.service.test.js` - Application service business logic

**Integration Tests:**

- `tests/integration.example.test.js` - End-to-end workflow examples

**Running Tests:**

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

**Test Configuration:**

- `jest.config.js` - Jest configuration with ES modules support
- `tests/setup.js` - Test environment setup and mocks

---

# ⚙️ Local Development Setup

### Requirements:

- Node.js ≥ 18
- PostgreSQL
- Redis (v5+)
- Docker (optional for Redis)

### Installation Steps:

```bash
npm install
```

Generate database structure:

```bash
npx prisma migrate dev
```

Run development server:

```bash
npm run dev
```

Run background email worker:

```bash
node src/workers/email.worker.js
```

---

# 🌱 Environment Variables

Create `.env` file in the root directory. Always copy from `.env.example`:

```bash
cp .env.example .env
```

**Required Variables:**

```
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/ats_db

# JWT (CRITICAL: Generate a strong random secret!)
JWT_SECRET=your-strong-random-secret-key-here

# Redis (now externalizable)
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
# REDIS_PASSWORD=<optional password if Redis requires auth>

# Email Service
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
EMAIL_FROM=noreply@ats-system.com
```

**Security Notes:**

- ⚠️ **JWT_SECRET:** Must be set before server startup. No hardcoded fallback exists.
- ⚠️ **Never commit .env files** to version control
- Use `.env.example` for documentation of required variables
- For production, use strong random secrets and secure credential management (e.g., Azure Key Vault, AWS Secrets Manager)

---

# � Recent Improvements & Security Fixes

### Critical Security Fixes:

1. **Removed Hardcoded JWT Secret Fallback**
   - Ensures `JWT_SECRET` environment variable is required at startup
   - Prevents token forgery vulnerability
   - Application fails explicitly if JWT_SECRET is not set

2. **Externalized Redis Configuration**
   - Redis host, port, and password now loaded from environment variables
   - Supports deployment across different environments
   - Maintains backward compatibility with defaults

### Architectural Improvements:

3. **Consolidated Prisma Client**
   - Removed duplicate Prisma client initialization
   - Single source of truth: `src/utils/prisma.js`
   - Deprecated `src/prismaClient.js` now re-exports from utils for backward compatibility

4. **Removed Dead Code**
   - Eliminated `getJobById` function from application controller
   - Function violated layered architecture by accessing Prisma directly
   - All database access now strictly through service layer

### Testing & Quality:

5. **Comprehensive Test Suite**
   - Jest configuration with ES module support
   - Unit tests for state machine, JWT, RBAC, and services
   - Integration test examples
   - Test setup with mocked Prisma client
   - Run tests with `npm test`

---

# 💼 Production Readiness Checklist

- ✅ Secure credential management (environment variables)
- ✅ Layered architecture (Controllers → Services → Data Access)
- ✅ State machine with transition validation
- ✅ Asynchronous email processing (BullMQ + Redis)
- ✅ Role-Based Access Control (RBAC)
- ✅ Database transactions for data integrity
- ✅ Audit logging for compliance
- ✅ Automated test infrastructure
- ⚠️ **Recommended:** Add structured logging (e.g., Winston)
- ⚠️ **Recommended:** Implement global error handler middleware
- ⚠️ **Recommended:** Add input validation (e.g., Joi/Zod)

---

Candidate:

- Application submitted
- Stage changed

Recruiter:

- New application received

All emails are queued → handled asynchronously.

---

# 🎥 Video Demo (Included)

Demo shows:

- Candidate applies for job
- Recruiter views applications
- Recruiter moves stage
- Emails reach inbox
- Audit log updates live
- Role restrictions enforced

---

# 📘 Project Vision & Learning Outcome

This project showcases real industry backend skills:

- Multi-user domain logic
- Multi-tenant architecture
- Real state machine transitions
- Queue-driven async microprocessing
- Secure role-based access enforcement
- Database transactions safety
- Code separation patterns

It demonstrates hands-on backend skills beyond CRUD, preparing the system for scaling in real ATS platforms.

---

# 💡 Contribution & Authors

Manikanta Mareedu
DS - 3rd year
