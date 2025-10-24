package ru.rmntim.web;

import ru.rmntim.Checker;
import ru.rmntim.ValidationException;
import ru.rmntim.Validator;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.ServletContext;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.Map;
import java.util.HashMap;

@WebServlet(name = "AreaCheckServlet", urlPatterns = {"/area-check"})
public class AreaCheckServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        process(req, resp);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setStatus(HttpServletResponse.SC_METHOD_NOT_ALLOWED);
        resp.setContentType("text/plain; charset=UTF-8");
        resp.getWriter().write("Метод POST не поддерживается. Используйте GET.");
    }

    private void process(HttpServletRequest req, HttpServletResponse resp) throws IOException, ServletException {
        long startTime = System.nanoTime();

        Map<String, String> params = extractParams(req);

        try {
            if (!params.containsKey("x") || !params.containsKey("y") || !params.containsKey("r")) {
                sendError(resp, "Отсутствуют параметры x, y, r");
                return;
            }

            float x = parseAndValidate(params.get("x"), "x");
            float y = parseAndValidate(params.get("y"), "y");
            float r = parseAndValidate(params.get("r"), "r");

            boolean isHit = Checker.isHit(x, y, r);
            long workTime = (System.nanoTime() - startTime) / 1000;
            String currentTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

            ResultEntry entry = new ResultEntry(x, y, r, isHit, currentTime, workTime);
            storeInApplication(req.getServletContext(), entry);

            String accept = req.getHeader("Accept");
            boolean wantsJson = accept != null && accept.toLowerCase().contains("application/json");

            if (wantsJson) {
                resp.setCharacterEncoding(StandardCharsets.UTF_8.name());
                resp.setContentType("application/json");
                try (PrintWriter out = resp.getWriter()) {
                    out.printf(Locale.US, "{\"x\":%.3f,\"y\":%.3f,\"r\":%.3f,\"result\":%s,\"workTime\":%d,\"currentTime\":\"%s\"}",
                            x, y, r, isHit, workTime, currentTime);
                }
            } else {
                req.setAttribute("result", entry);
                req.getRequestDispatcher("/result.jsp").forward(req, resp);
                return;
            }
        } catch (ValidationException e) {
            sendError(resp, e.getMessage());
        } catch (Exception e) {
            sendError(resp, "Внутренняя ошибка сервера");
        }
    }

    private Map<String, String> extractParams(HttpServletRequest req) throws IOException {
        Map<String, String> params = new HashMap<>();

        String contentType = req.getContentType();
        boolean isJson = contentType != null && contentType.toLowerCase().contains("application/json");

        if (isJson) {
            StringBuilder sb = new StringBuilder();
            try (BufferedReader reader = req.getReader()) {
                String line;
                while ((line = reader.readLine()) != null) {
                    sb.append(line);
                }
            }
            String body = sb.toString();
            String cleaned = body.replaceAll("[{}\"]", "").trim();
            if (!cleaned.isEmpty()) {
                String[] pairs = cleaned.split(",");
                for (String p : pairs) {
                    String[] kv = p.split(":", 2);
                    if (kv.length == 2) {
                        params.put(kv[0].trim(), kv[1].trim());
                    }
                }
            }
        } else {
            if (req.getParameter("x") != null) params.put("x", req.getParameter("x"));
            if (req.getParameter("y") != null) params.put("y", req.getParameter("y"));
            if (req.getParameter("r") != null) params.put("r", req.getParameter("r"));
        }
        return params;
    }

    private float parseAndValidate(String value, String name) throws ValidationException {
        try {
            String normalized = value.replace(',', '.');
            float number = Float.parseFloat(normalized);
            if ("x".equals(name)) {
                if (!Validator.validateX(number)) {
                    throw new ValidationException("X должен быть в диапазоне -5..5");
                }
            } else if ("y".equals(name)) {
                if (!Validator.validateY(number)) {
                    throw new ValidationException("Y должен быть в диапазоне -5..3");
                }
            } else if ("r".equals(name)) {
                if (!Validator.validateR(number)) {
                    throw new ValidationException("R должен быть в диапазоне 1..4");
                }
            }
            return number;
        } catch (NumberFormatException e) {
            throw new ValidationException("Параметр " + name + " должен быть числом");
        }
    }

    private void storeInApplication(ServletContext context, ResultEntry entry) {
        ApplicationStorage.addResult(context, entry);
    }

    private void sendError(HttpServletResponse resp, String message) throws IOException {
        resp.setCharacterEncoding(StandardCharsets.UTF_8.name());
        resp.setContentType("application/json");
        try (PrintWriter out = resp.getWriter()) {
            out.printf("{\"error\":\"%s\"}", message.replace("\"", "'"));
        }
    }
}


