#!/bin/sh

set -e

echo "Running database migrations..."

until alembic upgrade head; do
  echo "Database not ready yet. Retrying in 3 seconds..."
  sleep 3
done

echo "Starting FastAPI..."

exec uvicorn app.main:app --host 0.0.0.0 --port 8000