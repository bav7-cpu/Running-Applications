package com.example.runningapp.util;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

// this class allows for password hashing/encryption
@Configuration
public class SecurityConfiguration {

	// a bean is created for bcypt to be used
	// password is encrypted before storing it in the database
	@Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12); // strength 12 (2^12), above this might make it a bit too slow performance wise
    }
}
