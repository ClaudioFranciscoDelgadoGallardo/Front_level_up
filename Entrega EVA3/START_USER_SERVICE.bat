@echo off
cls
echo ================================================================
echo   INICIANDO SERVICIO DE USUARIOS - LEVELUP
echo ================================================================
echo.
echo Puerto: 8082
echo Host Supabase: aws-1-us-east-1.pooler.supabase.com
echo.
echo Presiona Ctrl+C para detener el servicio
echo ================================================================
echo.

cd /d "%~dp0LevelUp_User_service"

echo Limpiando puerto 8082...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8082') do (
    echo Deteniendo proceso %%a
    taskkill /F /PID %%a 2>nul
)

timeout /t 2 /nobreak >nul

echo.
echo Iniciando servicio...
echo.

call mvnw.cmd spring-boot:run

pause

