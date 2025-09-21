package com.example.runningapp.model;

public class GoalType {
    private int goalTypeID;
    private double distance;
    private String frequency;
    private String pace;

    public GoalType() {}

    public GoalType(int goalTypeID, double distance, String frequency, String pace) {
        this.goalTypeID = goalTypeID;
        this.distance = distance;
        this.frequency = frequency;
        this.pace = pace;
    }

    public int getGoalTypeID() {
        return goalTypeID;
    }

    public void setGoalTypeID(int goalTypeID) {
        this.goalTypeID = goalTypeID;
    }

    public double getDistance() {
        return distance;
    }

    public void setDistance(double distance) {
        this.distance = distance;
    }

    public String getFrequency() {
        return frequency;
    }

    public void setFrequency(String frequency) {
        this.frequency = frequency;
    }

    public String getPace() {
        return pace;
    }

    public void setPace(String pace) {
        this.pace = pace;
    }
}
