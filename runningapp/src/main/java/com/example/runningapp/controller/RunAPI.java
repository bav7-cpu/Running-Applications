package com.example.runningapp.controller;

import com.example.runningapp.dao.RunDao;
import com.example.runningapp.model.Run;
import com.example.runningapp.model.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

//this is the REST controller for handling run-related API endpoints

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/runs")
public class RunAPI {

    @Autowired
    private RunDao runDao;

 // this endpoint retrieves all non-deleted runs
    @GetMapping
    public ResponseEntity<ApiResponse> getAllRuns() {
        List<Run> runs = runDao.getAllRuns();
        return ResponseEntity.ok(new ApiResponse(true, "All runs retrieved", runs));
    }

 // this endpoint retrieves a specific run by its ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getRunById(@PathVariable int id) {
        try {
            Run run = runDao.getRunById(id);
            return ResponseEntity.ok(new ApiResponse(true, "Run retrieved", run));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(new ApiResponse(false, "Run with ID " + id + " not found", null));
        }
    }

 // this endpoint creates a new run with basic validation 
    @PostMapping
    public ResponseEntity<ApiResponse> createRun(@RequestBody Run run) {
        if (run.getRunDate() == null || run.getRunDistance() == null || run.getRunDuration() == null) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Run date, distance, and duration are required", null));
        }
        int result = runDao.addRun(run);
        return ResponseEntity.ok(new ApiResponse(result > 0, result > 0 ? "Run added successfully" : "Failed to add run", run));
    }

 // this endpoint updates an existing run using its ID, with basic validation
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateRun(@PathVariable int id, @RequestBody Run run) {
        if (run.getRunDate() == null || run.getRunDistance() == null || run.getRunDuration() == null) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Run date, distance, and duration are required", null));
        }

        try {
            Run existingRun = runDao.getRunById(id);
            if (existingRun == null) {
                return ResponseEntity.status(404).body(new ApiResponse(false, "Run with ID " + id + " not found", null));
            }

            run.setRunID(id); // make sure the run ID is set
            int result = runDao.updateRun(run);
            return ResponseEntity.ok(new ApiResponse(result > 0, "Run updated successfully", run));

        } catch (org.springframework.dao.EmptyResultDataAccessException e) {
            return ResponseEntity.status(404).body(new ApiResponse(false, "Run with ID " + id + " not found", null));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse(false, "Error updating run: " + e.getMessage(), null));
        }
    }

    // this endpoint soft-deletes a run (marking it as deleted instead of removing it from the database
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> softDeleteRun(@PathVariable int id) {
        int result = runDao.softDeleteRun(id);
        return ResponseEntity.ok(new ApiResponse(result > 0, result > 0 ? "Run deleted successfully" : "Failed to delete run", null)); 
    }

 // this endpoint restores a previously soft-deleted run
    @PutMapping("/{id}/restore")
    public ResponseEntity<ApiResponse> restoreRun(@PathVariable int id) {
        int result = runDao.restoreRun(id);
        return ResponseEntity.ok(new ApiResponse(result > 0, result > 0 ? "Run restored successfully" : "Failed to restore run", null));
    }

 // this endpoint retrieves all soft-deleted runs for a specific user
    @GetMapping("/deleted/{userId}")
    public ResponseEntity<ApiResponse> getDeletedRuns(@PathVariable int userId) {
        List<Run> deletedRuns = runDao.getDeletedRunsByUser(userId);
        return ResponseEntity.ok(new ApiResponse(true, "Deleted runs retrieved", deletedRuns));
    }

 // this endpoint retrieves runs from the last 7 days for a specific user
    // going to use this for the graph creation
    @GetMapping("/recent/{userId}")
    public ResponseEntity<ApiResponse> getRecentRuns(@PathVariable int userId) {
        List<Run> recentRuns = runDao.getRecentRuns(userId);
        return ResponseEntity.ok(new ApiResponse(true, "Recent runs retrieved", recentRuns));
    }
    
 // this endpoint retrieves all non-deleted runs for a specific user
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse> getRunsByUser(@PathVariable int userId) {
        try {
            List<Run> runs = runDao.getRunsByUserId(userId);
            return ResponseEntity.ok(new ApiResponse(true, "Runs for user retrieved", runs));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse(false, "Error retrieving runs: " + e.getMessage(), null));
        }
    }
}
