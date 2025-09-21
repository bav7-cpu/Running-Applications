package com.example.runningapp.model;

public class RunGoal {
    private int runGoalID;
    private int runID;
    private int goalID;
    private double contributionQuantity;

    public RunGoal() {}

    public RunGoal(int runGoalID, int runID, int goalID, double contributionQuantity) {
        this.runGoalID = runGoalID;
        this.runID = runID;
        this.goalID = goalID;
        this.contributionQuantity = contributionQuantity;
    }

    public int getRunGoalID() {
        return runGoalID;
    }

    public void setRunGoalID(int runGoalID) {
        this.runGoalID = runGoalID;
    }

    public int getRunID() {
        return runID;
    }

    public void setRunID(int runID) {
        this.runID = runID;
    }

    public int getGoalID() {
        return goalID;
    }

    public void setGoalID(int goalID) {
        this.goalID = goalID;
    }

    public double getContributionQuantity() {
        return contributionQuantity;
    }

    public void setContributionQuantity(double contributionQuantity) {
        this.contributionQuantity = contributionQuantity;
    }
}
