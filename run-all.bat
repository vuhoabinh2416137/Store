@echo off
echo ===================================================
echo  KHOI DONG HE THONG WEB BAN HANG (Microservices)
echo ===================================================
echo.
echo Kien truc he thong hien tai:
echo - Frontend: React + Vite + Vanilla CSS (Port 5173)
echo - Backend: Java 17, Spring Boot REST API (Port 8080)
echo - Database: H2 In-Memory Database (Tich hop san)
echo.

:: Fix loi khong tim thay Java tren terminal cua nguoi dung
set "JAVA_HOME=C:\Program Files\Microsoft\jdk-17.0.18.8-hotspot"
set "PATH=%JAVA_HOME%\bin;%PATH%"

echo [1/2] Dang khoi dong Backend Spring Boot...
cd /d "%~dp0\backend"
start "Backend Server" cmd /c ".\gradlew.bat bootRun"

echo [2/2] Dang khoi dong Frontend React Vite...
cd /d "%~dp0\frontend"
start "Frontend Server" cmd /c "npm run dev"

echo.
echo ===================================================
echo  KHOI DONG HOAN TAT!
echo ===================================================
echo - Trang web (Frontend) se chay tai: http://localhost:5173
echo - API Server (Backend) chay tai: http://localhost:8080
echo.
echo * Luu y: Hai cua so dong lenh moi da duoc mo.
echo   De tat he thong, hay dong ca hai cua so do.
echo.
pause
