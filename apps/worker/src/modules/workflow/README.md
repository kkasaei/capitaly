# NestJS Workflow System with BullMQ

This module provides a workflow processing system using NestJS and BullMQ. It allows you to queue and process workflows asynchronously.

## Features

- Queue individual workflows
- Batch process multiple workflows
- Asynchronous job processing with Redis
- Job status tracking
- Error handling and retries

## Setup

1. Start the Redis server:

```bash
# Start all services
docker-compose up -d
```

2. Start the NestJS application:

```bash
# Navigate to the worker directory
cd apps/worker

# Start the application in development mode
pnpm dev
```

## API Usage

### Process a Single Workflow

```
GET /workflows/:id
```

Example:
```bash
curl -X GET http://localhost:3000/workflows/123
```

Response:
```json
{
  "success": true,
  "message": "Workflow 123 added to queue"
}
```

### Process Multiple Workflows

```
POST /workflows
```

Request body:
```json
[
  { "id": 1 },
  { "id": 2 },
  { "id": 3 }
]
```

Example:
```bash
curl -X POST http://localhost:3000/workflows \
  -H "Content-Type: application/json" \
  -d '[{ "id": 1 }, { "id": 2 }, { "id": 3 }]'
```

Response:
```json
{
  "success": true,
  "message": "3 workflows added to queue",
  "jobId": "job-123"
}
```

## Architecture

- **WorkflowController**: Handles HTTP requests and delegates to the service
- **WorkflowService**: Manages workflow job creation and queuing
- **WorkflowProcessor**: Processes workflow jobs from the queue

## Error Handling

The system includes error handling for:
- Invalid workflow data
- Queue processing failures
- Job timeouts

Jobs that fail can be automatically retried based on the BullMQ configuration.
