# Kill port 5000 and restart backend
Write-Host "Killing process on port 5000..." -ForegroundColor Yellow

try {
    $process = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
    if ($process) {
        Stop-Process -Id $process -Force
        Write-Host "✓ Process killed" -ForegroundColor Green
        Start-Sleep -Seconds 1
    } else {
        Write-Host "No process found on port 5000" -ForegroundColor Gray
    }
} catch {
    Write-Host "No process to kill" -ForegroundColor Gray
}

Write-Host "`nStarting backend server..." -ForegroundColor Yellow
npm start
