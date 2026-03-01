@echo off
echo ========================================
echo MySQL Privilege Tables Repair Script
echo ========================================
echo.

echo Step 1: Stopping any running MySQL processes...
taskkill /F /IM mysqld.exe 2>nul
timeout /t 2 >nul

echo.
echo Step 2: Checking if backup folder exists...
if exist "C:\xampp\mysql\backup" (
    echo Backup folder found!
    echo.
    echo Step 3: Restoring MySQL data from backup...
    
    echo Renaming current data folder...
    if exist "C:\xampp\mysql\data_old" (
        rmdir /s /q "C:\xampp\mysql\data_old"
    )
    rename "C:\xampp\mysql\data" "data_old"
    
    echo Copying backup to data folder...
    xcopy /E /I /Y "C:\xampp\mysql\backup" "C:\xampp\mysql\data"
    
    echo.
    echo ========================================
    echo MySQL data restored from backup!
    echo ========================================
    echo.
    echo Now open XAMPP Control Panel as Administrator and start MySQL.
    echo.
) else (
    echo No backup folder found.
    echo.
    echo Trying alternative fix: Resetting permissions...
    
    echo Taking ownership of data folder...
    takeown /F "C:\xampp\mysql\data" /R /D Y >nul 2>&1
    
    echo Granting full permissions...
    icacls "C:\xampp\mysql\data" /grant %USERNAME%:F /T >nul 2>&1
    
    echo.
    echo ========================================
    echo Permissions reset complete!
    echo ========================================
    echo.
    echo Now try starting MySQL in XAMPP Control Panel (as Administrator).
    echo.
)

echo Press any key to exit...
pause >nul
