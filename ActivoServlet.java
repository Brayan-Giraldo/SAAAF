package co.sena.saaaf.servlet;

import co.sena.saaaf.dao.ActivoDAO;
import co.sena.saaaf.model.Activo;
import co.sena.saaaf.security.CsrfToken;
import co.sena.saaaf.validation.ValidacionActivo;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;
import java.sql.SQLException;

/** Controlador del CRUD heredado. GET consulta; POST modifica con validacion. */
@WebServlet(name="ActivoServlet", urlPatterns={"/activos"})
public class ActivoServlet extends HttpServlet {
    private final ActivoDAO activoDAO;
    public ActivoServlet() { this(new ActivoDAO()); }
    public ActivoServlet(ActivoDAO activoDAO) { this.activoDAO=activoDAO; }
    @Override protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String accion=request.getParameter("accion");
        if (accion == null) accion="listar";
        try {
            switch (accion) {
                case "listar":
                    request.setAttribute("activos", activoDAO.listarActivos());
                    request.setAttribute("csrf", CsrfToken.obtener(request));
                    request.getRequestDispatcher("/WEB-INF/views/activos.jsp").forward(request,response); break;
                case "nuevo": formulario(request,response,null); break;
                case "editar":
                    Activo activo=activoDAO.buscarPorId(ValidacionActivo.id(request.getParameter("id")));
                    if(activo == null) error(request,response,404,"El activo no existe");
                    else formulario(request,response,activo);
                    break;
                case "eliminar":
                    response.setHeader("Allow", "POST");
                    error(request,response,405,"La eliminacion requiere POST y confirmacion"); break;
                default: error(request,response,400,"Accion de consulta desconocida");
            }
        } catch (IllegalArgumentException exception) { error(request,response,400,exception.getMessage()); }
        catch (SQLException exception) { databaseError(request,response,exception); }
    }
    @Override protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        if(!CsrfToken.valido(request)) { error(request,response,403,"Token de formulario invalido. Recarga el formulario."); return; }
        String accion=request.getParameter("accion");
        try {
            if("eliminar".equals(accion)) {
                int id=ValidacionActivo.id(request.getParameter("id"));
                if(!activoDAO.eliminarActivo(id)) { error(request,response,404,"El activo no existe"); return; }
                redirigir(request,response,"eliminado");
            } else if("guardar".equals(accion) || "actualizar".equals(accion)) {
                Activo activo=construir(request);
                if("actualizar".equals(accion)) {
                    activo.setIdActivo(ValidacionActivo.id(request.getParameter("idActivo")));
                    if(!activoDAO.actualizarActivo(activo)) { error(request,response,404,"El activo no existe"); return; }
                    redirigir(request,response,"actualizado");
                } else { activoDAO.insertarActivo(activo); redirigir(request,response,"registrado"); }
            } else error(request,response,400,"Accion de escritura desconocida");
        } catch (IllegalArgumentException exception) { error(request,response,400,exception.getMessage()); }
        catch (SQLException exception) { databaseError(request,response,exception); }
    }
    private Activo construir(HttpServletRequest request) {
        Activo a=new Activo();
        a.setCodigoActivo(request.getParameter("codigoActivo"));
        a.setNombreActivo(request.getParameter("nombreActivo"));
        a.setTipoActivo(request.getParameter("tipoActivo"));a.setArea(request.getParameter("area"));
        a.setResponsable(request.getParameter("responsable"));a.setEstado(request.getParameter("estado"));
        a.setFechaRegistro(ValidacionActivo.fecha(request.getParameter("fechaRegistro")));
        a.setObservaciones(request.getParameter("observaciones"));
        return ValidacionActivo.validar(a);
    }
    private void formulario(HttpServletRequest request,HttpServletResponse response,Activo activo) throws ServletException,IOException {
        request.setAttribute("activo",activo);request.setAttribute("csrf",CsrfToken.obtener(request));
        request.getRequestDispatcher("/WEB-INF/views/form-activo.jsp").forward(request,response);
    }
    private void redirigir(HttpServletRequest request,HttpServletResponse response,String mensaje) throws IOException {
        response.sendRedirect(request.getContextPath()+"/activos?mensaje="+mensaje);
    }
    private void databaseError(HttpServletRequest request,HttpServletResponse response,SQLException exception) throws ServletException,IOException {
        if (exception.getSQLState()!=null && exception.getSQLState().startsWith("23")) error(request,response,409,"Codigo duplicado o datos que incumplen una restriccion");
        else {
            if(getServletConfig()!=null) getServletContext().log("Error de acceso a datos SAAAF",exception);
            error(request,response,500,"No fue posible acceder a los datos. Contacta al administrador.");
        }
    }
    private void error(HttpServletRequest request,HttpServletResponse response,int status,String message) throws ServletException,IOException {
        response.setStatus(status);request.setAttribute("error",message);
        request.getRequestDispatcher("/WEB-INF/views/error.jsp").forward(request,response);
    }
}
