# Running-Applications
The following repository contains 2 running applications that I developed. They focus on testing Nielsen's heuristics in health-based web applications.
The purpose of this was to deploy 2 health-based running web applications in order to 
validate or invalidate whether Nielsens set of 10 heuristics created are still relevant in 
modern web applications or not. Both applications have utilized java and spring for the 
backend. For the frontend React, Axios, Highchart.js and bootstrap were all used. In 
terms of creating the tables in the database, MySQL Workbench was utilized for both 
applications. 
Java 17 SE was used to create both applications. 

Running Applications on LocalHost: - - - - 
Prior to running the applications on your device, you should run the scripts in a relevant database and connect to the database (make relevant changes in the following file:  scr/main/java > application.properties) 

In order to run the application successfully on your local device, you must first run the backend on your device prior to the frontend. 

To run the backend on localhost you must click on Java Resources > scr/main/java > “.com.example.runningapp” package > right click “RunAppApplication.java” > Run as > click “2 java application”.  

To run the frontend on locaclhost you must right click the react folder > show in local terminal > terminal > type “npm run dev” within this terminal and in the 
browser url type in the url that is provided e.g http://localhost:5173/. 
