@echo off
echo Starting Pearl's Kitchen...
echo.
echo Starting Database Server...
start /min cmd /c "npx.cmd json-server --watch db.json --port 3000"
timeout /t 3 /nobreak >nul
echo.
echo Opening Restaurant App...
start http://localhost:3000/splash.html
echo.
echo If the app doesn't open automatically, open your browser and go to:
echo http://localhost:3000
pause