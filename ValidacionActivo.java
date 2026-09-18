package co.sena.saaaf.validation;

import co.sena.saaaf.model.Activo;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.Locale;
import java.util.Set;

/** Validaciones de servidor alineadas con las longitudes del esquema SQL. */
public final class ValidacionActivo {
    private static final Set<String> ESTADOS = Set.of("Disponible", "Asignado", "Mantenimiento", "Baja");
    private ValidacionActivo() { }
    public static String texto(String valor, String campo, int minimo, int maximo) {
        String texto = valor == null ? "" : valor.trim();
        if (texto.length() < minimo || texto.length() > maximo) {
            throw new IllegalArgumentException(campo + ": longitud permitida entre " + minimo + " y " + maximo);
        }
        return texto;
    }
    public static LocalDate fecha(String valor) {
        try {
            if (valor == null || !valor.matches("\\d{4}-\\d{2}-\\d{2}")) throw new IllegalArgumentException("Fecha de registro obligatoria o invalida");
            LocalDate fecha = LocalDate.parse(valor);
            if (fecha.getYear() < 1900 || fecha.getYear() > 2100) throw new IllegalArgumentException("Fecha fuera del rango admitido");
            return fecha;
        } catch (DateTimeParseException exception) {
            throw new IllegalArgumentException("Fecha de registro invalida");
        }
    }
    public static int id(String valor) {
        try {
            int id = Integer.parseInt(valor);
            if (id <= 0) throw new IllegalArgumentException("Identificador invalido");
            return id;
        } catch (NumberFormatException exception) {
            throw new IllegalArgumentException("Identificador invalido");
        }
    }
    public static Activo validar(Activo activo) {
        if (activo == null) throw new IllegalArgumentException("Activo obligatorio");
        activo.setCodigoActivo(texto(activo.getCodigoActivo(), "Codigo", 3, 30).toUpperCase(Locale.ROOT));
        activo.setNombreActivo(texto(activo.getNombreActivo(), "Nombre", 3, 120));
        activo.setTipoActivo(texto(activo.getTipoActivo(), "Tipo", 1, 60));
        activo.setArea(texto(activo.getArea(), "Area", 1, 80));
        activo.setResponsable(texto(activo.getResponsable(), "Responsable", 0, 100));
        activo.setObservaciones(texto(activo.getObservaciones(), "Observaciones", 0, 255));
        if (activo.getEstado() == null || !ESTADOS.contains(activo.getEstado())) throw new IllegalArgumentException("Estado invalido");
        if ("Asignado".equals(activo.getEstado()) && activo.getResponsable().isBlank()) throw new IllegalArgumentException("Un activo asignado requiere responsable");
        if (activo.getFechaRegistro() == null) throw new IllegalArgumentException("Fecha obligatoria");
        fecha(activo.getFechaRegistro().toString());
        return activo;
    }
}
