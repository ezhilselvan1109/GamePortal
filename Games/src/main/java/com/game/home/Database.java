package com.game.home;

import com.game.database.DatabaseConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class Database {
    public static String post(String name,String email,String password){
        String response=null;
        boolean flag=isExists(email);
        if (!flag){
            try{
                Connection connection = DatabaseConnection.getDbConnection();
                PreparedStatement ps=connection.prepareStatement("insert into member(name,email,password) values (?,?,?)");
                ps.setString(1,name);
                ps.setString(2,email);
                ps.setString(3,password);
                System.out.println(ps.executeUpdate());
                connection.close();
            }catch(Exception ex){
                ex.printStackTrace();
            }
            response="Register";
        }else {
            response="AlreadyExist";
        }
        return response;
    }
    public static String get(String email,String password){
        boolean flag=isExists(email);
        String response=null;
        boolean flagValue=true;
        if (flag){
            try {
                Connection connection = DatabaseConnection.getDbConnection();
                PreparedStatement ps = connection.prepareStatement("select * from member");
                ResultSet rs = ps.executeQuery();
                while (rs.next()) {
                    if (rs.getString(3).equals(email) && rs.getString(4).equals(password)) {
                        flagValue=false;
                        response="true";
                        break;
                    }
                }
                connection.close();
            } catch (Exception ex) {
                ex.printStackTrace();
            }
            if(flagValue){
                response="wrong";
            }
        }else{
            response="false";
        }
        return response;
    }

    public static String put(String email,String password) {
        String response=null;
        boolean flag=isExists(email);
        if (flag){
            try{
                Connection connection = DatabaseConnection.getDbConnection();
                PreparedStatement ps=connection.prepareStatement("update member set password=? where email=?");
                ps.setString(1,password);
                ps.setString(2,email);
                ps.executeUpdate();
                connection.close();
            }catch(Exception ex){
                ex.printStackTrace();
            }
            response="true";
        }else {
            response="false";
        }
        return response;
    }

    private static boolean isExists(String email){
        try{
            Connection connection = DatabaseConnection.getDbConnection();
            PreparedStatement ps=connection.prepareStatement("select * from member");
            ResultSet rs=ps.executeQuery();
            while(rs.next()){
                if(rs.getString(3).equals(email)){
                    return true;
                }
            }
            connection.close();
        }catch(Exception ex){
            ex.printStackTrace();
        }
        return false;
    }
}
