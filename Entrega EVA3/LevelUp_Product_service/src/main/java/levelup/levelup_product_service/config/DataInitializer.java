package levelup.levelup_product_service.config;

import levelup.levelup_product_service.model.Producto;
import levelup.levelup_product_service.repository.ProductoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private ProductoRepository productoRepository;

    @Override
    public void run(String... args) {
        if (productoRepository.count() == 0) {
            logger.info("Inicializando productos de ejemplo...");

            // Productos de Consolas
            productoRepository.save(Producto.builder()
                    .nombre("PlayStation 5")
                    .descripcion("Consola de videojuegos de ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Âºltima generaciÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â³n con grÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ficos en 4K y SSD ultrarrÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡pido")
                    .precioVenta(new BigDecimal("499990"))
                    .categoriaId(3L)
                    .stockActual(50)
                    .imagenPrincipal("/images/ps5.jpg")
                    .destacado(true)
                    .activo(true)
                    .marca("Sony")
                    .descuento(BigDecimal.ZERO)
                    .build());

            productoRepository.save(Producto.builder()
                    .nombre("Xbox Series X")
                    .descripcion("La consola Xbox mÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡s potente con soporte para 4K nativo y ray tracing")
                    .precioVenta(new BigDecimal("449990"))
                    .categoriaId(3L)
                    .stockActual(35)
                    .imagenPrincipal("/images/xbox-series-x.jpg")
                    .destacado(true)
                    .activo(true)
                    .marca("Microsoft")
                    .descuento(BigDecimal.ZERO)
                    .build());

            productoRepository.save(Producto.builder()
                    .nombre("Nintendo Switch OLED")
                    .descripcion("Consola hÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â­brida con pantalla OLED de 7 pulgadas")
                    .precioVenta(new BigDecimal("349990"))
                    .categoriaId(3L)
                    .stockActual(60)
                    .imagenPrincipal("/images/switch-oled.jpg")
                    .destacado(true)
                    .activo(true)
                    .marca("Nintendo")
                    .descuento(BigDecimal.ZERO)
                    .build());

            // Videojuegos PS5
            productoRepository.save(Producto.builder()
                    .nombre("God of War RagnarÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¶k")
                    .descripcion("ContinÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Âºa la ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â©pica aventura de Kratos y Atreus en los reinos nÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â³rdicos")
                    .precioVenta(new BigDecimal("69990"))
                    .categoriaId(4L)
                    .stockActual(100)
                    .imagenPrincipal("/images/god-of-war.jpg")
                    .destacado(true)
                    .activo(true)
                    .marca("Sony")
                    .descuento(BigDecimal.ZERO)
                    .build());

            productoRepository.save(Producto.builder()
                    .nombre("Spider-Man 2")
                    .descripcion("Los Spider-Men Peter Parker y Miles Morales se enfrentan a nuevas amenazas")
                    .precioVenta(new BigDecimal("69990"))
                    .categoriaId(4L)
                    .stockActual(80)
                    .imagenPrincipal("/images/spiderman2.jpg")
                    .destacado(true)
                    .activo(true)
                    .marca("Sony")
                    .descuento(new BigDecimal("10.00"))
                    .build());

            // Videojuegos Xbox
            productoRepository.save(Producto.builder()
                    .nombre("Halo Infinite")
                    .descripcion("La legendaria saga Halo continÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Âºa con una nueva aventura ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â©pica")
                    .precioVenta(new BigDecimal("59990"))
                    .categoriaId(4L)
                    .stockActual(70)
                    .imagenPrincipal("/images/halo-infinite.jpg")
                    .destacado(false)
                    .activo(true)
                    .marca("Microsoft")
                    .descuento(new BigDecimal("15.00"))
                    .build());

            productoRepository.save(Producto.builder()
                    .nombre("Forza Horizon 5")
                    .descripcion("Carreras de mundo abierto en los vibrantes paisajes de MÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â©xico")
                    .precioVenta(new BigDecimal("59990"))
                    .categoriaId(4L)
                    .stockActual(65)
                    .imagenPrincipal("/images/forza5.jpg")
                    .destacado(false)
                    .activo(true)
                    .marca("Microsoft")
                    .descuento(BigDecimal.ZERO)
                    .build());

            // Videojuegos Nintendo
            productoRepository.save(Producto.builder()
                    .nombre("The Legend of Zelda: Tears of the Kingdom")
                    .descripcion("Secuela de Breath of the Wild con nuevas mecÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡nicas y aventuras")
                    .precioVenta(new BigDecimal("59990"))
                    .categoriaId(4L)
                    .stockActual(90)
                    .imagenPrincipal("/images/zelda-totk.jpg")
                    .destacado(true)
                    .activo(true)
                    .marca("Nintendo")
                    .descuento(BigDecimal.ZERO)
                    .build());

            productoRepository.save(Producto.builder()
                    .nombre("Super Mario Bros Wonder")
                    .descripcion("El nuevo juego de plataformas 2D de Mario con mecÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡nicas innovadoras")
                    .precioVenta(new BigDecimal("59990"))
                    .categoriaId(4L)
                    .stockActual(75)
                    .imagenPrincipal("/images/mario-wonder.jpg")
                    .destacado(false)
                    .activo(true)
                    .marca("Nintendo")
                    .descuento(BigDecimal.ZERO)
                    .build());

            // Accesorios
            productoRepository.save(Producto.builder()
                    .nombre("DualSense Wireless Controller")
                    .descripcion("Control inalÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡mbrico para PS5 con retroalimentaciÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â³n hÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ptica")
                    .precioVenta(new BigDecimal("69990"))
                    .categoriaId(2L)
                    .stockActual(120)
                    .imagenPrincipal("/images/dualsense.jpg")
                    .destacado(false)
                    .activo(true)
                    .marca("Sony")
                    .descuento(BigDecimal.ZERO)
                    .build());

            productoRepository.save(Producto.builder()
                    .nombre("Xbox Wireless Controller")
                    .descripcion("Control inalÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡mbrico para Xbox Series X|S con diseÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â±o ergonÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â³mico")
                    .precioVenta(new BigDecimal("59990"))
                    .categoriaId(2L)
                    .stockActual(100)
                    .imagenPrincipal("/images/xbox-controller.jpg")
                    .destacado(false)
                    .activo(true)
                    .marca("Microsoft")
                    .descuento(BigDecimal.ZERO)
                    .build());

            productoRepository.save(Producto.builder()
                    .nombre("Nintendo Switch Pro Controller")
                    .descripcion("Control Pro para Nintendo Switch con mayor duraciÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â³n de baterÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â­a")
                    .precioVenta(new BigDecimal("69990"))
                    .categoriaId(2L)
                    .stockActual(85)
                    .imagenPrincipal("/images/pro-controller.jpg")
                    .destacado(false)
                    .activo(true)
                    .marca("Nintendo")
                    .descuento(BigDecimal.ZERO)
                    .build());

            productoRepository.save(Producto.builder()
                    .nombre("Headset Pulse 3D")
                    .descripcion("Auriculares inalÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡mbricos para PS5 con audio 3D tempest")
                    .precioVenta(new BigDecimal("99990"))
                    .categoriaId(2L)
                    .stockActual(60)
                    .imagenPrincipal("/images/pulse-3d.jpg")
                    .destacado(false)
                    .activo(true)
                    .marca("Sony")
                    .descuento(BigDecimal.ZERO)
                    .build());

            logger.info("=".repeat(70));
            logger.info("ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ {} productos de ejemplo creados exitosamente", productoRepository.count());
            logger.info("CategorÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â­as: CONSOLAS, VIDEOJUEGOS, ACCESORIOS");
            logger.info("Productos destacados: {}", productoRepository.findByDestacadoTrueAndActivoTrue().size());
            logger.info("=".repeat(70));
        } else {
            logger.info("Productos ya existen en la base de datos. Total: {}", productoRepository.count());
        }
    }
}
