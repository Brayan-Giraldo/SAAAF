<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="java.util.List" %>
<%@ page import="co.sena.saaaf.model.Activo" %>
<%@ page import="co.sena.saaaf.util.Html" %>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard SAAAF</title>
    <link rel="stylesheet" href="assets/css/styles.css">
</head>
<body>
    <main class="container">
        <header class="page-header">
            <h1>Dashboard SAAAF</h1>
            <p>Indicadores principales de activos fijos.</p>
            <a class="btn btn-secondary" href="index.html">Inicio</a>
            <a class="btn btn-primary" href="activos">Gestionar activos</a>
        </header>

        <section class="kpi-grid">
            <article class="kpi-card"><span>Total activos</span><strong>${totalActivos}</strong></article>
            <article class="kpi-card"><span>Disponibles</span><strong>${disponibles}</strong></article>
            <article class="kpi-card"><span>Asignados</span><strong>${asignados}</strong></article>
            <article class="kpi-card"><span>Mantenimiento</span><strong>${mantenimiento}</strong></article>
        </section>

        <section class="panel">
            <h2>Inventario reciente</h2>
            <table>
                <thead>
                <tr>
                    <th>Código</th>
                    <th>Activo</th>
                    <th>Tipo</th>
                    <th>Área</th>
                    <th>Estado</th>
                </tr>
                </thead>
                <tbody>
                <%
                    List<Activo> activos = (List<Activo>) request.getAttribute("activos");
                    if (activos != null) {
                        for (Activo activo : activos) {
                %>
                <tr>
                    <td><%= Html.escape(activo.getCodigoActivo()) %></td>
                    <td><%= Html.escape(activo.getNombreActivo()) %></td>
                    <td><%= Html.escape(activo.getTipoActivo()) %></td>
                    <td><%= Html.escape(activo.getArea()) %></td>
                    <td><span class="tag <%= Html.escape(activo.getEstado()) %>"><%= Html.escape(activo.getEstado()) %></span></td>
                </tr>
                <%      }
                    }
                %>
                </tbody>
            </table>
        </section>
    </main>
</body>
</html>
