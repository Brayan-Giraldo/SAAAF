package co.sena.saaaf.dao;

import co.sena.saaaf.config.ConexionJDBC;
import co.sena.saaaf.model.Activo;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * DAO para operaciones CRUD sobre la tabla activos.
 */
public class ActivoDAO {

    @FunctionalInterface
    public interface ConnectionFactory { Connection abrir() throws SQLException; }
    private final ConnectionFactory conexiones;
    public ActivoDAO() { this(ConexionJDBC::obtenerConexion); }
    public ActivoDAO(ConnectionFactory conexiones) { this.conexiones = java.util.Objects.requireNonNull(conexiones); }


    private static final String SQL_LISTAR = "SELECT * FROM activos ORDER BY id_activo DESC";
    private static final String SQL_BUSCAR = "SELECT * FROM activos WHERE id_activo = ?";
    private static final String SQL_INSERTAR = "INSERT INTO activos (codigo_activo, nombre_activo, tipo_activo, area, responsable, estado, fecha_registro, observaciones) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    private static final String SQL_ACTUALIZAR = "UPDATE activos SET codigo_activo=?, nombre_activo=?, tipo_activo=?, area=?, responsable=?, estado=?, fecha_registro=?, observaciones=? WHERE id_activo=?";
    private static final String SQL_ELIMINAR = "DELETE FROM activos WHERE id_activo=?";

    public List<Activo> listarActivos() throws SQLException {
        List<Activo> activos = new ArrayList<>();
        try (Connection conexion = conexiones.abrir();
             PreparedStatement sentencia = conexion.prepareStatement(SQL_LISTAR);
             ResultSet resultado = sentencia.executeQuery()) {
            while (resultado.next()) {
                activos.add(mapearActivo(resultado));
            }
        }
        return activos;
    }

    public Activo buscarPorId(int idActivo) throws SQLException {
        try (Connection conexion = conexiones.abrir();
             PreparedStatement sentencia = conexion.prepareStatement(SQL_BUSCAR)) {
            sentencia.setInt(1, idActivo);
            try (ResultSet resultado = sentencia.executeQuery()) {
                if (resultado.next()) {
                    return mapearActivo(resultado);
                }
            }
        }
        return null;
    }

    public void insertarActivo(Activo activo) throws SQLException {
        try (Connection conexion = conexiones.abrir();
             PreparedStatement sentencia = conexion.prepareStatement(SQL_INSERTAR)) {
            cargarParametros(sentencia, activo);
            sentencia.executeUpdate();
        }
    }

    public boolean actualizarActivo(Activo activo) throws SQLException {
        try (Connection conexion = conexiones.abrir();
             PreparedStatement sentencia = conexion.prepareStatement(SQL_ACTUALIZAR)) {
            cargarParametros(sentencia, activo);
            sentencia.setInt(9, activo.getIdActivo());
            return sentencia.executeUpdate() == 1;
        }
    }

    public boolean eliminarActivo(int idActivo) throws SQLException {
        try (Connection conexion = conexiones.abrir();
             PreparedStatement sentencia = conexion.prepareStatement(SQL_ELIMINAR)) {
            sentencia.setInt(1, idActivo);
            return sentencia.executeUpdate() == 1;
        }
    }

    private void cargarParametros(PreparedStatement sentencia, Activo activo) throws SQLException {
        sentencia.setString(1, activo.getCodigoActivo());
        sentencia.setString(2, activo.getNombreActivo());
        sentencia.setString(3, activo.getTipoActivo());
        sentencia.setString(4, activo.getArea());
        sentencia.setString(5, activo.getResponsable());
        sentencia.setString(6, activo.getEstado());
        sentencia.setDate(7, Date.valueOf(activo.getFechaRegistro()));
        sentencia.setString(8, activo.getObservaciones());
    }

    private Activo mapearActivo(ResultSet resultado) throws SQLException {
        Activo activo = new Activo();
        activo.setIdActivo(resultado.getInt("id_activo"));
        activo.setCodigoActivo(resultado.getString("codigo_activo"));
        activo.setNombreActivo(resultado.getString("nombre_activo"));
        activo.setTipoActivo(resultado.getString("tipo_activo"));
        activo.setArea(resultado.getString("area"));
        activo.setResponsable(resultado.getString("responsable"));
        activo.setEstado(resultado.getString("estado"));
        activo.setFechaRegistro(resultado.getDate("fecha_registro").toLocalDate());
        activo.setObservaciones(resultado.getString("observaciones"));
        return activo;
    }
}
