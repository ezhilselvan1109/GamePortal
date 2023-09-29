package com.game.session;

import com.game.database.DatabaseConnection;
import com.google.gson.Gson;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class Database {
    public static String delete(int session_id, int session_from, String session_game) {
        Connection connection = null;
        try {
            connection = DatabaseConnection.getDbConnection();
            PreparedStatement ps = connection.prepareStatement("delete from session where id=?");
            ps.setInt(1, session_id);
            ps.executeUpdate();
            connection.close();
        } catch (Exception ex) {
            ex.printStackTrace();
        } finally {
            try {
                connection.close();
            } catch (SQLException e) {
                throw new RuntimeException(e);
            }
        }
        return getData(session_from, session_game);
    }

    public static String get(int session_from) {
        String returnData = null;
        Connection connection = null;
        try {
            Gson gson = new Gson();
            List<Session> list = new ArrayList<>();
            connection = DatabaseConnection.getDbConnection();
            PreparedStatement ps = connection.prepareStatement("SELECT member.name,member.email,session.id, session.game_name,session.session_from,session.session_to,session.choice,session.is_Played FROM member INNER JOIN session ON (session.session_from=? and session.session_to=member.id)or (session.session_to=? and session.session_from=member.id)");
            ps.setInt(1, session_from);
            ps.setInt(2, session_from);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                list.add(new Session(rs.getString(1), rs.getString(2), rs.getInt(3), rs.getString(4), rs.getInt(5), rs.getInt(6), rs.getString(7), rs.getBoolean(8)));
            }
            connection.close();
            returnData = gson.toJson(list);
        } catch (Exception ex) {
            ex.printStackTrace();
        } finally {
            try {
                connection.close();
            } catch (SQLException e) {
                throw new RuntimeException(e);
            }
        }
        return returnData;
    }

    public static String post(int session_from, int session_to, String session_game, String choice) {
        Connection connection = null;
        try {
            connection = DatabaseConnection.getDbConnection();
            PreparedStatement ps = connection.prepareStatement("insert into session(session_from,session_to,game_name,choice) values (?,?,?,?)");
            ps.setInt(1, session_from);
            ps.setInt(2, session_to);
            ps.setString(3, session_game);
            ps.setString(4, choice);
            ps.executeUpdate();
        } catch (Exception ex) {
            ex.printStackTrace();
        } finally {
            try {
                connection.close();
            } catch (SQLException e) {
                throw new RuntimeException(e);
            }
        }
        return getData(session_from, session_game);
    }

    private static String getData(int session_from, String session_game) {
        String returnData = null;
        Connection connection = null;
        Gson gson = new Gson();
        try {
            List<Session> list = new ArrayList<>();
            connection = DatabaseConnection.getDbConnection();
            PreparedStatement ps = connection.prepareStatement("SELECT member.name,member.email,session.id, session.game_name,session.session_from,session.session_to,session.choice,session.is_Played FROM member INNER JOIN session ON (session.session_from=? and session.session_to=member.id)or (session.session_to=? and session.session_from=member.id)");
            ps.setInt(1, session_from);
            ps.setInt(2, session_from);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                if (rs.getString(4).equals(session_game)) {
                    list.add(new Session(rs.getString(1), rs.getString(2), rs.getInt(3), rs.getString(4), rs.getInt(5), rs.getInt(6), rs.getString(7), rs.getBoolean(8)));
                }
            }
            connection.close();
            returnData = gson.toJson(list);
        } catch (Exception ex) {
            ex.printStackTrace();
        } finally {
            try {
                connection.close();
            } catch (SQLException e) {
                throw new RuntimeException(e);
            }
        }
        return returnData;
    }

    public static String put(int id) {
        String response = null;
        try {
            Connection connection = DatabaseConnection.getDbConnection();
            PreparedStatement ps = connection.prepareStatement("update session set is_Played=true where id=?");
            ps.setInt(1, id);
            if(ps.executeUpdate()==1)
                response = "true";
            else
                response = "false";
            connection.close();
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return response;
    }
}
