@echo off
echo ==========================================
echo  REINICIO DE USER SERVICE
echo ==========================================
echo.

echo [1/4] Deteniendo procesos Java...
taskkill /F /IM java.exe 2>nul
timeout /t 2 /nobreak >nul

echo [2/4] Verificando puerto 8082...
netstat -ano | findstr :8082
if %ERRORLEVEL% EQU 0 (
    echo Puerto 8082 aun en uso, esperando...
    timeout /t 3 /nobreak >nul
)

echo [3/4] Iniciando User Service...
cd "%~dp0LevelUp_User_service"
start "LevelUp User Service" java -jar target\LevelUp_User_service-0.0.1-SNAPSHOT.jar

echo [4/4] Esperando que el servicio inicie...
timeout /t 10 /nobreak >nul

echo.
echo ==========================================
echo  SERVICIO INICIADO
echo ==========================================
echo.
echo Verifica los logs en la ventana que se abrio
echo El servicio debe estar en: http://localhost:8082
echo.
echo AHORA INTENTA EL LOGIN EN POSTMAN
echo URL: http://localhost:8082/api/usuarios/login
echo.
pause

