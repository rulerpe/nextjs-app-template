#!/bin/bash

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "Error: .env.local file not found"
    exit 1
fi

# Source the environment variables
source .env.local

# Verify required environment variables
required_vars=(
    "NEXT_PUBLIC_FIREBASE_API_KEY"
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID"
)

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "Error: $var is not set in .env.local"
        exit 1
    fi
done

# Echo the values for verification (remove in production)
echo "Deploying with:"
echo "API Key: $NEXT_PUBLIC_FIREBASE_API_KEY"
echo "Auth Domain: $NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
echo "Project ID: $NEXT_PUBLIC_FIREBASE_PROJECT_ID"

# Submit the build with all necessary substitutions
gcloud builds submit --config cloudbuild.yaml \
  --substitutions=_NEXT_PUBLIC_FIREBASE_API_KEY="$NEXT_PUBLIC_FIREBASE_API_KEY",\
_NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",\
_NEXT_PUBLIC_FIREBASE_PROJECT_ID="$NEXT_PUBLIC_FIREBASE_PROJECT_ID" 