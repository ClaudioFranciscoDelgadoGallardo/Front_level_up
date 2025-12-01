package levelup.levelup_product_service.service;

import levelup.levelup_product_service.dto.ActualizarProductoRequest;
import levelup.levelup_product_service.model.Producto;
import levelup.levelup_product_service.repository.ProductoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductoService {

    private static final Logger logger = LoggerFactory.getLogger(ProductoService.class);

    @Autowired
    private ProductoRepository productoRepository;

    @Transactional(readOnly = true)
    public List<Producto> obtenerTodos() {
        return productoRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Producto> obtenerActivos() {
        return productoRepository.findByActivoTrue();
    }

    @Transactional(readOnly = true)
    public List<Producto> obtenerDestacados() {
        return productoRepository.findByDestacadoTrueAndActivoTrue();
    }

    @Transactional(readOnly = true)
    public List<Producto> buscarPorCategoria(String categoria) {
        // TODO: Migrar a categoriaId (Long) en lugar de categoria (String)
        throw new UnsupportedOperationException("Método buscarPorCategoria() pendiente de migración");
        // return productoRepository.findByCategoriaIdAndActivoTrue(categoriaId);
    }

    @Transactional(readOnly = true)
    public List<Producto> buscarPorNombre(String nombre) {
        return productoRepository.findByNombreContainingIgnoreCaseAndActivoTrue(nombre);
    }

    @Transactional(readOnly = true)
    public Producto obtenerPorCodigo(String codigo) {
        return productoRepository.findByCodigo(codigo)
                .orElseThrow(() -> new RuntimeException("Producto con código " + codigo + " no encontrado"));
    }

    @Transactional(readOnly = true)
    public Producto obtenerPorId(Long id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
    }

    @Transactional
    public Producto crear(Producto producto) {
        logger.info("Creando producto: {}", producto.getNombre());
        return productoRepository.save(producto);
    }

    @Transactional
    public Producto actualizar(Long id, ActualizarProductoRequest request) {
        // TODO: Actualizar este método con los nuevos nombres de campos del modelo Producto
        // (precioBase, precioVenta, categoriaId, stockActual, imagenPrincipal, etc)
        throw new UnsupportedOperationException("Método actualizar() pendiente de migración a nuevo modelo");
        /*
        Producto producto = obtenerPorId(id);

        // Actualizar solo los campos que vienen en el request (no nulos)
        if (request.getNombre() != null && !request.getNombre().isEmpty()) {
            producto.setNombre(request.getNombre());
        }
        if (request.getDescripcion() != null) {
            producto.setDescripcion(request.getDescripcion());
        }
        if (request.getPrecio() != null) {
            producto.setPrecio(request.getPrecio());
        }
        if (request.getCategoria() != null && !request.getCategoria().isEmpty()) {
            producto.setCategoria(request.getCategoria());
        }
        if (request.getStock() != null) {
            producto.setStock(request.getStock());
        }
        if (request.getImagenUrl() != null) {
            producto.setImagenUrl(request.getImagenUrl());
        }
        if (request.getDestacado() != null) {
            producto.setDestacado(request.getDestacado());
        }
        if (request.getActivo() != null) {
            producto.setActivo(request.getActivo());
        }
        if (request.getMarca() != null) {
            producto.setMarca(request.getMarca());
        }
        if (request.getDescuento() != null) {
            producto.setDescuento(request.getDescuento());
        }

        logger.info("Actualizando producto: {}", producto.getNombre());
        return productoRepository.save(producto);
        */
    }

    @Transactional
    public void desactivar(Long id) {
        Producto producto = obtenerPorId(id);
        producto.setActivo(false);
        productoRepository.save(producto);
        logger.info("Producto desactivado: {}", producto.getNombre());
    }

    @Transactional
    public void activar(Long id) {
        Producto producto = obtenerPorId(id);
        producto.setActivo(true);
        productoRepository.save(producto);
        logger.info("Producto activado: {}", producto.getNombre());
    }

    @Transactional
    public void eliminarPermanente(Long id) {
        Producto producto = obtenerPorId(id);
        productoRepository.delete(producto);
        logger.warn("Producto eliminado permanentemente - ID: {}, Nombre: {}", id, producto.getNombre());
    }

    @Transactional
    public void actualizarStockDelta(String codigo, Integer delta) {
        Producto producto = obtenerPorCodigo(codigo);

        int nuevoStock = producto.getStockActual() + delta;
        
        if (nuevoStock < 0) {
            throw new RuntimeException("Stock insuficiente. Stock actual: " + producto.getStockActual() + ", intento de restar: " + Math.abs(delta));
        }

        producto.setStockActual(nuevoStock);
        productoRepository.save(producto);
        logger.info("Stock actualizado para producto {} ({}): {} {} = {}", 
            producto.getCodigo(), producto.getNombre(), producto.getStockActual(), 
            (delta >= 0 ? "+" : ""), delta, nuevoStock);
    }

    @Transactional
    public void actualizarStockPorCodigo(String codigo, Integer nuevaCantidad) {
        Producto producto = obtenerPorCodigo(codigo);

        if (nuevaCantidad < 0) {
            throw new RuntimeException("Stock no puede ser negativo");
        }

        producto.setStockActual(nuevaCantidad);
        productoRepository.save(producto);
        logger.info("Stock actualizado para producto {} ({}): {}", producto.getCodigo(), producto.getNombre(), nuevaCantidad);
    }

    @Transactional
    public void actualizarStock(Long id, Integer cantidad) {
        // TODO: Actualizar este método con el nuevo campo stockActual
        throw new UnsupportedOperationException("Método actualizarStock() pendiente de migración a nuevo modelo");
        /*
        Producto producto = obtenerPorId(id);

        if (producto.getStockActual() + cantidad < 0) {
            throw new RuntimeException("Stock insuficiente");
        }

        producto.setStockActual(producto.getStockActual() + cantidad);
        productoRepository.save(producto);
        logger.info("Stock actualizado para {}: {}", producto.getNombre(), producto.getStockActual());
        */
    }
}

