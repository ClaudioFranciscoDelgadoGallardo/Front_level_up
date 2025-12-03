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
    public List<Producto> buscarPorCategoria(Long categoriaId) {
        return productoRepository.findByCategoriaId(categoriaId);
    }

    @Transactional(readOnly = true)
    public List<Producto> buscarPorNombre(String nombre) {
        return productoRepository.findByNombreContainingIgnoreCaseAndActivoTrue(nombre);
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
        Producto producto = obtenerPorId(id);

        if (request.getNombre() != null && !request.getNombre().isEmpty()) {
            producto.setNombre(request.getNombre());
        }
        if (request.getDescripcion() != null) {
            producto.setDescripcion(request.getDescripcion());
        }
        if (request.getPrecio() != null) {
            producto.setPrecioVenta(request.getPrecio());
        }
        if (request.getCategoria() != null) {
            if (request.getCategoria() != null) {
            producto.setCategoriaId(Long.parseLong(request.getCategoria().toString()));
        }
        }
        if (request.getStock() != null) {
            producto.setStockActual(request.getStock());
        }
        if (request.getImagenUrl() != null) {
            producto.setImagenPrincipal(request.getImagenUrl());
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
    public void actualizarStock(Long id, Integer cantidad) {
        Producto producto = obtenerPorId(id);

        if (producto.getStockActual() + cantidad < 0) {
            throw new RuntimeException("Stock insuficiente");
        }

        producto.setStockActual(producto.getStockActual() + cantidad);
        productoRepository.save(producto);
        logger.info("Stock actualizado para {}: {}", producto.getNombre(), producto.getStockActual());
    }
}