package com.example.runningapp.dao;

import com.example.runningapp.model.Run;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.*;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.util.List;

//this is the DAO class for connecting run details to the MYSQL database

@Repository
public class RunDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

 // this method is where all non-deleted runs are retrieved from the database
    public List<Run> getAllRuns() {
        String sql = "SELECT * FROM runs WHERE isDeleted = false";
        return jdbcTemplate.query(sql, new RunMapper());
    }
    
    // this method will retrieve a run by its ID
    public Run getRunById(int id) {
        String sql = "SELECT * FROM runs WHERE runID = ?";
        return jdbcTemplate.queryForObject(sql, new RunMapper(), id);
    }

 // this method is where a run is added to the database
    public int addRun(Run run) {
        String sql = "INSERT INTO runs (userID, runDate, runDistance, runDuration, runSpeed, unit, additionalDetails, isDeleted) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

     // keyholder allows for the auto-generated PK to be accessed instantly after it has been inserted
        KeyHolder keyHolder = new GeneratedKeyHolder();

        // lambda used to prepare the SQL insert statement with the run's parameter values
        int result = jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, run.getUserID());
            ps.setDate(2, run.getRunDate());
            ps.setBigDecimal(3, run.getRunDistance());
            ps.setTime(4, run.getRunDuration());
            ps.setBigDecimal(5, run.getRunSpeed());
            ps.setString(6, run.getUnit());
            ps.setString(7, run.getAdditionalDetails());
            ps.setBoolean(8, run.getIsDeleted());
            return ps;
        }, keyHolder);// keyholder gets generated keys after execution

        // if key was generated, set it on the run object

        if (keyHolder.getKey() != null) {
            run.setRunID(keyHolder.getKey().intValue());
        }

        return result;
    }

 // this method will update an existing run's details in the database
    public int updateRun(Run run) {
        String sql = "UPDATE runs SET userID = ?, runDate = ?, runDistance = ?, runDuration = ?, runSpeed = ?, unit = ?, " +
                     "additionalDetails = ?, isDeleted = ? WHERE runID = ?";
        return jdbcTemplate.update(sql,
                run.getUserID(),
                run.getRunDate(),
                run.getRunDistance(),
                run.getRunDuration(),
                run.getRunSpeed(),
                run.getUnit(),
                run.getAdditionalDetails(),
                run.getIsDeleted(),
                run.getRunID());
    }
 
    // this method will soft delete a run, useful for keeping records without showing them in the frontend
    public int softDeleteRun(int runID) {
        String sql = "UPDATE runs SET isDeleted = true WHERE runID = ?";
        return jdbcTemplate.update(sql, runID);
    }

    // this method allows a soft-deleted run to be restored
    public int restoreRun(int runID) {
        String sql = "UPDATE runs SET isDeleted = false WHERE runID = ?";
        return jdbcTemplate.update(sql, runID);
    }

 // this method gets all deleted runs for a specific user
    public List<Run> getDeletedRunsByUser(int userId) {
        String sql = "SELECT * FROM runs WHERE userID = ? AND isDeleted = true";
        return jdbcTemplate.query(sql, new RunMapper(), userId);
    }

    // this method gets runs for the past 7 days for a specific user, sorted by date
    public List<Run> getRecentRuns(int userId) {
    	//split into new lines for readability, where each section of the query has ended 
        String sql = "SELECT * \r\n"
        		+ "FROM runs \r\n"
        		+ "WHERE userID = ? \r\n"
        		// current date - 7 days, to get last 7 days of runs
        		+ "  AND runDate >= CURDATE() - INTERVAL 7 DAY \r\n"
        		+ "  AND isDeleted = false \r\n"
        		+ "ORDER BY runDate DESC;\r\n";
        return jdbcTemplate.query(sql, new RunMapper(), userId);
    }
    
 // this method gets all non-deleted runs for a specific user, sorted by date
    public List<Run> getRunsByUserId(int userId) {
    	String sql = "SELECT * FROM runs WHERE userID = ? AND isDeleted = false ORDER BY runDate DESC";
    	return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Run.class), userId);
    }


 // this is a helper class that maps each row from the result set to a Run object
    private static class RunMapper implements RowMapper<Run> {
        @Override
        public Run mapRow(ResultSet rs, int rowNum) throws SQLException {
            Run run = new Run(); // create a new run object
            // set the fields from the result set
            run.setRunID(rs.getInt("runID"));
            run.setUserID(rs.getInt("userID"));
            run.setRunDate(rs.getDate("runDate"));
            run.setRunDistance(rs.getBigDecimal("runDistance"));
            run.setRunDuration(rs.getTime("runDuration"));
            run.setRunSpeed(rs.getBigDecimal("runSpeed"));
            run.setUnit(rs.getString("unit"));
            run.setAdditionalDetails(rs.getString("additionalDetails"));
            run.setIsDeleted(rs.getBoolean("isDeleted"));
            return run; // return the populated run object
        } 
    }
}
