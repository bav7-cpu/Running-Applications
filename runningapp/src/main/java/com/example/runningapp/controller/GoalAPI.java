package com.example.runningapp.controller;

import com.example.runningapp.dao.GoalDao;
import com.example.runningapp.model.Goal;
import com.example.runningapp.model.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

//this is the REST controller for handling goal-related API endpoints

@RestController
@RequestMapping("/api/goals")
public class GoalAPI {

    @Autowired
    private GoalDao goalDao;

 // this endpoint returns all non-deleted goals
    @GetMapping
    public ResponseEntity<ApiResponse> getAllGoals() {
        List<Goal> goals = goalDao.getAllGoals();
        return ResponseEntity.ok(new ApiResponse(true, "All goals retrieved", goals));
    }

 // this endpoint returns all non-deleted goals for a specific user
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse> getGoalsByUserId(@PathVariable int userId) {
        List<Goal> goals = goalDao.getGoalsByUserId(userId);
        return ResponseEntity.ok(new ApiResponse(true, "Goals retrieved for user", goals));
    }

 // this endpoint creates a new goal, with validation checks
    @PostMapping
    public ResponseEntity<ApiResponse> createGoal(@RequestBody Goal goal) {
        // Validation: Either distance or frequency must be provided
    	if ((goal.getGoalDistance() == null || goal.getGoalDistance().doubleValue() == 0.0)
    	        && (goal.getGoalFrequency() == null || goal.getGoalFrequency().trim().isEmpty())) {
    	    return ResponseEntity.badRequest().body(
    	        new ApiResponse(false, "Either goal distance or frequency must be provided.", null)
    	    );
    	}


        try {
            int result = goalDao.addGoal(goal); // insert the goal into the database
            return ResponseEntity.ok(new ApiResponse(result > 0, "Goal created successfully", goal));
        } catch (DataIntegrityViolationException e) {
        	// check if error is due to an invalid FK of userID
            String message;
            if (e.getMessage().contains("FOREIGN KEY (`userID`)")) {
                message = "Invalid user ID. Please ensure the user exists before assigning a goal.";
            } else {
                message = "Error creating goal. Please check the input values.";
            }
            return ResponseEntity.status(400).body(new ApiResponse(false, message, null));
        } catch (Exception e) {
        	//unexpected errors are caught here
            e.printStackTrace();
            return ResponseEntity.status(500).body(
                    new ApiResponse(false, "An unexpected error occurred. Please try again later.", null)
            );
        }
    }

 // this endpoint updates an existing goal using its ID
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateGoal(@PathVariable int id, @RequestBody Goal goal) {
        try {
            goal.setGoalID(id);	 // make sure the goalID is set before updating

            // the following if statements check for validation:
            // of name and at least 1 of distance or frequency to be filled
            if (goal.getGoalName() == null || goal.getGoalName().isBlank()) {
                return ResponseEntity.badRequest().body(new ApiResponse(false, "Goal name is required.", null));
            }

            if (goal.getGoalDistance() == null && goal.getGoalFrequency() == null) {
                return ResponseEntity.badRequest().body(new ApiResponse(false, "At least one of distance or frequency must be specified.", null));
            }

            int result = goalDao.updateGoal(goal); //update into the database
            if (result > 0) {
                return ResponseEntity.ok(new ApiResponse(true, "Goal updated successfully", goal));
            } else {
                return ResponseEntity.status(404).body(new ApiResponse(false, "Goal not found or not updated", null));
            }

        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                new ApiResponse(false, "An unexpected error occurred while updating the goal.", null)
            );
        }
    }

 // this endpoint soft-deletes a goal by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteGoal(@PathVariable int id) {
        int result = goalDao.softDeleteGoal(id);
        if (result > 0) {
            return ResponseEntity.ok(new ApiResponse(true, "Goal deleted successfully", null));
        } else {
            return ResponseEntity.status(404).body(new ApiResponse(false, "Goal not found or already deleted", null));
        }
    }
    
 // this endpoint gets a specific goal by its ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getGoalById(@PathVariable int id) {
        Goal goal = goalDao.getGoalById(id);
        if (goal != null) {
            return ResponseEntity.ok(new ApiResponse(true, "Goal retrieved", goal));
        } else {
            return ResponseEntity.status(404).body(new ApiResponse(false, "Goal not found", null));
        }
    }

    
 // this endpoint restores a previously soft-deleted goal
    @PutMapping("/{id}/restore")
    public ResponseEntity<ApiResponse> restoreGoal(@PathVariable int id) {
        int result = goalDao.restoreGoal(id);
        if (result > 0) {
            Goal goal = goalDao.getGoalById(id);
            return ResponseEntity.ok(new ApiResponse(true, "Goal restored successfully", goal));
        } else {
            return ResponseEntity.status(404).body(new ApiResponse(false, "Goal not found or not deleted", null));
        }
    }

 // this endpoint returns all soft-deleted goals for a specific user
    @GetMapping("/deleted/{userId}")
    public ResponseEntity<ApiResponse> getDeletedGoals(@PathVariable int userId) {
        List<Goal> goals = goalDao.getDeletedGoalsByUserId(userId);
        return ResponseEntity.ok(new ApiResponse(true, "Deleted goals retrieved", goals));
    }
}
