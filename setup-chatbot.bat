@echo off
REM Chatbot Setup Script for Virtual Assessment Platform (Windows)
REM This script sets up the chatbot feature

echo ==========================================
echo   Chatbot Setup - Virtual Assessment
echo ==========================================
echo.

REM Check if .env exists
if not exist "backend\.env" (
    echo Error: backend\.env file not found!
    echo Please create backend\.env file first.
    pause
    exit /b 1
)

echo Step 1: Creating chat_messages table...
echo.
echo Please enter your MySQL credentials:
set /p DB_USER="MySQL Username: "
set /p DB_PASSWORD="MySQL Password: "
set /p DB_NAME="Database Name: "

mysql -u %DB_USER% -p%DB_PASSWORD% %DB_NAME% < database\chatbot_migration.sql

if %errorlevel% equ 0 (
    echo [SUCCESS] Database table created successfully!
) else (
    echo [ERROR] Failed to create database table
    pause
    exit /b 1
)

echo.
echo Step 2: Verifying backend files...

if exist "backend\src\controllers\chatbotController.js" (
    if exist "backend\src\routes\chatbotRoutes.js" (
        if exist "backend\src\models\ChatMessage.js" (
            echo [SUCCESS] Backend files verified!
        ) else (
            echo [ERROR] ChatMessage.js is missing
            pause
            exit /b 1
        )
    ) else (
        echo [ERROR] chatbotRoutes.js is missing
        pause
        exit /b 1
    )
) else (
    echo [ERROR] chatbotController.js is missing
    pause
    exit /b 1
)

echo.
echo Step 3: Verifying frontend files...

if exist "frontend\src\components\Chatbot.js" (
    if exist "frontend\src\components\Chatbot.css" (
        echo [SUCCESS] Frontend files verified!
    ) else (
        echo [ERROR] Chatbot.css is missing
        pause
        exit /b 1
    )
) else (
    echo [ERROR] Chatbot.js is missing
    pause
    exit /b 1
)

echo.
echo Step 4: Checking server.js integration...

findstr /C:"chatbotRoutes" backend\src\server.js >nul
if %errorlevel% equ 0 (
    echo [SUCCESS] Chatbot routes integrated in server.js!
) else (
    echo [ERROR] Chatbot routes not found in server.js
    echo Please add the following to backend\src\server.js:
    echo   const chatbotRoutes = require('./routes/chatbotRoutes');
    echo   app.use('/api/chatbot', chatbotRoutes);
    pause
    exit /b 1
)

echo.
echo Step 5: Checking App.js integration...

findstr /C:"Chatbot" frontend\src\App.js >nul
if %errorlevel% equ 0 (
    echo [SUCCESS] Chatbot component integrated in App.js!
) else (
    echo [ERROR] Chatbot component not found in App.js
    echo Please add the following to frontend\src\App.js:
    echo   import Chatbot from './components/Chatbot';
    echo   {isAuthenticated ^&^& ^<Chatbot /^>}
    pause
    exit /b 1
)

echo.
echo ==========================================
echo   [SUCCESS] Chatbot Setup Complete!
echo ==========================================
echo.
echo Next steps:
echo 1. Restart your backend server: cd backend ^&^& npm run dev
echo 2. Restart your frontend: cd frontend ^&^& npm start
echo 3. Login to the platform
echo 4. Look for the chat button in the bottom-right corner
echo.
echo For more information, see CHATBOT_GUIDE.md
echo.
pause
