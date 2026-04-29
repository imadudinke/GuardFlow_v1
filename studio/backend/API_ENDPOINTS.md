# GuardFlow Studio API Endpoints

## Clean, Dedicated Endpoints Architecture

Two main resources with clear separation:
1. **Projects API** - Manages projects and settings
2. **Threats API** - Retrieves threat logs for specific projects

---

## 1. Projects API

### GET `/api/v1/projects/user/{user_id}`
**Purpose:** Get all projects for a specific user

**Path Parameters:**
- `user_id` (UUID) - User identifier

**Query Parameters:**
- `skip` (int, default: 0) - Pagination offset
- `limit` (int, default: 100) - Max results

**Response:** `List[Project]`
```json
[
  {
    "id": "uuid",
    "name": "My App",
    "api_key": "gf_live_...",
    "user_id": "uuid"
  }
]
```

**Example:**
```bash
GET /api/v1/projects/user/123e4567-e89b-12d3-a456-426614174000
```

---

## 2. Threats API

### GET `/api/v1/threats`
**Purpose:** Get threat logs for a specific project

**Query Parameters (Required):**
- `project_id` (UUID) - The project to get threats for

**Query Parameters (Optional):**
- `limit` (int, default: 100) - Max results
- `skip` (int, default: 0) - Pagination offset

**Response:** `List[ThreatLog]`
```json
[
  {
    "id": "uuid",
    "project_id": "uuid",
    "ip_address": "192.168.1.1",
    "dna_id": "abc123...",
    "path": "/api/login",
    "country": "United States",
    "risk_score": 75,
    "created_at": "2024-01-15T10:30:00Z"
  }
]
```

**Example:**
```bash
GET /api/v1/threats?project_id=123e4567-e89b-12d3-a456-426614174000&limit=50
```

---

## Usage Flow

### Frontend Implementation Pattern

```typescript
// Step 1: Fetch user's projects
const projects = await fetch(`/api/v1/projects/user/${userId}`);

// Step 2: User selects a project from dropdown
const selectedProjectId = projects[0].id;

// Step 3: Fetch threats for that specific project
const threats = await fetch(`/api/v1/threats?project_id=${selectedProjectId}`);
```

---

## Complete Endpoint List

### Projects
- `GET /api/v1/projects/user/{user_id}` - Get user's projects
- `GET /api/v1/projects/{project_id}` - Get single project
- `POST /api/v1/projects` - Create project
- `PATCH /api/v1/projects/{project_id}` - Update project
- `DELETE /api/v1/projects/{project_id}` - Delete project

### Threats
- `GET /api/v1/threats?project_id={uuid}` - Get threats for project
- `POST /api/v1/telemetry` - SDK endpoint to submit threats

---

## Benefits of This Architecture

1. **Clear Separation**: Projects and threats are separate concerns
2. **Simple Frontend Logic**: 
   - Load projects once
   - Switch between projects to view their threats
3. **Scalable**: Each endpoint does one thing well
4. **Efficient**: Only fetch data for the selected project
5. **Real-time Ready**: Poll threats endpoint for selected project every 5s

---

## Error Responses

### 400 Bad Request
```json
{
  "detail": "project_id is required"
}
```

### 404 Not Found
```json
{
  "detail": "Project not found"
}
```
