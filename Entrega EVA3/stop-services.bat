@echo off
echo ========================================
echo Level Up - Deteniendo Microservicios
echo ========================================
echo.

echo Cerrando todos los procesos de Java...
taskkill /F /IM java.exe /T 2>nul

if %ERRORLEVEL% EQU 0 (
    echo.
    echo Servicios detenidos exitosamente
) else (
    echo.
    echo No se encontraron servicios ejecutandose
)

echo.
pause

