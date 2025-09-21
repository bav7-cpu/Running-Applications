package com.example.runningapp.controller;

import com.example.runningapp.dao.UserDao;
import com.example.runningapp.model.User;
import com.example.runningapp.model.ApiResponse;
import com.example.runningapp.model.LoginRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

//this is the REST controller for handling user-related API endpoints

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/users")
public class UserAPI {

    @Autowired
    private UserDao userDao;

    @Autowired
    private PasswordEncoder passwordEncoder;

 // this endpoint retrieves all non-deleted users,
    // done to test on postman as well alongside MYSQL from the userDAO
    @GetMapping
    public ResponseEntity<ApiResponse> getAllUsers() {
        List<User> users = userDao.getAllUsers();
        return ResponseEntity.ok(new ApiResponse(true, "All users retrieved", users));
    }

 // this endpoint retrieves a specific user by their ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getUserById(@PathVariable int id) {
        try {
            User user = userDao.getUserById(id);
            return ResponseEntity.ok(new ApiResponse(true, "User retrieved", user));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(new ApiResponse(false, "User with ID " + id + " not found", null));
        }
    }

 // this endpoint creates a new user account, basic validation of username and password 
    @PostMapping
    public ResponseEntity<ApiResponse> createUser(@RequestBody User user) {
        if (user.getUsername() == null || user.getPassword() == null) {
            return ResponseEntity.badRequest().body(
                new ApiResponse(false, "Username and password are required", null)
            );
        }

        try {
        	 // hash the password before storing it
            user.setPassword(passwordEncoder.encode(user.getPassword()));

            int result = userDao.addUser(user);
            if (result > 0) {
                return ResponseEntity.ok(new ApiResponse(true, "User created successfully", user));
            } else {
                return ResponseEntity.status(500).body(new ApiResponse(false, "Failed to create user", null));
            }
        } catch (DuplicateKeyException e) {
        	// incase another account already has this username
            return ResponseEntity.status(400).body(new ApiResponse(false, "Username already exists. Please choose a different username.", null));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse(false, "Internal server error: " + e.getMessage(), null));
        }
    }

 // this endpoint updates an existing user's info using their ID
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateUser(@PathVariable int id, @RequestBody User user) {
        if (user.getUsername() == null || user.getPassword() == null) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Username and password are required", null));
        }

        try {
            User existingUser = userDao.getUserById(id);
            if (existingUser == null) {
                return ResponseEntity.status(404).body(new ApiResponse(false, "User with ID " + id + " not found", null));
            }

         // hash the updated password before saving
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            user.setUserID(id); // and ensure the correct ID is linked

            int result = userDao.updateUser(user);
            return ResponseEntity.ok(new ApiResponse(result > 0, "User updated successfully", user));

        } catch (Exception e) {
            String errorMessage = e.getMessage();
            if (errorMessage != null && errorMessage.contains("Duplicate entry") && errorMessage.contains("username")) {
                return ResponseEntity.status(400).body(new ApiResponse(false, "Error updating user: duplicate username. Please change the username and try again.", null));
            }
            return ResponseEntity.status(500).body(new ApiResponse(false, "Error updating user: " + errorMessage, null));
        }
    }

 // this endpoint soft-deletes a user, probably wont end up using since there is no admin 
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteUser(@PathVariable int id) {
        int result = userDao.softDeleteUser(id);
        return ResponseEntity.ok(new ApiResponse(result > 0, result > 0 ? "User deleted successfully" : "Failed to delete user", null));
    }
    
 // this endpoint handles user login using a username and password
    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@RequestBody LoginRequest loginRequest) {
        String username = loginRequest.getUsername();
        String rawPassword = loginRequest.getPassword();

        //ensure that both username and password are entered
        // rawpassword since it is the non-hashed password the user enters
        if (username == null || rawPassword == null) {
            return ResponseEntity.badRequest().body(
                new ApiResponse(false, "Username and password are required", null)
            );
        }

        // check if user exists
        User user = userDao.getUserByUsername(username);

        if (user == null) {
        	System.out.println("LOGIN ERROR: Username does not exist");
            return ResponseEntity.status(401).body(new ApiResponse(false, "Invalid credentials, ensure the user exists", null));
        }

     // check if password matches the hashed one in the database
        boolean passwordMatches = passwordEncoder.matches(rawPassword, user.getPassword());

        if (!passwordMatches) {
        	System.out.println("LOGIN ERROR: Password mismatch");
            return ResponseEntity.status(401).body(new ApiResponse(false, "Invalid credentials, password doesn't match", null));
        }

        // better for security like this
        // the hashed password is not part of the user object, 
        // instead null is sent back in the API response. 
        user.setPassword(null);

        return ResponseEntity.ok(new ApiResponse(true, "Login successful", user));
    }
}
