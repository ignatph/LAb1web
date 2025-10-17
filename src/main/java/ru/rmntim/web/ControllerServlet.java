package ru.rmntim.web;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet(name = "ControllerServlet", urlPatterns = {"/controller"})
public class ControllerServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        dispatch(req, resp);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setStatus(HttpServletResponse.SC_METHOD_NOT_ALLOWED);
        resp.setContentType("text/plain; charset=UTF-8");
        resp.getWriter().write("Метод POST не поддерживается. Используйте GET.");
    }

    private void dispatch(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        boolean hasParams = req.getParameter("x") != null && req.getParameter("y") != null && req.getParameter("r") != null;
        String accept = req.getHeader("Accept");
        boolean wantsJson = accept != null && accept.toLowerCase().contains("application/json");

        if (hasParams || wantsJson) {
            req.getRequestDispatcher("/area-check").forward(req, resp);
        } else {
            req.getRequestDispatcher("/index.jsp").forward(req, resp);
        }
    }
}


