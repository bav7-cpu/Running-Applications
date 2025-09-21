package com.example.runningapp.dao;

import com.example.runningapp.model.GoalType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.*;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.util.List;

@Repository
public class GoalTypeDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<GoalType> getAllGoalTypes() {
        String sql = "SELECT * FROM GoalTypes";
        return jdbcTemplate.query(sql, new GoalTypeMapper());
    }

    public GoalType getGoalTypeById(int id) {
        String sql = "SELECT * FROM GoalTypes WHERE goalTypeID = ?";
        return jdbcTemplate.queryForObject(sql, new GoalTypeMapper(), id);
    }

    public int addGoalType(GoalType goalType) {
        System.out.println("INSERTING: " + goalType.getDistance() + ", " + goalType.getFrequency() + ", " + goalType.getPace());

        String sql = "INSERT INTO goaltypes (distance, frequency, pace) VALUES (?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        int result = jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setDouble(1, goalType.getDistance());
            ps.setString(2, goalType.getFrequency());
            ps.setString(3, goalType.getPace());
            return ps;
        }, keyHolder);

        if (keyHolder.getKey() != null) {
            goalType.setGoalTypeID(keyHolder.getKey().intValue());
        }

        return result;
    }


    public int updateGoalType(GoalType goalType) {
        String sql = "UPDATE GoalTypes SET distance = ?, frequency = ?, pace = ? WHERE goalTypeID = ?";
        return jdbcTemplate.update(sql,
                goalType.getDistance(),
                goalType.getFrequency(),
                goalType.getPace(),
                goalType.getGoalTypeID());
    }

    public int deleteGoalType(int id) {
        String sql = "DELETE FROM GoalTypes WHERE goalTypeID = ?";
        return jdbcTemplate.update(sql, id);
    }

    private static class GoalTypeMapper implements RowMapper<GoalType> {
        @Override
        public GoalType mapRow(ResultSet rs, int rowNum) throws SQLException {
            GoalType g = new GoalType();
            g.setGoalTypeID(rs.getInt("goalTypeID"));
            g.setDistance(rs.getDouble("distance"));
            g.setFrequency(rs.getString("frequency"));
            g.setPace(rs.getString("pace"));
            return g;
        }
    }
}
