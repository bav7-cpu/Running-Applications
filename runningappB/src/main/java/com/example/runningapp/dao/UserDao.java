package com.example.runningapp.dao;

import com.example.runningapp.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

// this is the DAO class for connecting user details to the MYSQL database

@Repository
public class UserDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // this method is where a user is added to the database
    public int addUser(User user) {
        String sql = "INSERT INTO usersappb (username, name, password, unitPreference) VALUES (?, ?, ?, ?)";

        
        //keyholder allows for the auto-genereated PK to be accessed instantly after it has been inserted
        // there is no need to requery the DB 
        // it allows for the id to not remain at 0 but rather increment automatically
        KeyHolder keyHolder = new GeneratedKeyHolder();

      //lambda used to prepare the SQL insert statement with the user's parameter values
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, new String[]{"userID"});
            ps.setString(1, user.getUsername());
            ps.setString(2, user.getName());
            ps.setString(3, user.getPassword());
            ps.setString(4, user.getUnitPreference());
            return ps;
        }, keyHolder); // keyholder gets generated keys after execution

        Number generatedId = keyHolder.getKey(); //finds auto-generated PK's from schema
        if (generatedId != null) {
            user.setUserID(generatedId.intValue());
            return 1; //if not null the key was successfully retrieved
        } else {
            return 0;
        }
    }

    // this method is where all users are retrieved, useful for checking if users have been inserted into database or not
    public List<User> getAllUsers() {
        String sql = "SELECT * FROM usersappb WHERE isDeleted = FALSE";
        return jdbcTemplate.query(sql, this::mapRowToUser);
    }

    // this method will retrieve a user by their id
    public User getUserById(int userId) {
    	String sql = "SELECT * FROM usersappb WHERE userID = ?";
        try {
            return jdbcTemplate.queryForObject(sql, this::mapRowToUser, userId);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    // this method will update a users details
    public int updateUser(User user) {
        String sql = "UPDATE usersappb SET username = ?, name = ?, password = ?, unitPreference = ? WHERE userID = ?";
        return jdbcTemplate.update(sql, user.getUsername(), user.getName(), user.getPassword(), user.getUnitPreference(), user.getUserID());
    }

    // this method will softdelete a user, useful since they won't be permanently deleted when delete is clicked in frontend
    public int softDeleteUser(int userId) {
        String sql = "UPDATE usersappb SET isDeleted = TRUE WHERE userID = ?";
        return jdbcTemplate.update(sql, userId);
    }
    
    //this method allows for a user to be restored, may be useful for database 
    public int restoreUser(int userId) {
        String sql = "UPDATE usersappb SET isDeleted = FALSE WHERE userID = ?";
        return jdbcTemplate.update(sql, userId);
    }

    // this helper method turns SQL query into a user object 
    private User mapRowToUser(ResultSet rs, int rowNum) throws SQLException {
        User user = new User(); // the user object
        // fields for the ResultSet
        user.setUserID(rs.getInt("userID"));
        user.setUsername(rs.getString("username"));
        user.setName(rs.getString("name"));
        user.setPassword(rs.getString("password"));
        user.setUnitPreference(rs.getString("unitPreference"));
        user.setDeleted(rs.getBoolean("isDeleted"));
        return user; // then the populated user object is returned
    }
    
    // this method returns a user by their username 
    public User getUserByUsername(String username) {
        String sql = "SELECT * FROM usersappb WHERE username = ? AND isDeleted = FALSE";
        try {
            return jdbcTemplate.queryForObject(sql, this::mapRowToUser, username);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

}
