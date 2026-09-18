package co.sena.saaaf.config;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/** Configuracion externa. No guarda credenciales en el codigo fuente. */
public final class ConexionJDBC {
    private ConexionJDBC() { }
    private static String setting(String property, String env, String fallback) {
        String value = System.getProperty(property);
        if (value == null || value.isBlank()) value = System.getenv(env);
        return value == null || value.isBlank() ? fallback : value;
    }
    public static Connection obtenerConexion() throws SQLException {
        String driver = setting("saaaf.db.driver", "SAAAF_DB_DRIVER", "com.mysql.cj.jdbc.Driver");
        String url = setting("saaaf.db.url", "SAAAF_DB_URL", "jdbc:mysql://localhost:3306/saaaf_db?serverTimezone=America/Bogota");
        String user = setting("saaaf.db.user", "SAAAF_DB_USER", "saaaf_app");
        String password = setting("saaaf.db.password", "SAAAF_DB_PASSWORD", "");
        try {
            Class.forName(driver);
        } catch (ClassNotFoundException exception) {
            throw new SQLException("No se encontro el controlador JDBC configurado", exception);
        }
        return DriverManager.getConnection(url, user, password);
    }
}
