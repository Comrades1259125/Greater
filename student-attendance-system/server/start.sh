#!/bin/bash

# Set environment variables
export DATABASE_URL="postgresql://postgres:password@localhost:5432/attendance_db"
export JWT_SECRET="your-super-secret-jwt-key-change-in-production"
export PORT=5000
export NODE_ENV=development
export CLIENT_URL="http://localhost:3000"

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Push database schema
echo "Pushing database schema..."
npx prisma db push

# Start the server
echo "Starting server..."
npm run dev