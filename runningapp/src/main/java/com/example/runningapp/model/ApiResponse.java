package com.example.runningapp.model;

//this class is used to structure API responses consistently across the application

public class ApiResponse {
    private boolean success;
    private String message;
    private Object data;

    public ApiResponse() {}

    //constructor, with parameters 
    public ApiResponse(boolean success, String message, Object data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }
// getters and setters
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }
}
