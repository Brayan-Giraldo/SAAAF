<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="co.sena.saaaf.util.Html" %>
<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Validacion SAAAF</title><link rel="stylesheet" href="assets/css/styles.css"></head>
<body><main class="container"><section class="form-card"><h1>No se completo la operacion</h1><p role="alert"><%= Html.escape(request.getAttribute("error")) %></p><p>Los datos no fueron confirmados. Regresa al listado o abre de nuevo el formulario.</p><a class="btn btn-secondary" href="activos">Volver a activos</a></section></main></body></html>
