package co.sena.saaaf.servlet;

import co.sena.saaaf.security.CsrfToken;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/** Proporciona token al formulario HTML estatico del material base. */
@WebServlet(name="TokenServlet", urlPatterns={"/token"})
public class TokenServlet extends HttpServlet {
    @Override protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json;charset=UTF-8");
        response.setHeader("Cache-Control", "no-store");
        response.getWriter().write("{\"token\":\"" + CsrfToken.obtener(request) + "\"}");
    }
}
