# Restart Backend Script
# Kills any process using port 5000 and starts the backend

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Backend Restart Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if port 5000 is in use
Write-Host "Checking port 5000..." -ForegroundColor Yellow
$port5000 = netstat -ano | findstr :5000

if ($port5000) {
    Write-Host "Port 5000 is in use. Killing process..." -ForegroundColor Yellow
    
    # Extract PID from netstat output
    $lines = $port5000 -split "`n"
    foreach ($line in $lines) {
        if ($line -match '\s+(\d+)\s*$') {
            $pid = $matches[1]
            Write-Host "Killing process $pid..." -ForegroundColor Yellow
            taskkill /PID $pid /F 2>$null
        }
    }
    
    Start-Sleep -Seconds 1
    Write-Host "✓ Port 5000 is now free" -ForegroundColor Green
} else {
    Write-Host "✓ Port 5000 is already free" -ForegroundColor Green
}

Write-Host ""
Write-Host "Starting backend server..." -ForegroundColor Yellow
Write-Host ""

# Start the backend
npm start
