# Kill Port 5000 and Restart Backend

## Problem
Port 5000 is already in use - another instance of the backend is running.

## Quick Fix - Method 1 (PowerShell Script)

Run this in PowerShell:

```powershell
cd backend
.\kill-and-restart.ps1
```

## Quick Fix - Method 2 (Manual Commands)

### Option A: Using PowerShell
```powershell
# Find process on port 5000
Get-NetTCPConnection -LocalPort 5000 | Select-Object -ExpandProperty OwningProcess -Unique

# Kill the process (replace XXXX with the process ID from above)
Stop-Process -Id XXXX -Force

# Start backend
npm start
```

### Option B: Using CMD
```cmd
# Find process on port 5000
netstat -ano | findstr :5000

# Kill the process (replace XXXX with the PID from above)
taskkill /PID XXXX /F

# Start backend
npm start
```

## Quick Fix - Method 3 (One-Liner)

PowerShell one-liner:
```powershell
Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object { Stop-Process -Id $_ -Force }; npm start
```

## After Killing Port 5000

Once the backend starts successfully, run the database fix:

```bash
# Open a NEW terminal (keep backend running)
cd backend
node fix-all-database-issues.js
```

Then your backend will be ready to use!

## Prevention

To avoid this in the future:
1. Always stop the backend with Ctrl+C before closing the terminal
2. Check if backend is running before starting: `Get-NetTCPConnection -LocalPort 5000`
3. Use the kill-and-restart script when needed
