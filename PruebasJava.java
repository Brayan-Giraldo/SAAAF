package co.sena.saaaf.tests;

import co.sena.saaaf.model.Activo;
import co.sena.saaaf.dao.ActivoDAO;
import co.sena.saaaf.validation.ValidacionActivo;
import co.sena.saaaf.security.CsrfToken;
import co.sena.saaaf.security.SeguridadFilter;
import co.sena.saaaf.servlet.ActivoServlet;
import co.sena.saaaf.servlet.DashboardServlet;
import co.sena.saaaf.util.Html;
import javax.servlet.*;
import javax.servlet.http.*;
import java.lang.reflect.*;
import java.sql.*;
import java.time.*;
import java.util.*;
import java.io.*;

/**
 * Runner sin JUnit. JDBC real contra HSQLDB de pruebas.
 * Servlets: solicitudes/respuestas dobles, no Tomcat ni ejecucion de JSP.
 * No se acredita compatibilidad real con MySQL con estas pruebas.
 */
public final class PruebasJava {
    private static int passed=0, failed=0;
    private static final String URL="jdbc:hsqldb:mem:saaaf_pruebas";
    private static ActivoDAO dao;
    @FunctionalInterface interface Action { void run() throws Exception; }
    private static void test(String id,String name,Action action) {
        try { action.run();passed++;System.out.println(id+" | APROBADA | "+name); }
        catch(Throwable error) {failed++;System.out.println(id+" | FALLIDA | "+name+" | "+error);error.printStackTrace();}
    }
    private static void require(boolean value,String message){if(!value)throw new AssertionError(message);}
    private static void rejects(Action action,Class<? extends Throwable> type)throws Exception{
        try{action.run();}catch(Throwable error){if(type.isInstance(error))return;throw new AssertionError("Tipo inesperado: "+error);}
        throw new AssertionError("Se esperaba rechazo: "+type.getSimpleName());
    }
    private static Activo asset(String code){
        Activo a=new Activo();a.setCodigoActivo(code);a.setNombreActivo("Equipo de prueba");a.setTipoActivo("Equipo TI");a.setArea("Tecnologia");a.setResponsable("");a.setEstado("Disponible");a.setFechaRegistro(LocalDate.of(2026,1,10));a.setObservaciones("Dato ficticio");return a;
    }
    private static void clear()throws Exception{try(Connection c=DriverManager.getConnection(URL,"SA","");Statement st=c.createStatement()){st.executeUpdate("DELETE FROM activos");}}
    private static int add(String code)throws Exception{dao.insertarActivo(ValidacionActivo.validar(asset(code)));return dao.listarActivos().get(0).getIdActivo();}
    private static Object defaultValue(Class<?> type){if(!type.isPrimitive())return null;if(type==boolean.class)return false;if(type==int.class)return 0;if(type==long.class)return 0L;if(type==double.class)return 0D;if(type==float.class)return 0F;if(type==short.class)return (short)0;if(type==byte.class)return (byte)0;return null;}
    static final class Exchange {
        Map<String,String> params=new HashMap<>();Map<String,Object> attrs=new HashMap<>(),sessionValues=new HashMap<>();Map<String,String> headers=new HashMap<>();
        int status=200;String redirect="",view="",encoding="";boolean sessionExists=true;
        HttpSession session=(HttpSession)Proxy.newProxyInstance(PruebasJava.class.getClassLoader(),new Class[]{HttpSession.class},(proxy,method,args)->{
            switch(method.getName()){
                case "getAttribute":return sessionValues.get((String)args[0]);
                case "setAttribute":sessionValues.put((String)args[0],args[1]);return null;
                case "getId":return "sesion-demo";
                default:return defaultValue(method.getReturnType());
            }
        });
        HttpServletRequest request=(HttpServletRequest)Proxy.newProxyInstance(PruebasJava.class.getClassLoader(),new Class[]{HttpServletRequest.class},(proxy,method,args)->{
            switch(method.getName()){
                case "getParameter":return params.get((String)args[0]);
                case "getAttribute":return attrs.get((String)args[0]);
                case "setAttribute":attrs.put((String)args[0],args[1]);return null;
                case "getSession":boolean create=args==null||args.length==0||Boolean.TRUE.equals(args[0]);return sessionExists||create?session:null;
                case "getContextPath":return "/saaaf-web";
                case "setCharacterEncoding":encoding=(String)args[0];return null;
                case "getRequestDispatcher":String target=(String)args[0];return new RequestDispatcher(){public void forward(ServletRequest a,ServletResponse b){view=target;}public void include(ServletRequest a,ServletResponse b){view=target;}};
                default:return defaultValue(method.getReturnType());
            }
        });
        HttpServletResponse response=(HttpServletResponse)Proxy.newProxyInstance(PruebasJava.class.getClassLoader(),new Class[]{HttpServletResponse.class},(proxy,method,args)->{
            switch(method.getName()){
                case "setStatus":status=(Integer)args[0];return null;
                case "sendRedirect":status=302;redirect=(String)args[0];return null;
                case "setHeader":headers.put((String)args[0],(String)args[1]);return null;
                case "setCharacterEncoding":return null;
                default:return defaultValue(method.getReturnType());
            }
        });
        Exchange csrf(){params.put("csrf",CsrfToken.obtener(request));return this;}
        Exchange form(String code){params.put("accion","guardar");params.put("codigoActivo",code);params.put("nombreActivo","Equipo servlet demo");params.put("tipoActivo","Equipo TI");params.put("area","Ventas");params.put("responsable","");params.put("estado","Disponible");params.put("fechaRegistro","2026-01-15");params.put("observaciones","Dato ficticio");return this;}
    }
    static class Controller extends ActivoServlet {Controller(ActivoDAO dao){super(dao);}void get(Exchange x)throws Exception{super.doGet(x.request,x.response);}void post(Exchange x)throws Exception{super.doPost(x.request,x.response);}}
    static class Dashboard extends DashboardServlet {Dashboard(ActivoDAO dao){super(dao);}void get(Exchange x)throws Exception{super.doGet(x.request,x.response);}}
    public static void main(String[] args)throws Exception{
        System.out.println("Fecha UTC: "+Instant.now());System.out.println("JDK: "+System.getProperty("java.version"));
        Class.forName("org.hsqldb.jdbcDriver");
        try(Connection c=DriverManager.getConnection(URL,"SA","");Statement st=c.createStatement()){
            System.out.println("JDBC de prueba: "+c.getMetaData().getDatabaseProductName()+" "+c.getMetaData().getDatabaseProductVersion());
            st.execute("CREATE TABLE activos (id_activo INTEGER GENERATED BY DEFAULT AS IDENTITY (START WITH 1) PRIMARY KEY,codigo_activo VARCHAR(30) NOT NULL,nombre_activo VARCHAR(120) NOT NULL,tipo_activo VARCHAR(60) NOT NULL,area VARCHAR(80) NOT NULL,responsable VARCHAR(100),estado VARCHAR(20) NOT NULL,fecha_registro DATE NOT NULL,observaciones VARCHAR(255),CONSTRAINT uq_codigo UNIQUE(codigo_activo))");
        }
        dao=new ActivoDAO(()->DriverManager.getConnection(URL,"SA",""));Controller controller=new Controller(dao);
        test("JV-01","Normalizar codigo y validar activo",()->require(ValidacionActivo.validar(asset(" act-001 ")).getCodigoActivo().equals("ACT-001"),"Normalizacion"));
        test("JV-02","Rechazar nombre vacio",()->{Activo a=asset("ACT-001");a.setNombreActivo("");rejects(()->ValidacionActivo.validar(a),IllegalArgumentException.class);});
        test("JV-03","Rechazar codigo corto",()->rejects(()->ValidacionActivo.validar(asset("A")),IllegalArgumentException.class));
        test("JV-04","Rechazar nombre demasiado largo",()->{Activo a=asset("ACT-001");a.setNombreActivo("x".repeat(121));rejects(()->ValidacionActivo.validar(a),IllegalArgumentException.class);});
        test("JV-05","Rechazar tipo vacio",()->{Activo a=asset("ACT-001");a.setTipoActivo("");rejects(()->ValidacionActivo.validar(a),IllegalArgumentException.class);});
        test("JV-06","Rechazar area nula",()->{Activo a=asset("ACT-001");a.setArea(null);rejects(()->ValidacionActivo.validar(a),IllegalArgumentException.class);});
        test("JV-07","Rechazar estado desconocido",()->{Activo a=asset("ACT-001");a.setEstado("Otro");rejects(()->ValidacionActivo.validar(a),IllegalArgumentException.class);});
        test("JV-08","Rechazar estado nulo de forma controlada",()->{Activo a=asset("ACT-001");a.setEstado(null);rejects(()->ValidacionActivo.validar(a),IllegalArgumentException.class);});
        test("JV-09","Asignado requiere responsable",()->{Activo a=asset("ACT-001");a.setEstado("Asignado");rejects(()->ValidacionActivo.validar(a),IllegalArgumentException.class);});
        test("JV-10","Rechazar fecha inexistente",()->rejects(()->ValidacionActivo.fecha("2026-02-30"),IllegalArgumentException.class));
        test("JV-11","Rechazar identificador no numerico",()->rejects(()->ValidacionActivo.id("abc"),IllegalArgumentException.class));
        test("JV-12","Rechazar fecha nula",()->rejects(()->ValidacionActivo.fecha(null),IllegalArgumentException.class));
        test("JV-13","Escapar HTML y atributos",()->require(Html.escape("<img x=\"a\">&'").equals("&lt;img x=&quot;a&quot;&gt;&amp;&#39;"),"Escape HTML"));
        test("JV-14","Token generado por sesion y valido",()->{Exchange x=new Exchange().csrf();require(CsrfToken.valido(x.request),"Token valido");require(x.params.get("csrf").length()>=40,"Longitud token");});
        test("JV-15","Rechazar token alterado",()->{Exchange x=new Exchange().csrf();x.params.put("csrf","incorrecto");require(!CsrfToken.valido(x.request),"Rechazo token");});
        test("JV-16","Rechazar token ausente",()->require(!CsrfToken.valido(new Exchange().request),"Token obligatorio"));
        test("JV-17","DAO insertar y listar con JDBC real",()->{clear();add("ACT-001");require(dao.listarActivos().size()==1,"Un registro");});
        test("JV-18","DAO consultar por ID",()->{clear();int id=add("ACT-001");require(dao.buscarPorId(id).getCodigoActivo().equals("ACT-001"),"Consulta ID");});
        test("JV-19","DAO actualizar registro",()->{clear();int id=add("ACT-001");Activo a=dao.buscarPorId(id);a.setNombreActivo("Nombre actualizado");require(dao.actualizarActivo(a),"Actualizado");require(dao.buscarPorId(id).getNombreActivo().equals("Nombre actualizado"),"Consulta despues de cambio");});
        test("JV-20","DAO informa actualizacion inexistente",()->{Activo a=asset("ACT-999");a.setIdActivo(999999);require(!dao.actualizarActivo(a),"Cero filas");});
        test("JV-21","DAO restriccion de codigo unico",()->{clear();add("ACT-001");rejects(()->add("ACT-001"),SQLException.class);require(dao.listarActivos().size()==1,"Sin duplicado");});
        test("JV-22","DAO guarda texto SQL como dato",()->{clear();Activo a=asset("ACT-001");a.setNombreActivo("'; DROP TABLE activos; --");dao.insertarActivo(a);require(dao.listarActivos().size()==1,"Tabla sigue existente");});
        test("JV-23","DAO eliminar registro",()->{clear();int id=add("ACT-001");require(dao.eliminarActivo(id),"Eliminado");require(dao.listarActivos().isEmpty(),"Lista vacia");});
        test("JV-24","DAO eliminar inexistente devuelve falso",()->require(!dao.eliminarActivo(999999),"Sin filas afectadas"));
        test("JV-25","GET eliminar devuelve 405 sin modificar",()->{clear();int id=add("ACT-001");Exchange x=new Exchange();x.params.put("accion","eliminar");x.params.put("id",String.valueOf(id));controller.get(x);require(x.status==405&&dao.listarActivos().size()==1,"GET no elimina");});
        test("JV-26","GET ID invalido devuelve 400",()->{Exchange x=new Exchange();x.params.put("accion","editar");x.params.put("id","abc");controller.get(x);require(x.status==400,"Estado 400");});
        test("JV-27","GET activo inexistente devuelve 404",()->{Exchange x=new Exchange();x.params.put("accion","editar");x.params.put("id","999999");controller.get(x);require(x.status==404,"Estado 404");});
        test("JV-28","GET listar prepara vista y token",()->{Exchange x=new Exchange();controller.get(x);require(x.status==200&&x.view.endsWith("activos.jsp")&&x.attrs.get("csrf")!=null,"Contrato controlador-vista");});
        test("JV-29","POST sin token devuelve 403",()->{Exchange x=new Exchange().form("ACT-003");controller.post(x);require(x.status==403,"Estado 403");});
        test("JV-30","POST invalido devuelve 400",()->{Exchange x=new Exchange().csrf().form("ACT-003");x.params.put("nombreActivo","");controller.post(x);require(x.status==400,"Estado 400");});
        test("JV-31","POST guardar inserta y redirige",()->{clear();Exchange x=new Exchange().csrf().form("ACT-001");controller.post(x);require(x.status==302&&x.redirect.endsWith("mensaje=registrado")&&dao.listarActivos().size()==1,"PRG y registro");});
        test("JV-32","POST duplicado devuelve 409",()->{clear();add("ACT-001");Exchange x=new Exchange().csrf().form("ACT-001");controller.post(x);require(x.status==409,"Estado 409");});
        test("JV-33","POST actualizar persiste los cambios",()->{clear();int id=add("ACT-001");Exchange x=new Exchange().csrf().form("ACT-001");x.params.put("accion","actualizar");x.params.put("idActivo",String.valueOf(id));x.params.put("nombreActivo","Edicion desde servlet");controller.post(x);require(x.status==302&&dao.buscarPorId(id).getNombreActivo().equals("Edicion desde servlet"),"Actualizacion servlet");});
        test("JV-34","POST eliminar con token elimina",()->{clear();int id=add("ACT-001");Exchange x=new Exchange().csrf();x.params.put("accion","eliminar");x.params.put("id",String.valueOf(id));controller.post(x);require(x.status==302&&dao.listarActivos().isEmpty(),"Eliminacion POST");});
        test("JV-35","Accion desconocida rechazada",()->{Exchange x=new Exchange().csrf();x.params.put("accion","desconocida");controller.post(x);require(x.status==400,"Estado 400");});
        test("JV-36","Error SQL no revela detalle tecnico",()->{ActivoDAO broken=new ActivoDAO(()->{throw new SQLException("secreto de infraestructura","08001");});Exchange x=new Exchange();new Controller(broken).get(x);require(x.status==500&&!x.attrs.get("error").toString().contains("secreto"),"Error generico");});
        test("JV-37","Dashboard calcula indicadores",()->{clear();add("ACT-001");Activo a=asset("ACT-002");a.setEstado("Asignado");a.setResponsable("Colaborador Demo");dao.insertarActivo(a);Exchange x=new Exchange();new Dashboard(dao).get(x);require(x.attrs.get("totalActivos").equals(2)&&x.attrs.get("disponibles").equals(1L)&&x.attrs.get("asignados").equals(1L),"Indicadores");});
        test("JV-38","Filtro agrega codificacion y cabeceras",()->{Exchange x=new Exchange();final boolean[] called={false};new SeguridadFilter().doFilter(x.request,x.response,(req,res)->called[0]=true);require(called[0]&&"UTF-8".equals(x.encoding)&&"nosniff".equals(x.headers.get("X-Content-Type-Options")),"Filtro invocado");});
        System.out.println("RESUMEN | "+passed+" aprobadas | "+failed+" fallidas");
        System.out.println("ALCANCE | Compilacion Java 11, validadores, DAO con HSQLDB y servlets con dobles. Sin MySQL ni Tomcat/JSP ejecutados.");
        if(failed>0)System.exit(1);
    }
}
