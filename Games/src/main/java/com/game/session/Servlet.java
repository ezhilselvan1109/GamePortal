package com.game.session;

import javax.servlet.annotation.WebServlet;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/session")
public class Servlet extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        int session_from= Integer.parseInt(request.getParameter("request_session_from"));
        String json=Database.get(session_from);
        response.getWriter().print(json);
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        int session_from= Integer.parseInt(request.getParameter("request_session_from"));
        int session_to= Integer.parseInt(request.getParameter("request_session_to"));
        String session_game=request.getParameter("session_game");
        String choice=request.getParameter("choice");
        String json=Database.post(session_from,session_to,session_game,choice);
        response.getWriter().print(json);
    }

    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String[] req= request.getParameter("id").split(":");
        int session_id= Integer.parseInt(req[0]);
        int session_from= Integer.parseInt(req[2]);
        String session_game=req[1];
        String json=Database.delete(session_id,session_from,session_game);
        response.getWriter().print(json);
    }

    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        int session_id= Integer.parseInt(request.getParameter("id"));
        String json=Database.put(session_id);
        response.getWriter().print(json);
    }
}