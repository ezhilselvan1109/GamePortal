package com.game.home;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/home")
public class Servlet extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String email=request.getParameter("email");
        String password=request.getParameter("password");
        String res=Database.get(email,password);
        response.getWriter().print(res);
    }
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String name=request.getParameter("name");
        String email=request.getParameter("email");
        String password=request.getParameter("password");
        String res=Database.post(name,email,password);
        response.getWriter().print(res);
    }
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String email=request.getParameter("email");
        String password=request.getParameter("password");
        String res=Database.put(email,password);
        response.getWriter().print(res);
    }
}