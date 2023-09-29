package com.game.members;

import com.game.database.DatabaseConnection;
import com.google.gson.Gson;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

public class Database {
    public static String get(){
        String response=null;
        try{
            Gson gson=new Gson();
            List<Member> list=new ArrayList<>();
            Connection connection = DatabaseConnection.getDbConnection();
            PreparedStatement ps=connection.prepareStatement("select * from member order by id asc");
            ResultSet rs=ps.executeQuery();
            while (rs.next()) {
                list.add(new Member(rs.getInt(1),rs.getString(3),rs.getString(2)));
            }
            connection.close();
            response=gson.toJson(list);
        }catch(Exception ex){
            ex.printStackTrace();
        }
        return response;
    }
}
