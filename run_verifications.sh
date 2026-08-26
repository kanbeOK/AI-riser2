#!/bin/bash
set -e

echo "Running npm 11 verification..."
rm -rf node_modules dist package-lock.json

npx --yes --package npm@11.9.0 npm install --package-lock-only --include=optional
npx --yes --package npm@11.9.0 npm ci
npx --yes --package npm@11.9.0 npm run verify

echo "Running npm 10 verification..."
rm -rf node_modules dist

npx --yes --package npm@10.9.4 npm ci
npx --yes --package npm@10.9.4 npm run verify

echo "Verifications passed"
