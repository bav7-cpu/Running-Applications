package com.example.runningapp.model;

// big decimal instead of double, initially there was errors in the RunDAO so had to change it to big decimal
// double didnt allow for deciamls to be stored. whilst big decimal allows for precise decimals

import java.math.BigDecimal;
import java.sql.Date;
import java.sql.Time;

//this class epresents a running activity record for a user

public class Run {
    private int runID;
    private int userID;
    private Date runDate;
    private BigDecimal runDistance;
    private Time runDuration;
    private BigDecimal runSpeed;
    private String unit;
    private String additionalDetails;
    private boolean isDeleted;

    // default constructor
    public Run() {}

 // constructor with all parameters
    public Run(int runID, int userID, Date runDate, BigDecimal runDistance, Time runDuration,
               BigDecimal runSpeed, String unit, String additionalDetails, boolean isDeleted) {
        this.runID = runID;
        this.userID = userID;
        this.runDate = runDate;
        this.runDistance = runDistance;
        this.runDuration = runDuration;
        this.runSpeed = runSpeed;
        this.unit = unit;
        this.additionalDetails = additionalDetails;
        this.isDeleted = isDeleted;
    }

 // getters and setters
    public int getRunID() {
        return runID;
    }

    public void setRunID(int runID) {
        this.runID = runID;
    }

    public int getUserID() {
        return userID;
    }

    public void setUserID(int userID) {
        this.userID = userID;
    }

    public Date getRunDate() {
        return runDate;
    }

    public void setRunDate(Date runDate) {
        this.runDate = runDate;
    }

    public BigDecimal getRunDistance() {
        return runDistance;
    }

    public void setRunDistance(BigDecimal runDistance) {
        this.runDistance = runDistance;
    }

    public Time getRunDuration() {
        return runDuration;
    }

    public void setRunDuration(Time runDuration) {
        this.runDuration = runDuration;
    }

    public BigDecimal getRunSpeed() {
        return runSpeed;
    }

    public void setRunSpeed(BigDecimal runSpeed) {
        this.runSpeed = runSpeed;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public String getAdditionalDetails() {
        return additionalDetails;
    }

    public void setAdditionalDetails(String additionalDetails) {
        this.additionalDetails = additionalDetails;
    }

    public boolean getIsDeleted() {
        return isDeleted;
    }

    public void setIsDeleted(boolean isDeleted) {
        this.isDeleted = isDeleted;
    }
}
