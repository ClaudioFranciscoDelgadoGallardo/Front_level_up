@echo off
echo ========================================
echo Level Up - Compilacion de Microservicios
echo ========================================
echo.

echo [1/5] Compilando Auth Service...
cd LevelUp_Auth_service
call mvn clean install -DskipTests
if %ERRORLEVEL% NEQ 0 (
    echo Error compilando Auth Service
    pause
    exit /b 1
)
cd ..

echo.
echo [2/5] Compilando User Service...
cd LevelUp_User_service
call mvn clean install -DskipTests
if %ERRORLEVEL% NEQ 0 (
    echo Error compilando User Service
    pause
    exit /b 1
)
cd ..

echo.
echo [3/5] Compilando Product Service...
cd LevelUp_Product_service
call mvn clean install -DskipTests
if %ERRORLEVEL% NEQ 0 (
    echo Error compilando Product Service
    pause
    exit /b 1
)
cd ..

echo.
echo [4/5] Compilando Order Service...
cd LevelUp_Order_service
call mvn clean install -DskipTests
if %ERRORLEVEL% NEQ 0 (
    echo Error compilando Order Service
    pause
    exit /b 1
)
cd ..

echo.
echo [5/5] Compilando API Gateway...
cd LevelUp_Api_gateway
call mvn clean install -DskipTests
if %ERRORLEVEL% NEQ 0 (
    echo Error compilando API Gateway
    pause
    exit /b 1
)
cd ..

echo.
echo ========================================
echo Compilacion completada exitosamente!
echo ========================================
echo.
echo Ahora puedes ejecutar: start-services.bat
pause

