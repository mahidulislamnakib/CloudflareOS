# Cloudflare Engineering OS - Local Setup Checker
# Run from your project folder in Windows PowerShell:
# powershell -ExecutionPolicy Bypass -File scripts/check-local-setup.ps1

Write-Host "Cloudflare Engineering OS - Local Setup Checker" -ForegroundColor Cyan
Write-Host "This script checks your computer and project. It does not deploy anything." -ForegroundColor Yellow
Write-Host ""

function Test-CommandExists {
  param ([string]$Command)
  $exists = Get-Command $Command -ErrorAction SilentlyContinue
  return $null -ne $exists
}

if (Test-CommandExists "node") {
  Write-Host "OK: Node.js found" -ForegroundColor Green
  node --version
} else {
  Write-Host "MISSING: Node.js is not installed or not available in PATH" -ForegroundColor Red
}

if (Test-CommandExists "npm") {
  Write-Host "OK: npm found" -ForegroundColor Green
  npm --version
} else {
  Write-Host "MISSING: npm is not installed or not available in PATH" -ForegroundColor Red
}

if (Test-CommandExists "git") {
  Write-Host "OK: Git found" -ForegroundColor Green
  git --version
} else {
  Write-Host "MISSING: Git is not installed or not available in PATH" -ForegroundColor Red
}

Write-Host ""
Write-Host "Checking project files..." -ForegroundColor Cyan

if (Test-Path "package.json") {
  Write-Host "OK: package.json found" -ForegroundColor Green
} else {
  Write-Host "MISSING: package.json not found. Are you in the project folder?" -ForegroundColor Red
}

if (Test-Path "wrangler.toml") {
  Write-Host "OK: wrangler.toml found" -ForegroundColor Green
} else {
  Write-Host "NOTICE: wrangler.toml not found. You may not have created Cloudflare config yet." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Checking Wrangler..." -ForegroundColor Cyan
npx wrangler --version

Write-Host ""
Write-Host "Next safe steps:" -ForegroundColor Cyan
Write-Host "1. Run npm install or pnpm install"
Write-Host "2. Run npx wrangler login"
Write-Host "3. Check wrangler.toml bindings"
Write-Host "4. Run npx wrangler dev"
Write-Host "5. Deploy only after local test works"
