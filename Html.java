package co.sena.saaaf.util;

/** Escapa texto para contenido HTML y atributos entre comillas. */
public final class Html {
    private Html() { }
    public static String escape(Object value) {
        if (value == null) return "";
        return value.toString().replace("&", "&amp;").replace("<", "&lt;")
                .replace(">", "&gt;").replace("\"", "&quot;").replace("'", "&#39;");
    }
}
