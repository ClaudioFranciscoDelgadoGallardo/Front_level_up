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
        logger.info("DataInitializer deshabilitado - productos cargados desde BD");
    }
}
