# 🧑‍💼 Applicant Tracking System (ATS) – Backend API

A full-scale backend system built to manage job applications using modern enterprise practices—state machines, RBAC, asynchronous workers, transactional database logic, and clean architecture.

This project is an end-to-end implementation of a real ATS platform that supports multi-tenant companies, job posting workflows, candidate submissions, recruiter operations, and automated communication pipelines.

---

## 🚀 Core Project Highlights

### 🔐 Authentication & RBAC

* JWT-based authentication
* Three system roles:

  * `CANDIDATE`
  * `RECRUITER`
  * `HIRING_MANAGER` (read-only access)
* Access restricted at route + service level

### 💼 Job Management Features

Recruiters can:

* Create job postings
* Update job details
* Close jobs
* List jobs belonging only to their company

### 📄 Application Workflow (State Machine)

Applications follow controlled stage transitions:

```
APPLIED → SCREENING → INTERVIEW → OFFER → HIRED
       ↘
        REJECTED
```

Rules enforced:

* Cannot skip between stages
* Cannot return backward
* Rejection allowed from any stage
* All invalid transitions are blocked

### 📝 Application Audit Logging

Every stage update generates a history record:

* Previous stage
* New stage
* User who changed it
* Timestamp
* Stored atomically using DB transactions

### 📧 Email Notifications (Async)

* Redis + BullMQ background workers
* Nodemailer email service integration
* API remains responsive due to queueing

Notifications sent to:

* Candidate (on apply + stage change)
* Recruiter (on new application)

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

* Node.js + Express
* PostgreSQL + Prisma ORM
* JWT Authentication
* BullMQ + Redis Queue
* Nodemailer
* Docker (optional Redis)

**Clean Code Approach**

* Fully modular
* Abstracted business logic in services
* Controller thinness maintained
* Environment-controlled secrets

---

# 🗂️ Database Schema (ERD Overview)

### Main Entities:

**User**

* Candidate or recruiter identity

**Company**

* Multiple employees (recruiters/hiring managers)

**Job**

* Owned by a company
* Recruiter can manage only within company scope

**Application**

* Belongs to a single candidate & job
* Contains current workflow stage

**ApplicationHistory**

* Logs every state change

Full diagram included as:

* Prisma studio screenshot
* ERD draw.io export

---

# 🔑 RBAC Permission Matrix

| Endpoint / Feature        | Candidate | Recruiter | Hiring Manager |
| ------------------------- | --------- | --------- | -------------- |
| Register / Login          | ✔️        | ✔️        | ✔️             |
| Apply for Jobs            | ✔️        | ❌         | ❌              |
| View Own Applications     | ✔️        | ❌         | ❌              |
| Create Jobs               | ❌         | ✔️        | ❌              |
| Update / Close Jobs       | ❌         | ✔️        | ❌              |
| Change Application Stage  | ❌         | ✔️        | ❌              |
| View all job applications | ❌         | ✔️        | 👁️ View       |

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
ATS.postman_collection.json
```

Supports:

* Applying
* Job creation
* Stage changes
* Permission checks
* Email validation

### Automated Testing

* Unit testing structure provided conceptually
* Ready for expansions like Jest or Mocha

---

# ⚙️ Local Development Setup

### Requirements:

* Node.js ≥ 18
* PostgreSQL
* Redis (v5+)
* Docker (optional for Redis)

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

Create `.env` file:

```
DATABASE_URL=postgresql://user:pass@localhost:5432/ats_db
JWT_SECRET=<your secret key>
EMAIL_USER=<gmail account>
EMAIL_PASS=<app password>
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```

---

# 📬 Email Examples

Candidate:

* Application submitted
* Stage changed

Recruiter:

* New application received

All emails are queued → handled asynchronously.

---

# 🎥 Video Demo (Included)

Demo shows:

* Candidate applies for job
* Recruiter views applications
* Recruiter moves stage
* Emails reach inbox
* Audit log updates live
* Role restrictions enforced

---

# 📘 Project Vision & Learning Outcome

This project showcases real industry backend skills:

* Multi-user domain logic
* Multi-tenant architecture
* Real state machine transitions
* Queue-driven async microprocessing
* Secure role-based access enforcement
* Database transactions safety
* Code separation patterns

It demonstrates hands-on backend skills beyond CRUD, preparing the system for scaling in real ATS platforms.

---

# 💡 Contribution & Authors

Manikanta Mareedu
DS - 3rd year




