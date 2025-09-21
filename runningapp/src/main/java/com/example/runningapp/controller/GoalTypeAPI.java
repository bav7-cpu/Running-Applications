package com.example.runningapp.controller;

import com.example.runningapp.dao.GoalTypeDao;
import com.example.runningapp.model.GoalType;
import com.example.runningapp.model.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goal-types")
public class GoalTypeAPI {

    @Autowired
    private GoalTypeDao goalTypeDao;

    @GetMapping
    public ResponseEntity<ApiResponse> getAllGoalTypes() {
        List<GoalType> list = goalTypeDao.getAllGoalTypes();
        return ResponseEntity.ok(new ApiResponse(true, "Goal types retrieved", list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getGoalType(@PathVariable int id) {
        try {
            GoalType g = goalTypeDao.getGoalTypeById(id);
            return ResponseEntity.ok(new ApiResponse(true, "Goal type found", g));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(new ApiResponse(false, "Goal type not found", null));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse> addGoalType(@RequestBody GoalType goalType) {
        try {
            int result = goalTypeDao.addGoalType(goalType);
            return ResponseEntity.ok(new ApiResponse(result > 0, "GoalType added successfully", goalType));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse(false, "Error adding goal type: " + e.getMessage(), null));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateGoalType(@PathVariable int id, @RequestBody GoalType goalType) {
        goalType.setGoalTypeID(id);
        try {
            int result = goalTypeDao.updateGoalType(goalType);
            return ResponseEntity.ok(new ApiResponse(result > 0, "GoalType updated successfully", goalType));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse(false, "Error updating goal type: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteGoalType(@PathVariable int id) {
        try {
            int result = goalTypeDao.deleteGoalType(id);
            return ResponseEntity.ok(new ApiResponse(result > 0, "GoalType deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse(false, "Error deleting goal type: " + e.getMessage(), null));
        }
    }
}
