import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../config/supabase';
import '../styles/Admin.css';

export default function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [tipoFiltro, setTipoFiltro] = useState('todos');
  const [accionFiltro, setAccionFiltro] = useState('todas');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [cargando, setCargando] = useState(true);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const REGISTROS_POR_PAGINA = 50;

  // Estadísticas
  const [estadisticas, setEstadisticas] = useState({
    total: 0,
    admin: 0,
    usuario: 0,
    sistema: 0
  });

  useEffect(() => {
    cargarLogs();
    cargarEstadisticas();
  }, [tipoFiltro, accionFiltro, fechaInicio, fechaFin, pagina]);

  const cargarLogs = async () => {
    try {
      setCargando(true);
      
      // Construcción de query
      let query = supabase
        .from('logs_sistema')
        .select('*', { count: 'exact' });
      
      // Filtro por tipo
      if (tipoFiltro !== 'todos') {
        query = query.eq('tipo', tipoFiltro.toUpperCase());
      }
      
      // Filtro por acción
      if (accionFiltro !== 'todas') {
        query = query.ilike('accion', `%${accionFiltro}%`);
      }
      
      // Filtro por fecha inicio
      if (fechaInicio) {
        query = query.gte('fecha', new Date(fechaInicio).toISOString());
      }
      
      // Filtro por fecha fin
      if (fechaFin) {
        const fechaFinDate = new Date(fechaFin);
        fechaFinDate.setHours(23, 59, 59, 999);
        query = query.lte('fecha', fechaFinDate.toISOString());
      }
      
      // Paginación
      const desde = (pagina - 1) * REGISTROS_POR_PAGINA;
      const hasta = desde + REGISTROS_POR_PAGINA - 1;
      
      // Ejecutar query
      const { data, error, count } = await query
        .order('fecha', { ascending: false })
        .range(desde, hasta);
      
      if (error) {
        console.error('❌ Error al cargar logs:', error);
        setLogs([]);
      } else {
        console.log('✅ Logs cargados:', data?.length || 0);
        setLogs(data || []);
        setTotalPaginas(Math.ceil((count || 0) / REGISTROS_POR_PAGINA));
      }
    } catch (error) {
      console.error('❌ Error inesperado:', error);
      setLogs([]);
    } finally {
      setCargando(false);
    }
  };

  const cargarEstadisticas = async () => {
    try {
      // Total de logs
      const { count: total } = await supabase
        .from('logs_sistema')
        .select('*', { count: 'exact', head: true });
      
      // Logs de admin
      const { count: admin } = await supabase
        .from('logs_sistema')
        .select('*', { count: 'exact', head: true })
        .eq('tipo', 'ADMIN');
      
      // Logs de usuario
      const { count: usuario } = await supabase
        .from('logs_sistema')
        .select('*', { count: 'exact', head: true })
        .eq('tipo', 'USUARIO');
      
      // Logs de sistema
      const { count: sistema } = await supabase
        .from('logs_sistema')
        .select('*', { count: 'exact', head: true })
        .eq('tipo', 'SISTEMA');
      
      setEstadisticas({
        total: total || 0,
        admin: admin || 0,
        usuario: usuario || 0,
        sistema: sistema || 0
      });
    } catch (error) {
      console.error('❌ Error al cargar estadísticas:', error);
    }
  };

  const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleString('es-CL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getIconoTipo = (tipo) => {
    switch (tipo) {
      case 'ADMIN': return '⚙️';
      case 'USUARIO': return '🛒';
      case 'SISTEMA': return '🖥️';
      case 'ERROR': return '❌';
      case 'SEGURIDAD': return '🔒';
      default: return '📝';
    }
  };

  const getColorAccion = (accion) => {
    if (accion.includes('CREAR') || accion.includes('Creó') || accion.includes('Agregó')) {
      return 'var(--accent-green)';
    }
    if (accion.includes('ELIMINAR') || accion.includes('Eliminó')) {
      return '#ff4444';
    }
    if (accion.includes('EDITAR') || accion.includes('Editó') || accion.includes('Actualizó')) {
      return 'var(--accent-blue)';
    }
    return '#fff';
  };

  const limpiarFiltros = () => {
    setTipoFiltro('todos');
    setAccionFiltro('todas');
    setFechaInicio('');
    setFechaFin('');
    setPagina(1);
  };

  return (
    <main className="container admin-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="section-title mb-2">📊 Registro de Actividad del Sistema</h2>
          <p className="text-secondary small">
            Logs automáticos generados por triggers de base de datos
          </p>
          <Link to="/admin" className="text-secondary">
            ← Volver al Panel
          </Link>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="admin-card text-center">
            <div className="admin-card-body">
              <div style={{ fontSize: '2rem' }}>📊</div>
              <h3 className="text-white mb-0">{estadisticas.total}</h3>
              <p className="text-secondary mb-0">Total de Logs</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="admin-card text-center">
            <div className="admin-card-body">
              <div style={{ fontSize: '2rem' }}>⚙️</div>
              <h3 className="text-white mb-0">{estadisticas.admin}</h3>
              <p className="text-secondary mb-0">Logs Admin</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="admin-card text-center">
            <div className="admin-card-body">
              <div style={{ fontSize: '2rem' }}>🛒</div>
              <h3 className="text-white mb-0">{estadisticas.usuario}</h3>
              <p className="text-secondary mb-0">Logs Usuario</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="admin-card text-center">
            <div className="admin-card-body">
              <div style={{ fontSize: '2rem' }}>🖥️</div>
              <h3 className="text-white mb-0">{estadisticas.sistema}</h3>
              <p className="text-secondary mb-0">Logs Sistema</p>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-card mb-4">
        <div className="admin-card-body">
          <div className="row">
            <div className="col-md-12 mb-3">
              <label className="form-label text-white fw-bold">Filtrar por tipo:</label>
              <div className="d-flex gap-3 flex-wrap">
                <button
                  className={`btn ${tipoFiltro === 'todos' ? 'btn-success' : 'btn-outline-success'}`}
                  onClick={() => { setTipoFiltro('todos'); setPagina(1); }}
                >
                  Todos
                </button>
                <button
                  className={`btn ${tipoFiltro === 'admin' ? 'btn-success' : 'btn-outline-success'}`}
                  onClick={() => { setTipoFiltro('admin'); setPagina(1); }}
                >
                  ⚙️ Admin
                </button>
                <button
                  className={`btn ${tipoFiltro === 'usuario' ? 'btn-success' : 'btn-outline-success'}`}
                  onClick={() => { setTipoFiltro('usuario'); setPagina(1); }}
                >
                  🛒 Usuarios
                </button>
                <button
                  className={`btn ${tipoFiltro === 'sistema' ? 'btn-success' : 'btn-outline-success'}`}
                  onClick={() => { setTipoFiltro('sistema'); setPagina(1); }}
                >
                  🖥️ Sistema
                </button>
              </div>
            </div>

            <div className="col-md-12 mb-3">
              <label className="form-label text-white fw-bold">Filtrar por acción:</label>
              <div className="d-flex gap-2 flex-wrap">
                <button
                  className={`btn btn-sm ${accionFiltro === 'todas' ? 'btn-success' : 'btn-outline-success'}`}
                  onClick={() => { setAccionFiltro('todas'); setPagina(1); }}
                >
                  Todas
                </button>
                <button
                  className={`btn btn-sm ${accionFiltro === 'CREAR' ? 'btn-success' : 'btn-outline-success'}`}
                  onClick={() => { setAccionFiltro('CREAR'); setPagina(1); }}
                >
                  Crear
                </button>
                <button
                  className={`btn btn-sm ${accionFiltro === 'EDITAR' ? 'btn-success' : 'btn-outline-success'}`}
                  onClick={() => { setAccionFiltro('EDITAR'); setPagina(1); }}
                >
                  Editar
                </button>
                <button
                  className={`btn btn-sm ${accionFiltro === 'ELIMINAR' ? 'btn-success' : 'btn-outline-success'}`}
                  onClick={() => { setAccionFiltro('ELIMINAR'); setPagina(1); }}
                >
                  Eliminar
                </button>
              </div>
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label text-white fw-bold">Fecha desde:</label>
              <input
                type="date"
                className="form-control admin-logs-fecha-input"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label text-white fw-bold">Fecha hasta:</label>
              <input
                type="date"
                className="form-control admin-logs-fecha-input"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </div>

            {(fechaInicio || fechaFin || accionFiltro !== 'todas' || tipoFiltro !== 'todos') && (
              <div className="col-md-12">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={limpiarFiltros}
                >
                  🔄 Limpiar Filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-body">
          {cargando ? (
            <div className="text-center py-5">
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="text-secondary mt-3">Cargando logs...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-secondary">📭 No hay registros de actividad con los filtros seleccionados</p>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-dark table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th className="admin-logs-th-tipo">Tipo</th>
                      <th className="admin-logs-th-fecha">Fecha y Hora</th>
                      <th>Módulo</th>
                      <th className="admin-logs-th-usuario">Usuario ID</th>
                      <th>Acción</th>
                      <th>Descripción</th>
                      <th>Nivel</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => (
                      <tr key={log.id}>
                        <td className="text-secondary">{log.id}</td>
                        <td className="text-center admin-logs-td-icono">
                          {getIconoTipo(log.tipo)} <small>{log.tipo}</small>
                        </td>
                        <td className="admin-logs-td-fecha">
                          {formatearFecha(log.fecha)}
                        </td>
                        <td className="text-info">{log.modulo || '-'}</td>
                        <td className="admin-logs-td-usuario">
                          {log.usuario_id || 'Sistema'}
                        </td>
                        <td style={{ color: getColorAccion(log.accion) }}>
                          <strong>{log.accion}</strong>
                        </td>
                        <td className="text-secondary small">{log.descripcion}</td>
                        <td>
                          <span className={`badge bg-${log.nivel === 'ERROR' ? 'danger' : log.nivel === 'WARNING' ? 'warning' : 'info'}`}>
                            {log.nivel}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginación */}
              <div className="d-flex justify-content-center align-items-center gap-2 mt-4">
                <button 
                  className="btn btn-sm btn-outline-success"
                  onClick={() => setPagina(1)} 
                  disabled={pagina === 1}
                >
                  ⏮️ Primera
                </button>
                <button 
                  className="btn btn-sm btn-outline-success"
                  onClick={() => setPagina(p => Math.max(1, p - 1))} 
                  disabled={pagina === 1}
                >
                  ◀️ Anterior
                </button>
                <span className="text-white mx-3">
                  Página <strong>{pagina}</strong> de <strong>{totalPaginas}</strong>
                </span>
                <button 
                  className="btn btn-sm btn-outline-success"
                  onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))} 
                  disabled={pagina === totalPaginas}
                >
                  Siguiente ▶️
                </button>
                <button 
                  className="btn btn-sm btn-outline-success"
                  onClick={() => setPagina(totalPaginas)} 
                  disabled={pagina === totalPaginas}
                >
                  Última ⏭️
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
