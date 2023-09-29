package com.game.sudoku;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/sudoku/sudoku")
public class Servlet extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        int id = Integer.parseInt(request.getParameter("id"));
        String json = Database.get(id,"get");
        response.getWriter().write(json);
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        int id = Integer.parseInt(request.getParameter("id"));
        int totalMinute = Integer.parseInt(request.getParameter("total_minute"));
        int total_second = Integer.parseInt(request.getParameter("total_second"));
        int errors = Integer.parseInt(request.getParameter("error"));
        Database.post(id, totalMinute, total_second, errors);
        response.getWriter().print("Done");

    }
}

