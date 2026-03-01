# =====================================================
# Import 10 Scheduled Exams - PowerShell Script
# =====================================================

Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host " Import 10 Scheduled Exams" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "This script will:" -ForegroundColor Yellow
Write-Host "1. Create missing courses (CS102, EC101, EC201, CIV101, MBA101)" -ForegroundColor Yellow
Write-Host "2. Create 10 exams with Published status" -ForegroundColor Yellow
Write-Host ""
Write-Host "Make sure MySQL is running before continuing!" -ForegroundColor Red
Write-Host ""
Read-Host "Press Enter to continue"

# Step 1: Create missing courses
Write-Host ""
Write-Host "Step 1: Creating missing courses..." -ForegroundColor Green
$result1 = & mysql -u root -p exam_management_system -e "source database/insert_missing_courses.sql" 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "ERROR: Failed to create courses!" -ForegroundColor Red
    Write-Host "Please check your MySQL connection and try again." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Step 2: Create 10 exams
Write-Host ""
Write-Host "Step 2: Creating 10 exams..." -ForegroundColor Green
$result2 = & mysql -u root -p exam_management_system -e "source database/insert_10_scheduled_exams.sql" 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "ERROR: Failed to create exams!" -ForegroundColor Red
    Write-Host "Please check the error message above." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Success message
Write-Host ""
Write-Host "=====================================================" -ForegroundColor Green
Write-Host " SUCCESS! 10 Exams Created" -ForegroundColor Green
Write-Host "=====================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Open your browser" -ForegroundColor White
Write-Host "2. Go to Exam Management module" -ForegroundColor White
Write-Host "3. Verify all 10 exams are visible with Published status" -ForegroundColor White
Write-Host "4. Add questions to each exam" -ForegroundColor White
Write-Host "5. Assign exams to students" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to exit"
