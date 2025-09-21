package com.example.runningapp.exception;

import com.example.runningapp.model.ApiResponse;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

//this class handles exceptions thrown by the entire application in a central way
@ControllerAdvice
public class GlobalExceptionHandler {

	// this method handles any general exception that isn't caught elsewhere
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse> handleGeneralException(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse(false, "Internal server error: " + ex.getMessage(), null));
    }

    // this method handles cases where a database query returns no result, despite expecting one
    @ExceptionHandler(EmptyResultDataAccessException.class)
    public ResponseEntity<ApiResponse> handleNotFoundException() {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse(false, "Requested resource not found", null));
    }
}
