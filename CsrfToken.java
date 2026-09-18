package co.sena.saaaf.security;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Base64;

/** Token por sesion para formularios. No sustituye autenticacion o permisos. */
public final class CsrfToken {
    private static final String KEY = "saaaf.csrf";
    private static final SecureRandom RANDOM = new SecureRandom();
    private CsrfToken() { }
    public static String obtener(HttpServletRequest request) {
        HttpSession session = request.getSession(true);
        Object existing = session.getAttribute(KEY);
        if (existing instanceof String) return (String) existing;
        byte[] random = new byte[32]; RANDOM.nextBytes(random);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(random);
        session.setAttribute(KEY, token);
        return token;
    }
    public static boolean valido(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) return false;
        Object expected = session.getAttribute(KEY);
        String received = request.getParameter("csrf");
        if (!(expected instanceof String) || received == null) return false;
        return MessageDigest.isEqual(((String) expected).getBytes(StandardCharsets.UTF_8), received.getBytes(StandardCharsets.UTF_8));
    }
}
