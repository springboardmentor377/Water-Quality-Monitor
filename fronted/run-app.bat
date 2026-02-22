@echo off
cd /d "%~dp0"
echo Starting Water Quality Monitor frontend...
echo.
set BROWSER=none
npm start
pause
