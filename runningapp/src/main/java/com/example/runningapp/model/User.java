package com.example.runningapp.model;


// this class represents a user of the running appv
public class User {
    private int userID;
    private String username;
    private String name;
    private String password;
    private String unitPreference;
    private boolean isDeleted;
    
    // default constructor
    public User() {}

    //  constructor without userID, when user registers  
    public User(String username, String name, String password, String unitPreference) {
        this.username = username;
        this.name = name;
        this.password = password;
        this.unitPreference = unitPreference;
        this.isDeleted = false; // default
    }
    
 // full constructor, used when loading user from the database
    public User(int userID, String username, String name, String password, String unitPreference, boolean isDeleted) {
        this.userID = userID;
        this.username = username;
        this.name = name;
        this.password = password;
        this.unitPreference = unitPreference;
        this.isDeleted = isDeleted;
    }

    //getters and setters
    public int getUserID() {
        return userID;
    }

    public void setUserID(int userID) {
        this.userID = userID;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUnitPreference() {
        return unitPreference;
    }

    public void setUnitPreference(String unitPreference) {
        this.unitPreference = unitPreference;
    }

    public boolean isDeleted() {
        return isDeleted;
    }

    public void setDeleted(boolean deleted) {
        isDeleted = deleted;
    }
}
