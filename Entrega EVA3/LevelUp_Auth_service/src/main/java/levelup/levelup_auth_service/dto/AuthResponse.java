package levelup.levelup_auth_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {

    private String token;
    private String tipo;
    private Long id;
    private String run;
    private String nombre;
    private String apellidos;
    private String correo;
    private String telefono;
    private String direccion;
    private String comuna;
    private String ciudad;
    private String region;
    private String codigoPostal;
    private LocalDate fechaNacimiento;
    private String fotoPerfil;
    private String rol;
    private String mensaje;
}

