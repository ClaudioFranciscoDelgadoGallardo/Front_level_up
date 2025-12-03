package levelup.levelup_api_gateway.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteDefinition;
import org.springframework.cloud.gateway.route.RouteDefinitionLocator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.List;

@Configuration
public class OpenApiConfig {

    @Value("${server.port:8080}")
    private String serverPort;

    @Bean
    public OpenAPI gatewayOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("LevelUp - API Gateway")
                .description("""
                    **Gateway central para todos los microservicios de Level Up E-Commerce**
                    
                    Este API Gateway enruta las peticiones a los siguientes servicios:
                    
                    - **User Service** (puerto 8082): Gestión de usuarios y autenticación
                    - **Product Service** (puerto 8083): Catálogo de productos, categorías y marcas
                    - **Order Service** (puerto 8084): Gestión de órdenes y carritos
                    
                    **Características:**
                    - Enrutamiento dinámico
                    - Balanceo de carga
                    - Manejo de CORS
                    - Circuit breaker
                    
                    **Prefijos de rutas:**
                    - `/api/usuarios` → User Service
                    - `/api/productos`, `/api/categorias`, `/api/marcas` → Product Service
                    - `/api/ordenes`, `/api/carrito` → Order Service
                    """)
                .version("1.0.0")
                .contact(new Contact()
                    .name("Claudio Delgado")
                    .email("claudio.delgado@example.com")
                    .url("https://github.com/ClaudioFranciscoDelgadoGallardo"))
                .license(new License()
                    .name("Apache 2.0")
                    .url("https://www.apache.org/licenses/LICENSE-2.0.html")))
            .servers(List.of(
                new Server()
                    .url("http://localhost:" + serverPort)
                    .description("API Gateway - Local")));
    }

    @Bean
    public GroupedOpenApi userServiceGroup() {
        return GroupedOpenApi.builder()
            .group("1-user-service")
            .pathsToMatch("/api/usuarios/**")
            .build();
    }

    @Bean
    public GroupedOpenApi productServiceGroup() {
        return GroupedOpenApi.builder()
            .group("2-product-service")
            .pathsToMatch("/api/productos/**", "/api/categorias/**", "/api/marcas/**")
            .build();
    }

    @Bean
    public GroupedOpenApi orderServiceGroup() {
        return GroupedOpenApi.builder()
            .group("3-order-service")
            .pathsToMatch("/api/ordenes/**", "/api/carrito/**")
            .build();
    }
}
