package levelup.levelup_order_service.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ordenes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Orden {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "El ID de usuario es obligatorio")
    @Column(name = "usuario_id", nullable = false)
    private Long usuarioId;

    @Column(name = "usuario_nombre", length = 100)
    private String usuarioNombre;

    @Column(name = "usuario_correo", length = 100)
    private String usuarioCorreo;

    @NotNull(message = "El total es obligatorio")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal total;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private EstadoOrden estado = EstadoOrden.PENDIENTE;

    @Column(name = "direccion_envio", length = 255)
    private String direccionEnvio;

    @Column(name = "metodo_pago", length = 50)
    private String metodoPago;

    @OneToMany(mappedBy = "orden", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<DetalleOrden> detalles = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @UpdateTimestamp
    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;

    public enum EstadoOrden {
        PENDIENTE,
        PROCESANDO,
        ENVIADO,
        ENTREGADO,
        CANCELADO
    }

    public void agregarDetalle(DetalleOrden detalle) {
        detalles.add(detalle);
        detalle.setOrden(this);
    }
}

