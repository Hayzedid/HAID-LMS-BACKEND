# TechLearn LMS: Frontend Integration Guide

This document provides technical details for integrating the TechLearn LMS Frontend with the completed Backend API.

## 1. General Configuration
- **Base URL**: `http://localhost:3000/api/v1` (or your production domain)
- **API Documentation**: [Swagger UI](http://localhost:3000/api-docs) (Live once server is running)
- **Auth Strategy**: Bearer Token in `Authorization` header.
- **Rate Limiting**: Global limit of 100 requests per 15 minutes.

---

## 2. Core Modules & Integration Points

### A. Authentication
- **Register**: `POST /auth/register`
- **Login**: `POST /auth/login`
- **Tip**: Store the JWT in `localStorage` or a secure cookie. Include it in all subsequent requests.

### B. High-Fidelity IDE Integrity (WebSockets)
This is a critical feature. You must stream keystrokes in real-time as the student types.
- **Socket URL**: `ws://localhost:3000`
- **Flow**:
  1. On IDE mount, emit `join_ide_session` with `submissionId`.
  2. For every keystroke, emit `keystroke` event:
     ```json
     { "char": "a", "timestamp": 1678123456789 }
     ```
  3. When the student clicks "Submit", call `POST /ide/submit`.

### C. Video Accountability (Heartbeats)
To prevent cheating, the video player must send a "heartbeat" to prove the student is actively watching.
- **Endpoint**: `POST /video/heartbeat`
- **Logic**:
  - Send every 30 seconds while video is playing.
  - Include `lessonId` and current `timestamp`.
  - Backend will flag the session if heartbeats stop but the video marks itself "completed."

### D. AI Tutor (RAG Integration)
The AI Tutor is "context-aware," meaning it knows what the student is looking at.
- **Endpoint**: `POST /ai/chat`
- **Request**:
  ```json
  {
    "lessonId": "uuid-of-current-lesson",
    "question": "How do I implement a linked list?"
  }
  ```
- **Response**: Returns an `answer` and a list of `sources` from the lesson material.

### E. Spaced Repetition (SRS)
Display a "Reviews Due" badge on the student's dashboard.
- **Get Due**: `GET /srs/due`
- **Submit Feedback**: `POST /srs/feedback`
  - Values: `1` (Again), `2` (Hard), `3` (Good), `4` (Easy).

### F. Enterprise Multi-Tenancy (B2B)
If your app supports multiple companies, use the `slug` from the URL (e.g., `acme.techlearn.com`) to fetch branding.
- **Endpoint**: `GET /organization/:slug`
- **Usage**: Retrieve `logoUrl` and `themeConfig` (primary/secondary colors) to dynamically style the UI.

---

## 3. Specialized API Endpoints

| Category | Endpoint | Method | Purpose |
| :--- | :--- | :--- | :--- |
| **Payments** | `/payment/initialize` | POST | Starts Paystack transaction (Nigeria). |
| **Exams** | `/assessment/proctored/start` | POST | Locks the browser/session for exams. |
| **Reporting** | `/admin/reports/roi` | GET | (Admin Only) View department progress. |
| **Health** | `/analytics/health` | GET | Get the 0-100 Learner Health Score. |

---

## 4. Error Handling
The API returns standard HTTP status codes:
- `401/403`: Auth issues. Redirect to login.
- `429`: Too many requests. Show a "Slow down" message.
- `400`: Validation error (Zod-based). Check `details` in response for field errors.

---
**TechLearn LMS - Build for Excellence.**
