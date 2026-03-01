# MySQL Crash Fix Guide

## Current Issue
MySQL starts successfully but shuts down immediately after "Server socket created on IP: '::'"

## Diagnosis
The error log shows MySQL initializes properly but stops without error messages. This indicates an external cause.

## Solutions (Try in Order)

### Solution 1: Run XAMPP as Administrator
1. Close XAMPP Control Panel completely
2. Right-click on XAMPP Control Panel
3. Select "Run as Administrator"
4. Try starting MySQL again

### Solution 2: Check Windows Event Viewer
1. Press `Win + R`
2. Type `eventvwr.msc` and press Enter
3. Go to: Windows Logs → Application
4. Look for recent errors related to MySQL or MariaDB
5. Note any error codes or messages

### Solution 3: Disable Antivirus Temporarily
1. Temporarily disable your antivirus
2. Try starting MySQL
3. If it works, add these to antivirus exceptions:
   - `C:\xampp\mysql\bin\mysqld.exe`
   - `C:\xampp\mysql\data\` (entire folder)

### Solution 4: Check for Conflicting Services
Run these commands in Command Prompt (as Administrator):

```cmd
sc query | findstr /i "mysql"
sc query | findstr /i "mariadb"
```

If you see other MySQL/MariaDB services, stop them:
```cmd
net stop "ServiceName"
```

### Solution 5: Reset MySQL Configuration
1. Backup your database first!
2. Navigate to: `C:\xampp\mysql\data\`
3. Delete these files:
   - `ib_logfile0`
   - `ib_logfile1`
4. Restart MySQL

### Solution 6: Check my.ini File
1. Open `C:\xampp\mysql\bin\my.ini`
2. Ensure these lines exist under `[mysqld]`:
   ```ini
   [mysqld]
   port=3306
   socket="C:/xampp/mysql/mysql.sock"
   basedir="C:/xampp/mysql"
   tmpdir="C:/xampp/tmp"
   datadir="C:/xampp/mysql/data"
   ```

### Solution 7: Reinstall MySQL Service
Run in Command Prompt as Administrator:

```cmd
cd C:\xampp\mysql\bin
mysqld --remove
mysqld --install
net start mysql
```

### Solution 8: Use Standalone MySQL
If XAMPP MySQL continues to fail, install MySQL separately:

1. Download MySQL Installer: https://dev.mysql.com/downloads/installer/
2. Install MySQL Server
3. Update `backend/.env`:
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_password
   ```

## Quick Test After Fix

Once MySQL starts, verify it's working:

```cmd
# Check if MySQL is running
netstat -ano | findstr :3306

# Test connection
cd C:\xampp\mysql\bin
mysql -u root -p
```

## Most Likely Causes

Based on your log pattern:
1. **Antivirus blocking** (most common)
2. **Windows Firewall**
3. **Insufficient permissions**
4. **System policy preventing service execution**

## Next Steps

1. Try Solution 1 first (Run as Administrator)
2. If that doesn't work, check Event Viewer (Solution 2)
3. Try disabling antivirus temporarily (Solution 3)
4. Report back what you find in Event Viewer
