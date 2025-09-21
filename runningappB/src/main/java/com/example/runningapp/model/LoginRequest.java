package com.example.runningapp.model;

//this class represents the login request body sent from the frontend
public class LoginRequest {
    private String username;
    private String password;

    // default constructor
    public LoginRequest() {}

    // constructor with parameters
    public LoginRequest(String username, String password) {
        this.username = username;
        this.password = password;
    }

    // getters and setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
