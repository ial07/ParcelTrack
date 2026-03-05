# ParcelTrack — Product Requirement Document (PRD)

**Version:** 1.0  
**Date:** March 5, 2026  
**Author:** Engineering Team  
**Status:** Draft  
**Project Type:** Fullstack Mini Project — Portfolio Showcase

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Goals of the Product](#2-goals-of-the-product)
3. [Target Users](#3-target-users)
4. [Core Features](#4-core-features)
5. [User Flow](#5-user-flow)
6. [Functional Requirements](#6-functional-requirements)
7. [Non-Functional Requirements](#7-non-functional-requirements)
8. [System Architecture](#8-system-architecture)
9. [Frontend Folder Structure](#9-frontend-folder-structure)
10. [Backend Folder Structure](#10-backend-folder-structure)
11. [Database Design](#11-database-design)
12. [API Design](#12-api-design)
13. [Swagger Documentation](#13-swagger-documentation)
14. [Admin Dashboard UI](#14-admin-dashboard-ui)
15. [Parcel Tracking UI](#15-parcel-tracking-ui)
16. [Performance Optimization](#16-performance-optimization)
17. [Deployment Architecture](#17-deployment-architecture)
18. [Environment Variables](#18-environment-variables)
19. [Future Enhancements](#19-future-enhancements)

---

## 1. Product Overview

**ParcelTrack** is a logistics parcel tracking system that simulates the core operations of a simplified Third-Party Logistics (3PL) platform. The system provides two primary interfaces:

- **Public Tracking Interface** — Allows any user to track a parcel using a unique tracking number. The interface displays real-time parcel information, current status, and a full delivery timeline history.
- **Admin Dashboard** — A secure, authenticated portal for logistics administrators to manage the entire lifecycle of parcels, including creation, status updates, warehouse management, and operational analytics.

The system models the real-world flow of a logistics operation: a parcel is created and assigned to a warehouse and courier, then progresses through defined status milestones (e.g., Picked Up → In Transit → Out for Delivery → Delivered). Each status transition is recorded as an immutable timeline entry, providing full auditability.

ParcelTrack is designed as a **portfolio project** to demonstrate strong fullstack engineering practices, clean architecture, separation of concerns, and the ability to build production-grade systems with modern technology stacks.

---

## 2. Goals of the Product

### 2.1 Technical Goals

| Goal                               | Description                                                                                                                                               |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Fullstack Architecture**         | Demonstrate decoupled frontend/backend architecture communicating via REST API                                                                            |
| **Separation of Concerns**         | Enforce layered architecture on both frontend (pages, components, hooks, services, types) and backend (controllers, services, repositories, DTOs, models) |
| **API-First Design**               | Build a fully documented REST API with Swagger/OpenAPI specification                                                                                      |
| **Authentication & Authorization** | Implement secure admin authentication using Laravel Sanctum token-based auth                                                                              |
| **Database Design**                | Design a normalized relational schema with proper relationships, indexes, and constraints                                                                 |
| **State Management**               | Use TanStack Query for server-state management with intelligent caching and invalidation                                                                  |
| **Code Quality**                   | Enforce code formatting (Laravel Pint), validation (Zod + Form Requests), and typing (TypeScript)                                                         |

### 2.2 Product Goals

- Simulate a real-world 3PL parcel tracking workflow end-to-end.
- Provide a responsive, intuitive public tracking interface.
- Deliver an admin dashboard with actionable metrics and efficient CRUD operations.
- Serve as a reference architecture for fullstack Laravel + Next.js projects.

---

## 3. Target Users

### 3.1 Public User (Unauthenticated)

| Attribute        | Detail                                                            |
| ---------------- | ----------------------------------------------------------------- |
| **Role**         | End consumer or recipient tracking a parcel                       |
| **Access Level** | Public — no authentication required                               |
| **Actions**      | Enter tracking number → View parcel details, status, and timeline |
| **Device**       | Desktop and mobile browsers                                       |

### 3.2 Admin User (Authenticated)

| Attribute        | Detail                                                                               |
| ---------------- | ------------------------------------------------------------------------------------ |
| **Role**         | Logistics administrator managing parcels and operations                              |
| **Access Level** | Authenticated via login — protected routes                                           |
| **Actions**      | View dashboard metrics, create/edit parcels, update parcel status, manage warehouses |
| **Device**       | Primarily desktop browser                                                            |

---

## 4. Core Features

### 4.1 Parcel Tracking (Public)

| Item              | Description                                                                                                                                                              |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Input**         | Single text field for tracking number (format: `PT-XXXXXXXX`)                                                                                                            |
| **Output**        | Parcel detail card + vertical delivery timeline                                                                                                                          |
| **Details Shown** | Sender name, receiver name, receiver address, origin warehouse, destination warehouse, courier name, current status, estimated delivery date, weight, parcel description |
| **Timeline**      | Chronological list of all status changes with timestamp, status label, location, and optional notes                                                                      |
| **Error States**  | Invalid format warning, tracking number not found message                                                                                                                |

### 4.2 Parcel Timeline History

Each parcel maintains an **immutable audit trail** stored in the `parcel_status_histories` table. Every status transition creates a new record containing:

- Status enum value (e.g., `PICKED_UP`, `IN_TRANSIT`)
- Timestamp of the status change
- Location/warehouse where the event occurred
- Optional notes (e.g., "Delayed due to weather")
- The admin user who triggered the change

### 4.3 Admin Dashboard Metrics

The dashboard home page displays aggregated KPI cards:

| Metric               | Calculation                                  |
| -------------------- | -------------------------------------------- |
| **Total Parcels**    | `COUNT(parcels)`                             |
| **In Transit**       | `COUNT(parcels WHERE status = 'IN_TRANSIT')` |
| **Delivered**        | `COUNT(parcels WHERE status = 'DELIVERED')`  |
| **Pending Pickup**   | `COUNT(parcels WHERE status = 'PENDING')`    |
| **Total Warehouses** | `COUNT(warehouses)`                          |
| **Active Couriers**  | `COUNT(couriers WHERE is_active = true)`     |

### 4.4 Parcel Management (Admin)

| Action            | Description                                                                                                                                                    |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **List Parcels**  | Paginated, filterable, and sortable table (by status, date, warehouse)                                                                                         |
| **Create Parcel** | Form with fields: sender name, receiver name, receiver address, receiver phone, weight, description, origin warehouse, destination warehouse, assigned courier |
| **View Parcel**   | Detail page showing all parcel info + timeline                                                                                                                 |
| **Update Status** | Dropdown to select new status + notes field → creates timeline entry                                                                                           |

### 4.5 Warehouse Management (Admin)

| Action               | Description                                                                                   |
| -------------------- | --------------------------------------------------------------------------------------------- |
| **List Warehouses**  | Table showing all warehouses with name, code, address, city, and active status                |
| **Create Warehouse** | Form with fields: name, code (unique), address, city, province, postal code, phone, is_active |
| **Edit Warehouse**   | Modify warehouse details                                                                      |

### 4.6 Authentication (Admin)

| Item                 | Description                                                                    |
| -------------------- | ------------------------------------------------------------------------------ |
| **Method**           | Laravel Sanctum token-based authentication                                     |
| **Login**            | Email + password → returns Bearer token                                        |
| **Logout**           | Invalidates token on server                                                    |
| **Protected Routes** | All `/api/admin/*` endpoints require `Authorization: Bearer <token>` header    |
| **Frontend Guard**   | Next.js middleware checks for stored token and redirects unauthenticated users |

### 4.7 Public Tracking API

A single public REST endpoint:

```
GET /api/track/{tracking_number}
```

Returns parcel details + full status history. No authentication required. Rate-limited to prevent abuse.

---

## 5. User Flow

### 5.1 Public User: Tracking a Parcel

```
1. User opens the ParcelTrack homepage
2. User enters tracking number (e.g., PT-2A8F3C91) into the search field
3. Frontend validates format using Zod schema
4. Frontend sends GET /api/track/{tracking_number} via Axios
5. TanStack Query caches the result
6. UI displays:
   a. Parcel Information Card (sender, receiver, weight, description)
   b. Current Status Badge (e.g., "In Transit")
   c. Delivery Timeline (vertical stepper with all status history)
7. If tracking number not found → show "Parcel not found" message
```

### 5.2 Admin: Creating a Parcel

```
1. Admin logs in via /admin/login
2. Navigates to /admin/parcels → clicks "Create Parcel" button
3. Fills out form (validated by React Hook Form + Zod):
   - Sender name, receiver name, receiver address, receiver phone
   - Weight (kg), description
   - Select origin warehouse (dropdown)
   - Select destination warehouse (dropdown)
   - Select courier (dropdown)
4. Submits form → POST /api/admin/parcels
5. Backend:
   a. Validates via FormRequest
   b. Service generates tracking number (PT-XXXXXXXX)
   c. Creates parcel record
   d. Creates initial status history entry (status: PENDING)
   e. Returns parcel data with tracking number
6. Frontend invalidates parcels query cache
7. Redirects to parcel list with success toast
```

### 5.3 Admin: Updating Parcel Status

```
1. Admin navigates to /admin/parcels/{id}
2. Clicks "Update Status" button
3. Dialog opens with:
   - Current status display
   - New status dropdown (only valid next statuses shown)
   - Location field (auto-filled based on warehouse)
   - Notes textarea (optional)
4. Submits → POST /api/admin/parcels/{id}/status
5. Backend:
   a. Validates status transition is valid
   b. Updates parcel current_status
   c. Creates new parcel_status_histories record
   d. Returns updated parcel
6. Frontend invalidates parcel detail + list caches
7. Timeline updates in real-time on the page
```

### 5.4 Admin: Viewing Dashboard Analytics

```
1. Admin logs in → lands on /admin/dashboard
2. TanStack Query fetches GET /api/admin/dashboard/metrics
3. Dashboard renders:
   a. Row of KPI Metric Cards (Total Parcels, In Transit, Delivered, etc.)
   b. Recent Parcels Table (latest 10 parcels)
   c. Warehouse Summary Table
4. Data auto-refreshes every 30 seconds via refetchInterval
5. Admin can click any parcel row to navigate to its detail page
```

---

## 6. Functional Requirements

### 6.1 Authentication

| ID         | Requirement                                                                      |
| ---------- | -------------------------------------------------------------------------------- |
| FR-AUTH-01 | System shall allow admin to log in using email and password                      |
| FR-AUTH-02 | System shall issue a Sanctum Bearer token on successful login                    |
| FR-AUTH-03 | System shall invalidate the token on logout                                      |
| FR-AUTH-04 | System shall reject all admin API requests without a valid token (401)           |
| FR-AUTH-05 | System shall return the authenticated user's profile on `GET /api/admin/profile` |

### 6.2 Parcel Management

| ID           | Requirement                                                                                            |
| ------------ | ------------------------------------------------------------------------------------------------------ |
| FR-PARCEL-01 | System shall generate a unique tracking number in format `PT-XXXXXXXX` (8 alphanumeric characters)     |
| FR-PARCEL-02 | System shall create a parcel with sender, receiver, warehouse, and courier associations                |
| FR-PARCEL-03 | System shall list parcels with pagination (default 15 per page)                                        |
| FR-PARCEL-04 | System shall support filtering parcels by: status, origin warehouse, destination warehouse, date range |
| FR-PARCEL-05 | System shall support sorting parcels by: created_at, tracking_number, status                           |
| FR-PARCEL-06 | System shall allow updating parcel status with valid state transitions only                            |
| FR-PARCEL-07 | System shall record every status change as an immutable history entry                                  |

### 6.3 Warehouse Management

| ID       | Requirement                                                     |
| -------- | --------------------------------------------------------------- |
| FR-WH-01 | System shall allow admin to create a warehouse with unique code |
| FR-WH-02 | System shall list all warehouses with pagination                |
| FR-WH-03 | System shall allow editing warehouse details                    |
| FR-WH-04 | System shall support soft-deleting (deactivating) warehouses    |

### 6.4 Public Tracking

| ID          | Requirement                                                                    |
| ----------- | ------------------------------------------------------------------------------ |
| FR-TRACK-01 | System shall allow tracking a parcel by tracking number without authentication |
| FR-TRACK-02 | System shall return parcel details and full status history                     |
| FR-TRACK-03 | System shall return 404 for non-existent tracking numbers                      |
| FR-TRACK-04 | System shall rate-limit public tracking API to 30 requests per minute per IP   |

### 6.5 Dashboard

| ID         | Requirement                                                       |
| ---------- | ----------------------------------------------------------------- |
| FR-DASH-01 | System shall display aggregated parcel metrics (total, by status) |
| FR-DASH-02 | System shall display the 10 most recent parcels                   |
| FR-DASH-03 | System shall display warehouse summary (total, active count)      |

---

## 7. Non-Functional Requirements

### 7.1 Performance

| ID          | Requirement                                      | Target  |
| ----------- | ------------------------------------------------ | ------- |
| NFR-PERF-01 | API response time for single resource            | ≤ 200ms |
| NFR-PERF-02 | API response time for list endpoints (paginated) | ≤ 500ms |
| NFR-PERF-03 | Public tracking API response time                | ≤ 300ms |
| NFR-PERF-04 | Frontend initial page load (LCP)                 | ≤ 2.5s  |
| NFR-PERF-05 | Frontend subsequent navigation (client-side)     | ≤ 500ms |

### 7.2 Security

| ID         | Requirement                                                              |
| ---------- | ------------------------------------------------------------------------ |
| NFR-SEC-01 | All admin endpoints must require valid Sanctum token                     |
| NFR-SEC-02 | Passwords must be hashed using bcrypt (min cost 12)                      |
| NFR-SEC-03 | API must enforce CORS policy allowing only the frontend origin           |
| NFR-SEC-04 | SQL injection prevention via Eloquent ORM parameterized queries          |
| NFR-SEC-05 | XSS prevention via React's automatic escaping + server-side sanitization |
| NFR-SEC-06 | Rate limiting on authentication endpoints (5 attempts per minute)        |

### 7.3 Scalability

| ID           | Requirement                                                                    |
| ------------ | ------------------------------------------------------------------------------ |
| NFR-SCALE-01 | Database schema must support indexing on frequently queried columns            |
| NFR-SCALE-02 | API pagination must be enforced on all list endpoints                          |
| NFR-SCALE-03 | Repository pattern enables swapping data sources without service layer changes |
| NFR-SCALE-04 | Redis caching layer can be enabled for frequently accessed data                |

### 7.4 Data Integrity

| ID          | Requirement                                                               |
| ----------- | ------------------------------------------------------------------------- |
| NFR-DATA-01 | Foreign key constraints must be enforced at the database level            |
| NFR-DATA-02 | Parcel status history must be append-only (no updates or deletes)         |
| NFR-DATA-03 | Tracking numbers must be unique (unique index)                            |
| NFR-DATA-04 | All timestamps must be stored in UTC                                      |
| NFR-DATA-05 | Soft deletes on warehouses and couriers to preserve referential integrity |

---

## 8. System Architecture

### 8.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                                │
│                                                                     │
│   ┌──────────────────────────────────────────────────────────────┐  │
│   │              Next.js Frontend (App Router)                   │  │
│   │                                                              │  │
│   │  ┌──────────┐  ┌──────────┐  ┌───────────┐  ┌───────────┐  │  │
│   │  │  Pages   │  │   UI     │  │  Hooks    │  │ Services  │  │  │
│   │  │ (Routes) │→ │Components│← │(TanStack  │← │ (Axios    │  │  │
│   │  │          │  │(ShadCN)  │  │  Query)   │  │  API)     │  │  │
│   │  └──────────┘  └──────────┘  └───────────┘  └─────┬─────┘  │  │
│   └──────────────────────────────────────────────────────┼───────┘  │
│                                                          │          │
│                                    REST API (JSON) ──────┘          │
└──────────────────────────────────────┬──────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         SERVER LAYER                                │
│                                                                     │
│   ┌──────────────────────────────────────────────────────────────┐  │
│   │                Laravel Backend (API)                         │  │
│   │                                                              │  │
│   │  ┌───────────┐  ┌──────────┐  ┌────────────┐  ┌─────────┐  │  │
│   │  │Controllers│→ │ Services │→ │Repositories│→ │ Models  │  │  │
│   │  │           │  │          │  │            │  │(Eloquent│  │  │
│   │  │ Request   │  │   DTO    │  │   Query    │  │   ORM)  │  │  │
│   │  │Validation │  │  (Data)  │  │  Builder   │  │         │  │  │
│   │  └───────────┘  └──────────┘  └────────────┘  └────┬────┘  │  │
│   └─────────────────────────────────────────────────────┼───────┘  │
│                                                          │          │
└──────────────────────────────────────┬──────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         DATA LAYER                                  │
│                                                                     │
│   ┌──────────────────┐    ┌───────────────────┐                    │
│   │    MySQL 8.0     │    │  Redis (Optional) │                    │
│   │                  │    │                   │                    │
│   │  - users         │    │  - Query cache    │                    │
│   │  - parcels       │    │  - Session store  │                    │
│   │  - parcel_       │    │  - Rate limiting  │                    │
│   │    status_       │    │                   │                    │
│   │    histories     │    └───────────────────┘                    │
│   │  - warehouses    │                                             │
│   │  - couriers      │                                             │
│   └──────────────────┘                                             │
└─────────────────────────────────────────────────────────────────────┘
```

### 8.2 Frontend Architecture Layers

| Layer              | Responsibility                                                     | Location      |
| ------------------ | ------------------------------------------------------------------ | ------------- |
| **Pages (Routes)** | Route definitions, page-level layouts, data fetching orchestration | `app/`        |
| **UI Components**  | Reusable presentational components built on ShadCN UI              | `components/` |
| **Hooks**          | Custom React hooks wrapping TanStack Query for data operations     | `hooks/`      |
| **Services**       | Axios-based API client functions (1 function per API endpoint)     | `services/`   |
| **Lib**            | Utility functions, Axios instance config, query client setup       | `lib/`        |
| **Types**          | TypeScript interfaces and Zod schemas                              | `types/`      |

**Data Flow (Frontend):**

```
Page → Component → Hook (useQuery/useMutation) → Service (Axios) → REST API
```

### 8.3 Backend Architecture Layers

| Layer                  | Responsibility                                                       | Location                    |
| ---------------------- | -------------------------------------------------------------------- | --------------------------- |
| **Controller**         | Receive HTTP request, delegate to service, return response           | `app/Http/Controllers/Api/` |
| **Request Validation** | Validate and authorize incoming requests using Form Requests         | `app/Http/Requests/`        |
| **Service**            | Business logic, orchestration, transaction management                | `app/Services/`             |
| **Repository**         | Data access abstraction, Eloquent queries, Spatie Query Builder      | `app/Repositories/`         |
| **DTO (Data)**         | Data Transfer Objects using `spatie/laravel-data` for type-safe data | `app/Data/`                 |
| **Model**              | Eloquent models with relationships, casts, and scopes                | `app/Models/`               |
| **Enum**               | PHP 8.1 backed enums for status values and constants                 | `app/Enums/`                |

**Data Flow (Backend):**

```
Route → Middleware → FormRequest → Controller → Service → Repository → Model → DB
                                       ↓
                                      DTO (response shaping)
```

### 8.4 Communication Protocol

- **Protocol:** REST over HTTPS
- **Data Format:** JSON
- **Authentication:** Bearer token in `Authorization` header
- **Pagination:** Cursor-based or offset pagination using `?page=X&per_page=Y`
- **Filtering:** Query parameters via Spatie Query Builder (`?filter[status]=IN_TRANSIT`)
- **Sorting:** Query parameter `?sort=-created_at` (prefix `-` for descending)
- **Error Format:**

```json
{
  "success": false,
  "message": "The given data was invalid.",
  "errors": {
    "field_name": ["Error message"]
  }
}
```

### 8.5 State Management (TanStack Query)

| Concept                | Implementation                                                                  |
| ---------------------- | ------------------------------------------------------------------------------- |
| **Query Keys**         | Structured arrays: `['parcels']`, `['parcels', id]`, `['parcels', { filters }]` |
| **Stale Time**         | 60 seconds for list data, 30 seconds for dashboard metrics                      |
| **Cache Invalidation** | On mutation success, invalidate related query keys                              |
| **Optimistic Updates** | Not required for v1 — standard invalidation is sufficient                       |
| **Error Handling**     | Global error handler via QueryClient `onError` callback                         |
| **Loading States**     | `isPending`, `isFetching` used for skeleton loaders and spinners                |

---

## 9. Frontend Folder Structure

```
frontend/
├── app/                              # Next.js App Router
│   ├── layout.tsx                    # Root layout (providers, fonts, metadata)
│   ├── page.tsx                      # Public homepage — tracking interface
│   ├── track/
│   │   └── [trackingNumber]/
│   │       └── page.tsx              # Tracking result page
│   ├── admin/
│   │   ├── layout.tsx                # Admin layout (sidebar, auth guard)
│   │   ├── login/
│   │   │   └── page.tsx              # Admin login page
│   │   ├── dashboard/
│   │   │   └── page.tsx              # Dashboard with metrics
│   │   ├── parcels/
│   │   │   ├── page.tsx              # Parcel list
│   │   │   ├── create/
│   │   │   │   └── page.tsx          # Create parcel form
│   │   │   └── [id]/
│   │   │       └── page.tsx          # Parcel detail + status update
│   │   └── warehouses/
│   │       ├── page.tsx              # Warehouse list
│   │       └── create/
│   │           └── page.tsx          # Create warehouse form
│   └── globals.css                   # Tailwind CSS global styles
│
├── components/                       # Reusable UI Components
│   ├── ui/                           # ShadCN UI primitives
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   ├── select.tsx
│   │   ├── table.tsx
│   │   ├── badge.tsx
│   │   ├── skeleton.tsx
│   │   ├── toast.tsx
│   │   └── ...
│   ├── layout/                       # Layout components
│   │   ├── Sidebar.tsx
│   │   ├── Navbar.tsx
│   │   └── AdminGuard.tsx
│   ├── tracking/                     # Tracking feature components
│   │   ├── TrackingSearchForm.tsx
│   │   ├── ParcelInfoCard.tsx
│   │   └── DeliveryTimeline.tsx
│   ├── parcels/                      # Parcel feature components
│   │   ├── ParcelTable.tsx
│   │   ├── ParcelForm.tsx
│   │   ├── ParcelStatusBadge.tsx
│   │   └── UpdateStatusDialog.tsx
│   ├── warehouses/                   # Warehouse feature components
│   │   ├── WarehouseTable.tsx
│   │   └── WarehouseForm.tsx
│   └── dashboard/                    # Dashboard components
│       ├── MetricCard.tsx
│       └── RecentParcelsTable.tsx
│
├── hooks/                            # Custom React Hooks (TanStack Query)
│   ├── useAuth.ts                    # Login, logout, profile queries
│   ├── useParcels.ts                 # Parcel list, detail, create, status update
│   ├── useWarehouses.ts             # Warehouse list, create, update
│   ├── useCouriers.ts               # Courier list query
│   ├── useDashboard.ts              # Dashboard metrics query
│   └── useTracking.ts               # Public tracking query
│
├── services/                         # API Service Layer (Axios)
│   ├── authService.ts               # login(), logout(), getProfile()
│   ├── parcelService.ts             # getParcels(), getParcel(), createParcel(), updateStatus()
│   ├── warehouseService.ts          # getWarehouses(), createWarehouse(), updateWarehouse()
│   ├── courierService.ts            # getCouriers()
│   ├── dashboardService.ts          # getDashboardMetrics()
│   └── trackingService.ts           # trackParcel()
│
├── lib/                              # Utilities and Configuration
│   ├── axios.ts                      # Axios instance with baseURL, interceptors, token injection
│   ├── queryClient.ts               # TanStack QueryClient configuration
│   ├── utils.ts                      # Helper functions (cn, formatDate, etc.)
│   └── constants.ts                 # App-wide constants
│
├── types/                            # TypeScript Types & Zod Schemas
│   ├── auth.ts                       # LoginRequest, User, AuthResponse
│   ├── parcel.ts                     # Parcel, ParcelFormData, ParcelFilters
│   ├── warehouse.ts                 # Warehouse, WarehouseFormData
│   ├── courier.ts                    # Courier
│   ├── tracking.ts                  # TrackingResult, StatusHistory
│   ├── dashboard.ts                 # DashboardMetrics
│   └── api.ts                        # ApiResponse<T>, PaginatedResponse<T>, ApiError
│
├── middleware.ts                     # Next.js middleware for auth route protection
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
├── package.json
└── components.json                   # ShadCN UI configuration
```

---

## 10. Backend Folder Structure

```
backend/
├── app/
│   ├── Console/
│   │   └── Commands/
│   │       └── GenerateTrackingNumber.php    # Artisan command (utility)
│   │
│   ├── Data/                                  # DTOs (spatie/laravel-data)
│   │   ├── ParcelData.php
│   │   ├── ParcelStatusHistoryData.php
│   │   ├── WarehouseData.php
│   │   ├── CourierData.php
│   │   ├── DashboardMetricsData.php
│   │   └── UserData.php
│   │
│   ├── Enums/                                 # PHP 8.1 Backed Enums
│   │   ├── ParcelStatus.php                   # PENDING, PICKED_UP, IN_TRANSIT, etc.
│   │   └── UserRole.php                       # ADMIN, SUPER_ADMIN
│   │
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Api/
│   │   │       ├── AuthController.php         # login, logout, profile
│   │   │       ├── ParcelController.php       # CRUD + status update
│   │   │       ├── WarehouseController.php    # CRUD
│   │   │       ├── CourierController.php      # List couriers
│   │   │       ├── DashboardController.php    # Metrics endpoint
│   │   │       └── TrackingController.php     # Public tracking
│   │   │
│   │   ├── Middleware/
│   │   │   └── ForceJsonResponse.php          # Ensure JSON responses
│   │   │
│   │   └── Requests/                          # Form Request Validation
│   │       ├── Auth/
│   │       │   └── LoginRequest.php
│   │       ├── Parcel/
│   │       │   ├── StoreParcelRequest.php
│   │       │   └── UpdateParcelStatusRequest.php
│   │       └── Warehouse/
│   │           ├── StoreWarehouseRequest.php
│   │           └── UpdateWarehouseRequest.php
│   │
│   ├── Models/                                # Eloquent Models
│   │   ├── User.php
│   │   ├── Parcel.php
│   │   ├── ParcelStatusHistory.php
│   │   ├── Warehouse.php
│   │   └── Courier.php
│   │
│   ├── Repositories/                          # Repository Layer
│   │   ├── Contracts/                         # Repository Interfaces
│   │   │   ├── ParcelRepositoryInterface.php
│   │   │   ├── WarehouseRepositoryInterface.php
│   │   │   └── CourierRepositoryInterface.php
│   │   ├── ParcelRepository.php
│   │   ├── WarehouseRepository.php
│   │   └── CourierRepository.php
│   │
│   ├── Services/                              # Business Logic Layer
│   │   ├── AuthService.php
│   │   ├── ParcelService.php
│   │   ├── WarehouseService.php
│   │   ├── CourierService.php
│   │   ├── DashboardService.php
│   │   └── TrackingService.php
│   │
│   └── Providers/
│       └── RepositoryServiceProvider.php      # Bind interfaces to implementations
│
├── config/
│   ├── l5-swagger.php                         # Swagger/OpenAPI configuration
│   ├── sanctum.php                            # Sanctum configuration
│   └── telescope.php                          # Telescope configuration
│
├── database/
│   ├── migrations/
│   │   ├── 2024_01_01_000001_create_users_table.php
│   │   ├── 2024_01_01_000002_create_warehouses_table.php
│   │   ├── 2024_01_01_000003_create_couriers_table.php
│   │   ├── 2024_01_01_000004_create_parcels_table.php
│   │   └── 2024_01_01_000005_create_parcel_status_histories_table.php
│   │
│   ├── seeders/
│   │   ├── DatabaseSeeder.php
│   │   ├── AdminUserSeeder.php
│   │   ├── WarehouseSeeder.php
│   │   ├── CourierSeeder.php
│   │   └── ParcelSeeder.php
│   │
│   └── factories/
│       ├── ParcelFactory.php
│       ├── WarehouseFactory.php
│       └── CourierFactory.php
│
├── routes/
│   └── api.php                                # All API route definitions
│
├── tests/
│   ├── Feature/
│   │   ├── AuthTest.php
│   │   ├── ParcelTest.php
│   │   ├── WarehouseTest.php
│   │   └── TrackingTest.php
│   └── Unit/
│       ├── ParcelServiceTest.php
│       └── TrackingServiceTest.php
│
├── .env.example
├── composer.json
├── pint.json                                  # Laravel Pint configuration
└── phpunit.xml
```

---

## 11. Database Design

### 11.1 Entity Relationship Diagram

```
┌──────────────┐     ┌───────────────────┐     ┌────────────────────────────┐
│    users     │     │     parcels       │     │  parcel_status_histories   │
├──────────────┤     ├───────────────────┤     ├────────────────────────────┤
│ id (PK)      │────▶│ id (PK)           │────▶│ id (PK)                   │
│ name         │     │ tracking_number   │     │ parcel_id (FK)             │
│ email        │     │ sender_name       │     │ status (enum)              │
│ password     │     │ receiver_name     │     │ location                   │
│ role (enum)  │     │ receiver_address  │     │ notes                      │
│ created_at   │     │ receiver_phone    │     │ changed_by (FK → users)    │
│ updated_at   │     │ weight            │     │ created_at                 │
└──────────────┘     │ description       │     └────────────────────────────┘
                     │ current_status    │
┌──────────────┐     │ estimated_delivery│     ┌──────────────┐
│  warehouses  │     │ origin_wh_id (FK) │     │   couriers   │
├──────────────┤     │ dest_wh_id (FK)   │     ├──────────────┤
│ id (PK)      │◀────│ courier_id (FK)   │────▶│ id (PK)      │
│ name         │     │ created_at        │     │ name         │
│ code         │     │ updated_at        │     │ phone        │
│ address      │     └───────────────────┘     │ email        │
│ city         │                               │ vehicle_type │
│ province     │                               │ is_active    │
│ postal_code  │                               │ created_at   │
│ phone        │                               │ updated_at   │
│ is_active    │                               │ deleted_at   │
│ created_at   │                               └──────────────┘
│ updated_at   │
│ deleted_at   │
└──────────────┘
```

### 11.2 Table: `users`

| Column              | Type                          | Constraints               | Description                  |
| ------------------- | ----------------------------- | ------------------------- | ---------------------------- |
| `id`                | `BIGINT UNSIGNED`             | PK, AUTO_INCREMENT        | Primary key                  |
| `name`              | `VARCHAR(255)`                | NOT NULL                  | Full name                    |
| `email`             | `VARCHAR(255)`                | NOT NULL, UNIQUE          | Login email                  |
| `password`          | `VARCHAR(255)`                | NOT NULL                  | Bcrypt hashed password       |
| `role`              | `ENUM('admin','super_admin')` | NOT NULL, DEFAULT 'admin' | User role                    |
| `email_verified_at` | `TIMESTAMP`                   | NULLABLE                  | Email verification timestamp |
| `remember_token`    | `VARCHAR(100)`                | NULLABLE                  | Session remember token       |
| `created_at`        | `TIMESTAMP`                   | NOT NULL                  | Record creation time         |
| `updated_at`        | `TIMESTAMP`                   | NOT NULL                  | Last update time             |

**Indexes:** `UNIQUE(email)`

### 11.3 Table: `warehouses`

| Column        | Type              | Constraints            | Description                             |
| ------------- | ----------------- | ---------------------- | --------------------------------------- |
| `id`          | `BIGINT UNSIGNED` | PK, AUTO_INCREMENT     | Primary key                             |
| `name`        | `VARCHAR(255)`    | NOT NULL               | Warehouse name                          |
| `code`        | `VARCHAR(20)`     | NOT NULL, UNIQUE       | Unique warehouse code (e.g., WH-JKT-01) |
| `address`     | `TEXT`            | NOT NULL               | Full street address                     |
| `city`        | `VARCHAR(100)`    | NOT NULL               | City name                               |
| `province`    | `VARCHAR(100)`    | NOT NULL               | Province/state                          |
| `postal_code` | `VARCHAR(10)`     | NOT NULL               | Postal/ZIP code                         |
| `phone`       | `VARCHAR(20)`     | NULLABLE               | Contact phone                           |
| `is_active`   | `BOOLEAN`         | NOT NULL, DEFAULT true | Active status                           |
| `created_at`  | `TIMESTAMP`       | NOT NULL               | Record creation time                    |
| `updated_at`  | `TIMESTAMP`       | NOT NULL               | Last update time                        |
| `deleted_at`  | `TIMESTAMP`       | NULLABLE               | Soft delete timestamp                   |

**Indexes:** `UNIQUE(code)`, `INDEX(city)`, `INDEX(is_active)`

### 11.4 Table: `couriers`

| Column         | Type              | Constraints            | Description                           |
| -------------- | ----------------- | ---------------------- | ------------------------------------- |
| `id`           | `BIGINT UNSIGNED` | PK, AUTO_INCREMENT     | Primary key                           |
| `name`         | `VARCHAR(255)`    | NOT NULL               | Courier full name                     |
| `phone`        | `VARCHAR(20)`     | NOT NULL               | Contact phone number                  |
| `email`        | `VARCHAR(255)`    | NULLABLE, UNIQUE       | Email address                         |
| `vehicle_type` | `VARCHAR(50)`     | NOT NULL               | Vehicle type (motorcycle, van, truck) |
| `is_active`    | `BOOLEAN`         | NOT NULL, DEFAULT true | Active status                         |
| `created_at`   | `TIMESTAMP`       | NOT NULL               | Record creation time                  |
| `updated_at`   | `TIMESTAMP`       | NOT NULL               | Last update time                      |
| `deleted_at`   | `TIMESTAMP`       | NULLABLE               | Soft delete timestamp                 |

**Indexes:** `INDEX(is_active)`

### 11.5 Table: `parcels`

| Column                     | Type              | Constraints                 | Description                 |
| -------------------------- | ----------------- | --------------------------- | --------------------------- |
| `id`                       | `BIGINT UNSIGNED` | PK, AUTO_INCREMENT          | Primary key                 |
| `tracking_number`          | `VARCHAR(20)`     | NOT NULL, UNIQUE            | Format: PT-XXXXXXXX         |
| `sender_name`              | `VARCHAR(255)`    | NOT NULL                    | Sender full name            |
| `receiver_name`            | `VARCHAR(255)`    | NOT NULL                    | Receiver full name          |
| `receiver_address`         | `TEXT`            | NOT NULL                    | Delivery address            |
| `receiver_phone`           | `VARCHAR(20)`     | NOT NULL                    | Receiver contact phone      |
| `weight`                   | `DECIMAL(8,2)`    | NOT NULL                    | Weight in kilograms         |
| `description`              | `TEXT`            | NULLABLE                    | Parcel contents description |
| `current_status`           | `ENUM(...)`       | NOT NULL, DEFAULT 'PENDING' | Current parcel status       |
| `estimated_delivery`       | `DATE`            | NULLABLE                    | Estimated delivery date     |
| `origin_warehouse_id`      | `BIGINT UNSIGNED` | FK → warehouses.id          | Origin warehouse            |
| `destination_warehouse_id` | `BIGINT UNSIGNED` | FK → warehouses.id          | Destination warehouse       |
| `courier_id`               | `BIGINT UNSIGNED` | FK → couriers.id, NULLABLE  | Assigned courier            |
| `created_at`               | `TIMESTAMP`       | NOT NULL                    | Record creation time        |
| `updated_at`               | `TIMESTAMP`       | NOT NULL                    | Last update time            |

**Indexes:** `UNIQUE(tracking_number)`, `INDEX(current_status)`, `INDEX(origin_warehouse_id)`, `INDEX(destination_warehouse_id)`, `INDEX(courier_id)`, `INDEX(created_at)`

**Status Enum Values:**

```php
enum ParcelStatus: string
{
    case PENDING = 'PENDING';
    case PICKED_UP = 'PICKED_UP';
    case IN_WAREHOUSE = 'IN_WAREHOUSE';
    case IN_TRANSIT = 'IN_TRANSIT';
    case OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY';
    case DELIVERED = 'DELIVERED';
    case RETURNED = 'RETURNED';
    case CANCELLED = 'CANCELLED';
}
```

**Valid Status Transitions:**

```
PENDING → PICKED_UP
PICKED_UP → IN_WAREHOUSE
IN_WAREHOUSE → IN_TRANSIT
IN_TRANSIT → OUT_FOR_DELIVERY
IN_TRANSIT → IN_WAREHOUSE (transfer between warehouses)
OUT_FOR_DELIVERY → DELIVERED
OUT_FOR_DELIVERY → RETURNED
Any status → CANCELLED (except DELIVERED)
```

### 11.6 Table: `parcel_status_histories`

| Column       | Type              | Constraints               | Description                                 |
| ------------ | ----------------- | ------------------------- | ------------------------------------------- |
| `id`         | `BIGINT UNSIGNED` | PK, AUTO_INCREMENT        | Primary key                                 |
| `parcel_id`  | `BIGINT UNSIGNED` | FK → parcels.id, NOT NULL | Associated parcel                           |
| `status`     | `ENUM(...)`       | NOT NULL                  | Status at this point                        |
| `location`   | `VARCHAR(255)`    | NULLABLE                  | Location/warehouse where event occurred     |
| `notes`      | `TEXT`            | NULLABLE                  | Additional notes                            |
| `changed_by` | `BIGINT UNSIGNED` | FK → users.id, NULLABLE   | Admin who made the change (null for system) |
| `created_at` | `TIMESTAMP`       | NOT NULL                  | When the status change occurred             |

**Indexes:** `INDEX(parcel_id, created_at)`, `INDEX(status)`

> **Note:** This table is **append-only**. No UPDATE or DELETE operations are allowed. This ensures complete auditability of parcel movements.

---

## 12. API Design

### 12.1 Base URL

```
Production:  https://api.parceltrack.example.com/api
Development: http://localhost:8000/api
```

### 12.2 Authentication Endpoints

#### `POST /api/auth/login`

Authenticates an admin user and returns a Sanctum Bearer token.

**Request Body:**

```json
{
  "email": "admin@parceltrack.com",
  "password": "password123"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "Admin User",
      "email": "admin@parceltrack.com",
      "role": "admin"
    },
    "token": "1|abc123def456...",
    "token_type": "Bearer"
  }
}
```

**Error Response (401):**

```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

#### `POST /api/auth/logout`

**Headers:** `Authorization: Bearer <token>`

**Success Response (200):**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### 12.3 Public Tracking Endpoint

#### `GET /api/track/{tracking_number}`

Returns parcel details and full status history. No authentication required.

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "tracking_number": "PT-2A8F3C91",
    "sender_name": "PT Logistics Indonesia",
    "receiver_name": "John Doe",
    "receiver_address": "Jl. Sudirman No. 45, Jakarta",
    "weight": 2.5,
    "description": "Electronic components",
    "current_status": "IN_TRANSIT",
    "estimated_delivery": "2026-03-10",
    "origin_warehouse": {
      "name": "Jakarta Main Hub",
      "code": "WH-JKT-01",
      "city": "Jakarta"
    },
    "destination_warehouse": {
      "name": "Surabaya Distribution Center",
      "code": "WH-SBY-01",
      "city": "Surabaya"
    },
    "courier": {
      "name": "Ahmad Delivery",
      "vehicle_type": "van"
    },
    "status_history": [
      {
        "status": "PENDING",
        "location": "Jakarta Main Hub",
        "notes": "Parcel registered in system",
        "created_at": "2026-03-05T09:00:00Z"
      },
      {
        "status": "PICKED_UP",
        "location": "Jakarta Main Hub",
        "notes": "Parcel picked up from sender",
        "created_at": "2026-03-05T14:30:00Z"
      },
      {
        "status": "IN_WAREHOUSE",
        "location": "Jakarta Main Hub",
        "notes": "Received at warehouse for processing",
        "created_at": "2026-03-06T08:00:00Z"
      },
      {
        "status": "IN_TRANSIT",
        "location": "En route to Surabaya",
        "notes": "Dispatched via land freight",
        "created_at": "2026-03-06T16:00:00Z"
      }
    ]
  }
}
```

**Error Response (404):**

```json
{
  "success": false,
  "message": "Parcel not found"
}
```

### 12.4 Admin Parcel Endpoints

All admin endpoints require `Authorization: Bearer <token>` header.

#### `GET /api/admin/parcels`

List parcels with filtering, sorting, and pagination.

**Query Parameters:**

| Parameter                          | Type   | Example       | Description                      |
| ---------------------------------- | ------ | ------------- | -------------------------------- |
| `filter[current_status]`           | string | `IN_TRANSIT`  | Filter by status                 |
| `filter[origin_warehouse_id]`      | int    | `1`           | Filter by origin warehouse       |
| `filter[destination_warehouse_id]` | int    | `2`           | Filter by destination            |
| `filter[created_at_from]`          | date   | `2026-03-01`  | Created after date               |
| `filter[created_at_to]`            | date   | `2026-03-31`  | Created before date              |
| `sort`                             | string | `-created_at` | Sort field (prefix `-` for desc) |
| `page`                             | int    | `1`           | Page number                      |
| `per_page`                         | int    | `15`          | Items per page                   |

**Success Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "tracking_number": "PT-2A8F3C91",
      "sender_name": "PT Logistics Indonesia",
      "receiver_name": "John Doe",
      "current_status": "IN_TRANSIT",
      "weight": 2.5,
      "origin_warehouse": { "id": 1, "name": "Jakarta Main Hub" },
      "destination_warehouse": { "id": 2, "name": "Surabaya DC" },
      "courier": { "id": 1, "name": "Ahmad Delivery" },
      "created_at": "2026-03-05T09:00:00Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 15,
    "total": 72
  }
}
```

#### `POST /api/admin/parcels`

Create a new parcel.

**Request Body:**

```json
{
  "sender_name": "PT Logistics Indonesia",
  "receiver_name": "John Doe",
  "receiver_address": "Jl. Sudirman No. 45, Jakarta",
  "receiver_phone": "+6281234567890",
  "weight": 2.5,
  "description": "Electronic components",
  "estimated_delivery": "2026-03-10",
  "origin_warehouse_id": 1,
  "destination_warehouse_id": 2,
  "courier_id": 1
}
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "Parcel created successfully",
  "data": {
    "id": 15,
    "tracking_number": "PT-7B3E9F42",
    "current_status": "PENDING",
    "created_at": "2026-03-05T09:00:00Z"
  }
}
```

#### `GET /api/admin/parcels/{id}`

Get detailed parcel information including status history.

#### `POST /api/admin/parcels/{id}/status`

Update parcel status (creates a new history entry).

**Request Body:**

```json
{
  "status": "IN_TRANSIT",
  "location": "En route to Surabaya",
  "notes": "Dispatched via land freight"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Status updated successfully",
  "data": {
    "id": 15,
    "tracking_number": "PT-7B3E9F42",
    "current_status": "IN_TRANSIT",
    "latest_history": {
      "status": "IN_TRANSIT",
      "location": "En route to Surabaya",
      "notes": "Dispatched via land freight",
      "created_at": "2026-03-06T16:00:00Z"
    }
  }
}
```

### 12.5 Warehouse Endpoints

#### `GET /api/admin/warehouses`

List all warehouses. Supports filtering by `city`, `is_active`, and sorting.

**Success Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Jakarta Main Hub",
      "code": "WH-JKT-01",
      "address": "Jl. Industri No. 10, Cakung",
      "city": "Jakarta",
      "province": "DKI Jakarta",
      "postal_code": "13910",
      "phone": "+622112345678",
      "is_active": true
    }
  ],
  "meta": { "current_page": 1, "last_page": 1, "per_page": 15, "total": 5 }
}
```

#### `POST /api/admin/warehouses`

Create a new warehouse.

**Request Body:**

```json
{
  "name": "Bandung Storage Center",
  "code": "WH-BDG-01",
  "address": "Jl. Soekarno-Hatta No. 200",
  "city": "Bandung",
  "province": "Jawa Barat",
  "postal_code": "40286",
  "phone": "+622212345678",
  "is_active": true
}
```

### 12.6 Dashboard Endpoint

#### `GET /api/admin/dashboard/metrics`

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "total_parcels": 152,
    "parcels_by_status": {
      "PENDING": 12,
      "PICKED_UP": 8,
      "IN_WAREHOUSE": 15,
      "IN_TRANSIT": 45,
      "OUT_FOR_DELIVERY": 18,
      "DELIVERED": 50,
      "RETURNED": 3,
      "CANCELLED": 1
    },
    "total_warehouses": 5,
    "active_warehouses": 4,
    "total_couriers": 12,
    "active_couriers": 10,
    "recent_parcels": [
      /* latest 10 parcels */
    ]
  }
}
```

### 12.7 API Route Definitions (Laravel)

```php
// routes/api.php

// Public routes
Route::post('/auth/login', [AuthController::class, 'login']);
Route::get('/track/{tracking_number}', [TrackingController::class, 'track']);

// Protected admin routes
Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/profile', [AuthController::class, 'profile']);

    Route::get('/dashboard/metrics', [DashboardController::class, 'metrics']);

    Route::apiResource('parcels', ParcelController::class)->only(['index', 'store', 'show']);
    Route::post('/parcels/{parcel}/status', [ParcelController::class, 'updateStatus']);

    Route::apiResource('warehouses', WarehouseController::class)->only(['index', 'store', 'show', 'update']);

    Route::get('/couriers', [CourierController::class, 'index']);
});
```

---

## 13. Swagger Documentation

### 13.1 Setup

Swagger UI is integrated using the `darkaonline/l5-swagger` package, which auto-generates OpenAPI 3.0 documentation from PHP annotations.

**Installation:**

```bash
composer require darkaonline/l5-swagger
php artisan vendor:publish --provider="L5Swagger\L5SwaggerServiceProvider"
```

**Configuration (`config/l5-swagger.php`):**

```php
'defaults' => [
    'routes' => [
        'api' => 'api/documentation',    // Swagger UI URL
        'docs' => 'docs',
    ],
    'paths' => [
        'docs' => storage_path('api-docs'),
        'annotations' => [
            base_path('app/Http/Controllers/Api'),
            base_path('app/Data'),
        ],
    ],
],
```

### 13.2 Access

| Environment       | URL                                                     |
| ----------------- | ------------------------------------------------------- |
| Local Development | `http://localhost:8000/api/documentation`               |
| Production        | `https://api.parceltrack.example.com/api/documentation` |

### 13.3 Annotation Example

```php
/**
 * @OA\Get(
 *     path="/api/track/{tracking_number}",
 *     summary="Track a parcel by tracking number",
 *     tags={"Public Tracking"},
 *     @OA\Parameter(
 *         name="tracking_number",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="string", example="PT-2A8F3C91")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Parcel found",
 *         @OA\JsonContent(ref="#/components/schemas/TrackingResponse")
 *     ),
 *     @OA\Response(response=404, description="Parcel not found")
 * )
 */
```

### 13.4 Generate Documentation

```bash
php artisan l5-swagger:generate
```

This command scans all annotated controllers and DTO classes to produce the OpenAPI JSON/YAML spec. It should be run after any API changes and can be integrated into CI/CD pipelines.

---

## 14. Admin Dashboard UI

### 14.1 Layout Structure

```
┌──────────────────────────────────────────────────────────────────┐
│  NAVBAR  [ParcelTrack Logo]           [Admin Name] [Logout Btn] │
├────────┬─────────────────────────────────────────────────────────┤
│        │                                                         │
│  S     │  MAIN CONTENT AREA                                     │
│  I     │                                                         │
│  D     │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐        │
│  E     │  │Total │ │In    │ │Deliv │ │Pend  │ │Ware  │        │
│  B     │  │Parcel│ │Transit│ │ered  │ │ing   │ │house │        │
│  A     │  │ 152  │ │  45  │ │  50  │ │  12  │ │   5  │        │
│  R     │  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘        │
│        │                                                         │
│  ───── │  ┌───────────────────────────────────────────────┐     │
│  📊    │  │  RECENT PARCELS TABLE                        │     │
│  Dash  │  │  ┌────┬──────┬─────────┬────────┬──────────┐ │     │
│  📦    │  │  │ #  │Track │Receiver │Status  │ Date     │ │     │
│  Parcel│  │  ├────┼──────┼─────────┼────────┼──────────┤ │     │
│  🏢   │  │  │ 1  │PT-.. │John D.  │Transit │Mar 05    │ │     │
│  Ware  │  │  │ 2  │PT-.. │Jane S.  │Deliver │Mar 04    │ │     │
│        │  │  └────┴──────┴─────────┴────────┴──────────┘ │     │
│        │  └───────────────────────────────────────────────┘     │
│        │                                                         │
│        │  ┌───────────────────────────────────────────────┐     │
│        │  │  WAREHOUSE SUMMARY TABLE                     │     │
│        │  └───────────────────────────────────────────────┘     │
└────────┴─────────────────────────────────────────────────────────┘
```

### 14.2 Components

| Component                 | ShadCN Components Used              | Description                                |
| ------------------------- | ----------------------------------- | ------------------------------------------ |
| **MetricCard**            | `Card`, `CardHeader`, `CardContent` | Displays a KPI with icon, value, and label |
| **RecentParcelsTable**    | `Table`, `Badge`                    | Latest 10 parcels with status badges       |
| **WarehouseSummaryTable** | `Table`                             | All warehouses with active/inactive badges |
| **Sidebar**               | Custom + ShadCN `Button`            | Navigation links with active state         |
| **AdminGuard**            | Custom HOC                          | Redirects if not authenticated             |

### 14.3 Parcel Management Page

- **Parcel List:** `DataTable` with column sorting, status filter dropdown, search by tracking number, pagination controls.
- **Create Parcel:** Full-page form using React Hook Form + Zod. Warehouse and courier fields use searchable `Select` components.
- **Parcel Detail:** Info card + `DeliveryTimeline` component + "Update Status" dialog.

### 14.4 Warehouse Management Page

- **Warehouse List:** Table with columns: Name, Code, City, Province, Active Status, Actions.
- **Create/Edit Warehouse:** Modal or full-page form with React Hook Form + Zod validation.

---

## 15. Parcel Tracking UI

### 15.1 Layout

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                   │
│                    🚚 ParcelTrack                                │
│              Track your parcel in real-time                      │
│                                                                   │
│         ┌────────────────────────────┬──────────┐               │
│         │  Enter tracking number...  │  Track   │               │
│         └────────────────────────────┴──────────┘               │
│                                                                   │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  PARCEL INFORMATION CARD                                 │   │
│  │                                                          │   │
│  │  Tracking: PT-2A8F3C91         Status: [IN TRANSIT]     │   │
│  │                                                          │   │
│  │  From: PT Logistics Indonesia                           │   │
│  │  To:   John Doe                                         │   │
│  │  Address: Jl. Sudirman No. 45, Jakarta                  │   │
│  │  Weight: 2.50 kg                                        │   │
│  │  Est. Delivery: March 10, 2026                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  DELIVERY TIMELINE                                       │   │
│  │                                                          │   │
│  │  ● IN TRANSIT                        Mar 06, 04:00 PM   │   │
│  │  │  En route to Surabaya                                │   │
│  │  │  Dispatched via land freight                         │   │
│  │  │                                                      │   │
│  │  ● IN WAREHOUSE                      Mar 06, 08:00 AM   │   │
│  │  │  Jakarta Main Hub                                    │   │
│  │  │  Received at warehouse for processing                │   │
│  │  │                                                      │   │
│  │  ● PICKED UP                         Mar 05, 02:30 PM   │   │
│  │  │  Jakarta Main Hub                                    │   │
│  │  │  Parcel picked up from sender                        │   │
│  │  │                                                      │   │
│  │  ○ PENDING                            Mar 05, 09:00 AM   │   │
│  │     Parcel registered in system                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 15.2 Components

| Component              | Description                                                                                                                                                                                                 |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **TrackingSearchForm** | Input field with Zod validation for `PT-XXXXXXXX` format + submit button. Uses React Hook Form. On submit, navigates to `/track/{trackingNumber}` or fetches inline.                                        |
| **ParcelInfoCard**     | Displays sender, receiver, weight, description, status badge, and estimated delivery. Uses ShadCN `Card` and `Badge`.                                                                                       |
| **DeliveryTimeline**   | Vertical stepper showing all status history entries. Latest status has filled circle (●), past statuses have outlined circles (○). Each entry shows status label, location, notes, and formatted timestamp. |

### 15.3 Responsive Design

- **Mobile:** Single column layout. Timeline entries stack vertically. Search bar is full-width.
- **Tablet:** Same as mobile with slightly larger padding.
- **Desktop:** Centered content with max-width constraint (e.g., `max-w-3xl`).

---

## 16. Performance Optimization

### 16.1 Backend Optimization

| Strategy               | Implementation                                                                                                                                                   |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Database Indexes**   | Composite index on `parcel_status_histories(parcel_id, created_at)`. Single indexes on `parcels.tracking_number`, `parcels.current_status`, `parcels.created_at` |
| **Eager Loading**      | Use `with()` to prevent N+1 queries: `Parcel::with(['originWarehouse', 'destinationWarehouse', 'courier', 'statusHistories'])`                                   |
| **Repository Pattern** | Centralize queries in repositories using Spatie Query Builder for consistent, optimized list queries                                                             |
| **Redis Caching**      | Cache dashboard metrics (TTL: 60s), warehouse list (TTL: 300s). Use `Cache::remember()` with tagged caching                                                      |
| **Query Builder**      | Use Spatie Laravel Query Builder for efficient filtering and sorting without manual query assembly                                                               |
| **Queue Jobs**         | Use Laravel Queue for notification emails on status changes (future enhancement). Driver: database or Redis                                                      |
| **Pagination**         | Enforce server-side pagination on all list endpoints. Default: 15, Max: 100                                                                                      |

### 16.2 Frontend Optimization

| Strategy                   | Implementation                                                                                                          |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **TanStack Query Caching** | `staleTime: 60000` for list data, `gcTime: 300000` for garbage collection. Prevent redundant API calls on navigation    |
| **Query Invalidation**     | Targeted invalidation: `queryClient.invalidateQueries({ queryKey: ['parcels'] })` after mutations                       |
| **Lazy Loading**           | Use `next/dynamic` for heavy components (e.g., admin pages). Code splitting at route level is automatic with App Router |
| **Skeleton Loading**       | Display `Skeleton` components (ShadCN) while data is loading for better perceived performance                           |
| **Image Optimization**     | Use `next/image` for any image assets                                                                                   |
| **Font Optimization**      | Use `next/font` for Google Fonts (Inter) with `display: swap`                                                           |
| **Debounced Search**       | Debounce tracking number input (300ms) to prevent excessive API calls during typing                                     |

---

## 17. Deployment Architecture

### 17.1 Architecture Diagram

```
┌───────────────┐   HTTPS    ┌───────────────────┐   REST API   ┌────────────────┐
│               │ ─────────▶ │                   │ ───────────▶ │                │
│   Browser     │            │  Vercel (CDN)     │              │  VPS Server    │
│   (Client)    │ ◀───────── │  Next.js Frontend │ ◀─────────── │  Laravel API   │
│               │   HTML/JS  │                   │   JSON       │                │
└───────────────┘            └───────────────────┘              └───────┬────────┘
                                                                        │
                                                               ┌───────┴────────┐
                                                               │                │
                                                               │  MySQL 8.0    │
                                                               │  (Remote DB)  │
                                                               │                │
                                                               └───────┬────────┘
                                                                       │
                                                               ┌───────┴────────┐
                                                               │  Redis         │
                                                               │  (Optional)    │
                                                               └────────────────┘
```

### 17.2 Deployment Details

| Component    | Platform                          | Details                                                                                                                    |
| ------------ | --------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Frontend** | Vercel                            | Auto-deploy on `git push` to main branch. Environment variables set in Vercel dashboard. Uses Edge Network for global CDN. |
| **Backend**  | VPS (e.g., DigitalOcean, Hetzner) | Ubuntu 22.04, Nginx, PHP 8.2-FPM, Supervisor for queue workers. Deploy via SSH + Git pull or CI/CD pipeline.               |
| **Database** | Remote MySQL                      | Can use managed MySQL (e.g., PlanetScale, DigitalOcean Managed DB) or self-hosted on VPS. SSL connection enforced.         |
| **Redis**    | Same VPS or managed               | Optional. Used for caching, queue driver, and rate limiting.                                                               |
| **SSL**      | Let's Encrypt                     | Auto-renewed via Certbot on VPS. Vercel provides SSL automatically.                                                        |

### 17.3 CI/CD Pipeline (Recommended)

```
1. Developer pushes to GitHub
2. GitHub Actions triggers:
   a. Run Laravel Pint (code style)
   b. Run PHPUnit tests
   c. Run ESLint + TypeScript check on frontend
3. On merge to main:
   a. Frontend: Vercel auto-deploys
   b. Backend: SSH into VPS → git pull → composer install → migrate → cache
```

---

## 18. Environment Variables

### 18.1 Frontend (`.env.local`)

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_NAME=ParcelTrack
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 18.2 Backend (`.env`)

```env
# Application
APP_NAME=ParcelTrack
APP_ENV=local
APP_KEY=base64:...
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=parceltrack
DB_USERNAME=root
DB_PASSWORD=secret

# Sanctum
SANCTUM_STATEFUL_DOMAINS=localhost:3000
SESSION_DOMAIN=localhost

# CORS
FRONTEND_URL=http://localhost:3000

# Redis (Optional)
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

# Cache
CACHE_DRIVER=file           # Change to 'redis' if Redis is available

# Queue
QUEUE_CONNECTION=database    # Change to 'redis' if Redis is available

# Telescope
TELESCOPE_ENABLED=true

# Swagger
L5_SWAGGER_GENERATE_ALWAYS=true
L5_SWAGGER_CONST_HOST=http://localhost:8000/api
```

---

## 19. Future Enhancements

### 19.1 Planned Features

| Feature                           | Description                                                                                                                                           | Complexity |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| **Realtime Tracking (WebSocket)** | Use Laravel Reverb or Pusher with Laravel Echo on the frontend to push live status updates to the tracking page without polling                       | High       |
| **Courier Integration API**       | Expose webhook endpoints for third-party couriers to push status updates automatically (e.g., JNE, J&T integration)                                   | Medium     |
| **Map Visualization**             | Integrate Mapbox or Google Maps to display warehouse locations and estimated parcel routes on the tracking page                                       | Medium     |
| **QR Code Parcel Label**          | Generate printable QR code labels containing the tracking number. Use `simple-qrcode` package on Laravel. Scannable QR redirects to the tracking page | Low        |
| **Email Notifications**           | Send email notifications to receivers on key status changes (picked up, out for delivery, delivered) using Laravel Queue + Mailgun/SES                | Medium     |
| **Bulk Parcel Import**            | Allow admin to upload CSV files to create multiple parcels at once using Laravel Queue for background processing                                      | Medium     |
| **Multi-role Authorization**      | Extend user roles (warehouse_staff, courier, super_admin) with granular permissions using `spatie/laravel-permission`                                 | Medium     |
| **Analytics Dashboard**           | Add charts (daily parcel volume, delivery success rate, average delivery time) using Chart.js or Recharts on the frontend                             | Medium     |
| **Mobile App**                    | Build a React Native or Flutter mobile app for couriers to scan QR codes and update parcel status on-the-go                                           | High       |

### 19.2 Technical Debt Considerations

- Add comprehensive unit and integration test coverage (target: 80%)
- Implement API versioning (`/api/v1/...`) for backward compatibility
- Add structured logging with Laravel Log channels
- Implement database backup automation
- Set up monitoring and alerting (e.g., Laravel Pulse, Sentry)

---

## Appendix

### A. Technology Stack Summary

| Layer                  | Technology                     | Version  |
| ---------------------- | ------------------------------ | -------- |
| **Frontend Framework** | Next.js (App Router)           | 14.x+    |
| **CSS Framework**      | Tailwind CSS                   | 3.x      |
| **UI Components**      | ShadCN UI                      | Latest   |
| **State Management**   | TanStack Query (React Query)   | 5.x      |
| **HTTP Client**        | Axios                          | 1.x      |
| **Form Management**    | React Hook Form                | 7.x      |
| **Validation**         | Zod                            | 3.x      |
| **Backend Framework**  | Laravel                        | 11.x     |
| **Database**           | MySQL                          | 8.0      |
| **Authentication**     | Laravel Sanctum                | 4.x      |
| **API Documentation**  | L5-Swagger (OpenAPI 3.0)       | 8.x      |
| **Query Builder**      | Spatie Laravel Query Builder   | 5.x      |
| **DTO**                | Spatie Laravel Data            | 4.x      |
| **Code Formatting**    | Laravel Pint                   | 1.x      |
| **Debugging**          | Laravel Telescope              | 5.x      |
| **Queue**              | Laravel Queue (database/Redis) | Built-in |
| **Caching**            | Redis (optional)               | 7.x      |
| **Language**           | PHP 8.2+, TypeScript 5.x       | —        |

### B. Glossary

| Term                | Definition                                                                                       |
| ------------------- | ------------------------------------------------------------------------------------------------ |
| **3PL**             | Third-Party Logistics — a company that provides outsourced logistics services                    |
| **Tracking Number** | Unique identifier for a parcel (format: PT-XXXXXXXX)                                             |
| **Status History**  | Chronological record of all status changes for a parcel                                          |
| **DTO**             | Data Transfer Object — a structured object for transferring data between layers                  |
| **SoC**             | Separation of Concerns — architectural principle ensuring each layer has a single responsibility |
| **Bearer Token**    | An authentication token included in HTTP headers for API access                                  |

---

_End of Document_
