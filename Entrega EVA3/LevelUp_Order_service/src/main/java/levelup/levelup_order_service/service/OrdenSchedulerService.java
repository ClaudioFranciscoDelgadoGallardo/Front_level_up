package levelup.levelup_order_service.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Servicio que actualiza automáticamente los estados de las órdenes
 * llamando a la función de PostgreSQL/Supabase cada minuto.
 */
@Service
public class OrdenSchedulerService {

    private static final Logger logger = LoggerFactory.getLogger(OrdenSchedulerService.class);

    @PersistenceContext
    private EntityManager entityManager;

    /**
     * Se ejecuta cada 60 segundos para actualizar estados de órdenes
     * llamando a la función de base de datos actualizar_estados_ordenes_activas()
     */
    @Scheduled(fixedRate = 60000) // Cada 60 segundos (1 minuto)
    @Transactional
    public void actualizarEstadosOrdenes() {
        try {
            logger.debug("🔄 Ejecutando actualización automática de estados de órdenes...");
            
            // Llamar a la función de PostgreSQL que actualiza los estados
            entityManager.createNativeQuery("SELECT actualizar_estados_ordenes_activas()")
                    .getSingleResult();
            
            logger.debug("✅ Actualización de estados completada");
            
        } catch (Exception e) {
            logger.error("❌ Error al actualizar estados de órdenes: {}", e.getMessage());
        }
    }
}
