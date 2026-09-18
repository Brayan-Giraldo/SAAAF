package co.sena.saaaf.servlet;

import co.sena.saaaf.dao.ActivoDAO;
import co.sena.saaaf.model.Activo;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

/**
 * Servlet de Dashboard para mostrar indicadores generales del sistema SAAAF.
 */
@WebServlet(name = "DashboardServlet", urlPatterns = {"/dashboard"})
public class DashboardServlet extends HttpServlet {

    private final ActivoDAO activoDAO;
    public DashboardServlet() { this(new ActivoDAO()); }
    public DashboardServlet(ActivoDAO activoDAO) { this.activoDAO = activoDAO; }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        try {
            List<Activo> activos = activoDAO.listarActivos();
            request.setAttribute("totalActivos", activos.size());
            request.setAttribute("disponibles", contarPorEstado(activos, "Disponible"));
            request.setAttribute("asignados", contarPorEstado(activos, "Asignado"));
            request.setAttribute("mantenimiento", contarPorEstado(activos, "Mantenimiento"));
            request.setAttribute("activos", activos);
            RequestDispatcher dispatcher = request.getRequestDispatcher("/WEB-INF/views/dashboard.jsp");
            dispatcher.forward(request, response);
        } catch (SQLException exception) {
            response.setStatus(500);
            request.setAttribute("error", "No fue posible cargar el dashboard.");
            request.getRequestDispatcher("/WEB-INF/views/error.jsp").forward(request, response);
        }
    }

    private long contarPorEstado(List<Activo> activos, String estado) {
        return activos.stream().filter(activo -> estado.equals(activo.getEstado())).count();
    }
}
