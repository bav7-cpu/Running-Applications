package com.example.runningapp.dao;

import com.example.runningapp.model.Goal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.*;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.util.List;

//this is the DAO class for connecting goal details to the MYSQL database
@Repository
public class GoalDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

 // this method retrieves all non-deleted goals from the database
    public List<Goal> getAllGoals() {
        String sql = "SELECT * FROM goalsappb WHERE isDeleted = false";
        return jdbcTemplate.query(sql, new GoalMapper());
    }

 // this method retrieves all non-deleted goals for a specific user
    public List<Goal> getGoalsByUserId(int userId) {
        String sql = "SELECT * FROM goalsappb WHERE userID = ? AND isDeleted = false";
        return jdbcTemplate.query(sql, new GoalMapper(), userId);
    }

 // this method adds a new goal to the database
    public int addGoal(Goal goal) {
        String sql = "INSERT INTO goalsappb (userID, goalName, goalDistance, goalFrequency, targetDate, unit, isDeleted) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?)";

     // sets values from the goal object into the SQL insert statement
        return jdbcTemplate.update(sql,
            goal.getUserID(),
            goal.getGoalName(),
            goal.getGoalDistance(),
            goal.getGoalFrequency(),
            goal.getTargetDate(),
            goal.getUnit(),
            goal.getIsDeleted()
        );
    }

 // this method updates an existing goal in the database
    public int updateGoal(Goal goal) {
        String sql = "UPDATE goalsappb SET goalName = ?, goalDistance = ?, goalFrequency = ?, targetDate = ?, unit = ?, isDeleted = ? WHERE goalID = ?";
        return jdbcTemplate.update(sql,
            goal.getGoalName(),
            goal.getGoalDistance(),
            goal.getGoalFrequency(),
            goal.getTargetDate(),
            goal.getUnit(),
            goal.getIsDeleted(),
            goal.getGoalID()
        );
    }

 // this method soft-deletes a goal, meaning it won't show up but still exists in the database
    public int softDeleteGoal(int goalId) {
        String sql = "UPDATE goalsappb SET isDeleted = true WHERE goalID = ?";
        return jdbcTemplate.update(sql, goalId);
    }

 // this method restores a previously soft-deleted goal
    public int restoreGoal(int goalId) {
        String sql = "UPDATE goalsappb SET isDeleted = false WHERE goalID = ?";
        return jdbcTemplate.update(sql, goalId);
    }

    // this method retrieves a goal by its ID
    public Goal getGoalById(int goalId) {
        String sql = "SELECT * FROM goalsappb WHERE goalID = ?";
        return jdbcTemplate.queryForObject(sql, new GoalMapper(), goalId);
    }

 // this method retrieves all soft-deleted goals for a specific user
    public List<Goal> getDeletedGoalsByUserId(int userId) {
        String sql = "SELECT * FROM goalsappb WHERE userID = ? AND isDeleted = true";
        return jdbcTemplate.query(sql, new GoalMapper(), userId);
    }

 // this helper class maps each row from the result set to a Goal object
    private static class GoalMapper implements RowMapper<Goal> {
        @Override
        public Goal mapRow(ResultSet rs, int rowNum) throws SQLException {
            Goal goal = new Goal(); // create a new goal object
            goal.setGoalID(rs.getInt("goalID"));
            goal.setUserID(rs.getInt("userID"));
            goal.setGoalName(rs.getString("goalName"));
            goal.setGoalDistance(rs.getBigDecimal("goalDistance"));
            goal.setGoalFrequency(rs.getString("goalFrequency")); // handle nulls
            goal.setTargetDate(rs.getDate("targetDate") != null ? rs.getDate("targetDate").toLocalDate() : null);
            goal.setUnit(rs.getString("unit"));
            goal.setIsDeleted(rs.getBoolean("isDeleted"));
            return goal; // return the populated goal object
        }
    }
}
