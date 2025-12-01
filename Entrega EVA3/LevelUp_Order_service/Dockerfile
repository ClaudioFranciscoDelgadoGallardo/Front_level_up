FROM eclipse-temurin:17-jre

# Configurar zona horaria
ENV TZ=America/Santiago
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Crear directorio de la aplicación
WORKDIR /app

# Copiar el JAR compilado
COPY target/LevelUp_Order_service-0.0.1-SNAPSHOT.jar app.jar

# Exponer el puerto
EXPOSE 8084

# Ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "-Duser.timezone=America/Santiago", "app.jar"]
