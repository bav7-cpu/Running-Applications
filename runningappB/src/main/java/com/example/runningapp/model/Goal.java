package com.example.runningapp.model;

import java.math.BigDecimal;
import java.time.LocalDate;

//this modal class represents a run goal for a user (e.g., run 10 km, run 3x/week)


public class Goal {
    private int goalID;
    private int userID;
    private String goalName;
    private BigDecimal goalDistance; // nullable
    private String  goalFrequency;   // nullable
    private LocalDate targetDate;    // optional
    private String unit;             // km or miles
    private boolean isDeleted;		//softdelete

    
    // default constructor
    public Goal() {}

    // constructor with relevant parameters
    
    public Goal(int goalID, int userID, BigDecimal goalDistance, String goalFrequency, LocalDate targetDate, boolean isDeleted) {
        this.goalID = goalID;
        this.userID = userID;
        this.goalDistance = goalDistance;
        this.goalFrequency = goalFrequency;
        this.targetDate = targetDate;
        this.isDeleted = isDeleted;
    }
    
    // Getters & Setters

    public int getGoalID() { 
    	return goalID; }
    
    public void setGoalID(int goalID) {
    	this.goalID = goalID; }

    public int getUserID() { 
    	return userID; }
    
    public void setUserID(int userID) { 
    	this.userID = userID; }

    public String getGoalName() { 
    	return goalName; }
    
    public void setGoalName(String goalName) { 
    	this.goalName = goalName; }

    public BigDecimal getGoalDistance() { 
    	return goalDistance; }
    public void setGoalDistance(BigDecimal goalDistance) { 
    	this.goalDistance = goalDistance; }

    public String  getGoalFrequency() { 
    	return goalFrequency; }
    
    public void setGoalFrequency(String  goalFrequency) { 
    	this.goalFrequency = goalFrequency; }

    public LocalDate getTargetDate() { 
    	return targetDate; }
    
    public void setTargetDate(LocalDate targetDate) { 
    	this.targetDate = targetDate; }

    public String getUnit() { 
    	return unit; }
    
    public void setUnit(String unit) { 
    	this.unit = unit; }

    public boolean getIsDeleted() { 
    	return isDeleted; }
    
    public void setIsDeleted(boolean isDeleted) { 
    	this.isDeleted = isDeleted; }
}
