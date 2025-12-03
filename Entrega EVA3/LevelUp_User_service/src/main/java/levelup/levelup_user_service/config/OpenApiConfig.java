package levelup.levelup_user_service.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Value("${server.port:8082}")
    private String serverPort;

    @Bean
    public OpenAPI userServiceOpenAPI() {
        final String securitySchemeName = "bearerAuth";
        
        return new OpenAPI()
            .info(new Info()
                .title("LevelUp - User Service API")
                .description("""
                    API REST para la gestión de usuarios, autenticación y autorización del sistema Level Up.
                    
                    **Funcionalidades principales:**
                    - Registro y autenticación de usuarios
                    - Gestión de perfiles (Cliente, Admin, Vendedor, Bodeguero)
                    - Control de acceso basado en roles (RBAC)
                    - Gestión de sesiones y tokens JWT
                    
                    **Autenticación:**
                    - Los endpoints públicos no requieren autenticación
                    - Endpoints protegidos requieren token JWT en header Authorization
                    - Formato: `Authorization: Bearer <token>`
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
                    .description("User Service - Local"),
                new Server()
                    .url("http://localhost:8080/api/usuarios")
                    .description("Gateway - Local")))
            .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
            .components(new Components()
                .addSecuritySchemes(securitySchemeName,
                    new SecurityScheme()
                        .name(securitySchemeName)
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT")
                        .description("JWT token obtenido del endpoint /api/usuarios/login")));
    }
}
