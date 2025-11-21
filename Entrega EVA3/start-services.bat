@echo off
echo ========================================
echo Level Up - Iniciando Microservicios
echo ========================================
echo.

echo Configurando variables de entorno...
REM Configura aqui tus credenciales de Supabase
set DB_URL=jdbc:postgresql://localhost:5432/levelup
set DB_USERNAME=postgres
set DB_PASSWORD=postgres
set JWT_SECRET=LevelUpSecretKeyForJWTTokenGeneration2024MustBeLongEnough

echo.
echo IMPORTANTE: Asegurate de configurar las variables de entorno correctas
echo en este archivo antes de ejecutar.
echo.
echo Presiona Ctrl+C para cancelar o cualquier tecla para continuar...
pause > nul

echo.
echo Iniciando Auth Service en puerto 8081...
start "Auth Service" cmd /k "cd LevelUp_Auth_service && mvn spring-boot:run"
timeout /t 5 > nul

echo Iniciando User Service en puerto 8082...
start "User Service" cmd /k "cd LevelUp_User_service && mvn spring-boot:run"
timeout /t 5 > nul

echo Iniciando Product Service en puerto 8083...
start "Product Service" cmd /k "cd LevelUp_Product_service && mvn spring-boot:run"
timeout /t 5 > nul

echo Iniciando Order Service en puerto 8084...
start "Order Service" cmd /k "cd LevelUp_Order_service && mvn spring-boot:run"
timeout /t 5 > nul

echo Iniciando API Gateway en puerto 8080...
start "API Gateway" cmd /k "cd LevelUp_Api_gateway && mvn spring-boot:run"

echo.
echo ========================================
echo Todos los servicios estan iniciando...
echo ========================================
echo.
echo Auth Service:    http://localhost:8081/api/auth/health
echo User Service:    http://localhost:8082
echo Product Service: http://localhost:8083/api/productos/health
echo Order Service:   http://localhost:8084/api/ordenes/health
echo API Gateway:     http://localhost:8080
echo.
echo Espera 30-60 segundos para que todos los servicios esten listos
echo.
pause

