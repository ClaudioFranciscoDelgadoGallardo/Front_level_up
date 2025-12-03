# Dockerfile para microservicio Spring Boot
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

# Copiar archivos Maven
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Dar permisos de ejecución
RUN chmod +x mvnw

# Descargar dependencias
RUN ./mvnw dependency:go-offline -B

# Copiar código fuente
COPY src src

# Compilar aplicación
RUN ./mvnw package -DskipTests

# Etapa de ejecución
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copiar JAR desde etapa de compilación
COPY --from=build /app/target/*.jar app.jar

# Exponer puerto (se configura via environment)
EXPOSE 8080

# Ejecutar aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]
