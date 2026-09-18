<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="co.sena.saaaf.model.Activo" %>
<%@ page import="co.sena.saaaf.util.Html" %>
<%
    Activo activo = (Activo) request.getAttribute("activo");
    boolean editando = activo != null;
%>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= editando ? "Editar" : "Nuevo" %> activo - SAAAF</title>
    <link rel="stylesheet" href="assets/css/styles.css">
</head>
<body>
    <main class="container">
        <header class="page-header">
            <h1><%= editando ? "Editar activo" : "Registrar nuevo activo" %></h1>
            <p>Formulario JSP enviado a un servlet mediante método POST.</p>
        </header>

        <form class="form-card" action="activos" method="post">
            <input type="hidden" name="csrf" value="<%= Html.escape(request.getAttribute("csrf")) %>">
            <input type="hidden" name="accion" value="<%= editando ? "actualizar" : "guardar" %>">
            <% if (editando) { %>
                <input type="hidden" name="idActivo" value="<%= activo.getIdActivo() %>">
            <% } %>

            <label>Código del activo</label>
            <input type="text" name="codigoActivo" maxlength="30" value="<%= Html.escape(editando ? activo.getCodigoActivo() : "") %>" required>

            <label>Nombre del activo</label>
            <input type="text" name="nombreActivo" maxlength="120" value="<%= Html.escape(editando ? activo.getNombreActivo() : "") %>" required>

            <label>Tipo de activo</label>
            <input type="text" name="tipoActivo" maxlength="60" value="<%= Html.escape(editando ? activo.getTipoActivo() : "") %>" required>

            <label>Área</label>
            <input type="text" name="area" maxlength="80" value="<%= Html.escape(editando ? activo.getArea() : "") %>" required>

            <label>Responsable</label>
            <input type="text" name="responsable" maxlength="100" value="<%= Html.escape(editando && activo.getResponsable() != null ? activo.getResponsable() : "") %>">

            <label>Estado</label>
            <select name="estado" required>
                <option value="Disponible" <%= editando && "Disponible".equals(activo.getEstado()) ? "selected" : "" %>>Disponible</option>
                <option value="Asignado" <%= editando && "Asignado".equals(activo.getEstado()) ? "selected" : "" %>>Asignado</option>
                <option value="Mantenimiento" <%= editando && "Mantenimiento".equals(activo.getEstado()) ? "selected" : "" %>>Mantenimiento</option>
                <option value="Baja" <%= editando && "Baja".equals(activo.getEstado()) ? "selected" : "" %>>Baja</option>
            </select>

            <label>Fecha de registro</label>
            <input type="date" name="fechaRegistro" value="<%= Html.escape(editando ? activo.getFechaRegistro() : "") %>" required>

            <label>Observaciones</label>
            <textarea name="observaciones" rows="3" maxlength="255"><%= Html.escape(editando && activo.getObservaciones() != null ? activo.getObservaciones() : "") %></textarea>

            <button class="btn btn-primary" type="submit"><%= editando ? "Actualizar" : "Guardar" %></button>
            <a class="btn btn-secondary" href="activos">Cancelar</a>
        </form>
    </main>
</body>
</html>
