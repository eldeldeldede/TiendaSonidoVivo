@echo off
REM Instala dependencias (solo la primera vez) y levanta el front en http://localhost:5173
cd /d "%~dp0"
if not exist node_modules call npm install
call npm run dev
