<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="java.util.List" %>
<%@ page import="co.sena.saaaf.model.Activo" %>
<%@ page import="co.sena.saaaf.util.Html" %>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Activos SAAAF</title>
    <link rel="stylesheet" href="assets/css/styles.css">
</head>
<body>
    <main class="container">
        <header class="page-header">
            <h1>Gestión de Activos</h1>
            <p>Consulta, actualización y eliminación de activos fijos.</p>
            <a class="btn btn-secondary" href="index.html">Inicio</a>
            <a class="btn btn-primary" href="activos?accion=nuevo">Nuevo activo</a>
        </header>

        <section class="panel">
            <table>
                <thead>
                <tr>
                    <th>Código</th>
                    <th>Nombre</th>
                    <th>Tipo</th>
                    <th>Área</th>
                    <th>Responsable</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                <%
                    List<Activo> activos = (List<Activo>) request.getAttribute("activos");
                    if (activos != null && !activos.isEmpty()) {
                        for (Activo activo : activos) {
                %>
                <tr>
                    <td><%= Html.escape(activo.getCodigoActivo()) %></td>
                    <td><%= Html.escape(activo.getNombreActivo()) %></td>
                    <td><%= Html.escape(activo.getTipoActivo()) %></td>
                    <td><%= Html.escape(activo.getArea()) %></td>
                    <td><%= Html.escape(activo.getResponsable() == null ? "Sin asignar" : activo.getResponsable()) %></td>
                    <td><span class="tag <%= Html.escape(activo.getEstado()) %>"><%= Html.escape(activo.getEstado()) %></span></td>
                    <td>
                        <a class="btn btn-secondary" href="activos?accion=editar&id=<%= Html.escape(activo.getIdActivo()) %>">Editar</a>
                        <form action="activos" method="post" class="inline-form confirm-delete">
                            <input type="hidden" name="accion" value="eliminar">
                            <input type="hidden" name="id" value="<%= activo.getIdActivo() %>">
                            <input type="hidden" name="csrf" value="<%= Html.escape(request.getAttribute("csrf")) %>">
                            <button type="submit" class="btn btn-danger">Eliminar</button>
                        </form>
                    </td>
                </tr>
                <%      }
                    } else {
                %>
                <tr><td colspan="7">No existen activos registrados.</td></tr>
                <% } %>
                </tbody>
            </table>
        </section>
    </main>
<script src="assets/js/app.js"></script>
</body>
</html>
