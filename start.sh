#!/bin/bash

# Running update
git pull

# Check if npm is installed
if ! command -v npm &> /dev/null
then
    echo "npm is not installed or not in the PATH."
    exit 1
fi

# Check if bun is installed
if ! command -v bun &> /dev/null
then
    echo "bun is not installed or not in the PATH."
    # Install bun using curl
    bash <(curl -fsSL https://bun.sh/install)
fi

# Check if node_modules folder exists
if [ -d "node_modules" ]; then
    echo "node_modules directory exists."
else
    echo "node_modules directory does not exist. Running npm install..."
    npm install
fi

# Running the script with bun
bun run index.ts
