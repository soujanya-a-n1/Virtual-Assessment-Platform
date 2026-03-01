@echo off
echo =====================================================
echo  Import 10 Scheduled Exams
echo =====================================================
echo.
echo This script will:
echo 1. Create missing courses (CS102, EC101, EC201, CIV101, MBA101)
echo 2. Create 10 exams with Published status
echo.
echo Make sure MySQL is running before continuing!
echo.
pause

echo.
echo Step 1: Creating missing courses...
mysql -u root -p exam_management_system < database\insert_missing_courses.sql

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to create courses!
    echo Please check your MySQL connection and try again.
    pause
    exit /b 1
)

echo.
echo Step 2: Creating 10 exams...
mysql -u root -p exam_management_system < database\insert_10_scheduled_exams.sql

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to create exams!
    echo Please check the error message above.
    pause
    exit /b 1
)

echo.
echo =====================================================
echo  SUCCESS! 10 Exams Created
echo =====================================================
echo.
echo Next steps:
echo 1. Open your browser
echo 2. Go to Exam Management module
echo 3. Verify all 10 exams are visible with Published status
echo 4. Add questions to each exam
echo 5. Assign exams to students
echo.
pause
