package com.game.sudoku;

import com.game.database.DatabaseConnection;
import com.google.gson.Gson;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;


public class Database {
    static Sudoku sudoku;

    public static String get(int id, String choice) {
        boolean flag = false;
        Gson gson = new Gson();
        String returnStatement = null;
        try {
            Connection connection = DatabaseConnection.getDbConnection();
            PreparedStatement ps = connection.prepareStatement("select * from sudoku where member_id=?");
            ps.setInt(1, id);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                flag = true;
                sudoku = new Sudoku(rs.getInt(3), rs.getInt(4), rs.getInt(5));
            }
            connection.close();
            if (flag) {
                returnStatement = gson.toJson(sudoku);
            } else {
                if (choice.equals("get"))
                    returnStatement = gson.toJson(new Sudoku(0, 0, 0));
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return returnStatement;
    }

    public static void post(int id, int total_minute, int total_second, int errors) {
        String flag = get(id,"post");
        if (flag != null) {
            update(id, total_minute, total_second, errors);
        } else {
            try {
                Connection connection = DatabaseConnection.getDbConnection();
                PreparedStatement ps = connection.prepareStatement("insert into sudoku(member_id,minute,second,error) values (?,?,?,?)");
                ps.setInt(1, id);
                ps.setInt(2, total_minute);
                ps.setInt(3, total_second);
                ps.setInt(4, errors);
                ps.executeUpdate();
                connection.close();
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }
    }

    public static void update(int id, int total_minute, int total_second, int errors) {
        if (sudoku.getTotal_minute() == total_minute && sudoku.getTotal_second() < total_second) {
            total_second = sudoku.getTotal_second();
        }
        if (sudoku.getTotal_minute() < total_minute) {
            total_minute = sudoku.getTotal_minute();
        }
        if (errors > sudoku.getErrors()) {
            errors = sudoku.getErrors();
        }
        try {
            Connection connection = DatabaseConnection.getDbConnection();
            PreparedStatement ps = connection.prepareStatement("update sudoku set minute=?,second=?,error=? where member_id=? ");
            ps.setInt(1, total_minute);
            ps.setInt(2, total_second);
            ps.setInt(3, errors);
            ps.setInt(4, id);
            ps.executeUpdate();
            connection.close();
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }
}
