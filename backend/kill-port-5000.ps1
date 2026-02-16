# PowerShell script to kill process on port 5000

Write-Host "🔍 Finding process using port 5000..." -ForegroundColor Yellow

# Find the process using port 5000
$processInfo = netstat -ano | findstr :5000 | findstr LISTENING

if ($processInfo) {
    Write-Host "Found process on port 5000:" -ForegroundColor Green
    Write-Host $processInfo
    
    # Extract PID (last column)
    $pid = ($processInfo -split '\s+')[-1]
    
    Write-Host "`n🎯 Process ID: $pid" -ForegroundColor Cyan
    
    # Get process details
    try {
        $process = Get-Process -Id $pid -ErrorAction Stop
        Write-Host "Process Name: $($process.ProcessName)" -ForegroundColor Cyan
        Write-Host "Process Path: $($process.Path)" -ForegroundColor Cyan
    } catch {
        Write-Host "Could not get process details" -ForegroundColor Yellow
    }
    
    # Kill the process
    Write-Host "`n💀 Killing process $pid..." -ForegroundColor Red
    try {
        Stop-Process -Id $pid -Force
        Write-Host "✅ Process killed successfully!" -ForegroundColor Green
        Write-Host "`n🚀 You can now start your backend server with: npm start" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to kill process. Try running as Administrator." -ForegroundColor Red
        Write-Host "Or manually kill it with: taskkill /PID $pid /F" -ForegroundColor Yellow
    }
} else {
    Write-Host "✅ No process found using port 5000" -ForegroundColor Green
    Write-Host "Port 5000 is available!" -ForegroundColor Green
}

Write-Host "`nPress any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
