DROP TABLE IF EXISTS rungoalsappb;
DROP TABLE IF EXISTS runsappb;
DROP TABLE IF EXISTS goalsappb;
DROP TABLE IF EXISTS usersappb;

-- username cant be null and userID autoincrements. 
-- Password is not null either and unit preference given at this stage, will also have option to select unit later on
CREATE TABLE usersappb (
    userID INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100),
    password VARCHAR(255) NOT NULL,
    unitPreference ENUM('km', 'miles') DEFAULT 'km',
    isDeleted BOOLEAN DEFAULT FALSE
);

-- self explanatory autoincrementation and not null values
-- userID and goalTypeID must match a value in their relevant tables
-- delete cascade means goals associated with the userID will be deleted when the userID is deleted
-- similar concept with goalTypeID
CREATE TABLE goalsappb (
	goalID INT PRIMARY KEY AUTO_INCREMENT,
    userID INT NOT NULL,
    goalName VARCHAR(100) NOT NULL,
    goalDistance DECIMAL(6,2),
    goalFrequency VARCHAR(50),
    targetDate DATE,
    unit ENUM('km', 'miles') DEFAULT 'km',
    isDeleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (userID) REFERENCES usersappb(userID) ON DELETE CASCADE,
    CHECK (goalDistance IS NOT NULL OR goalFrequency IS NOT NULL)
);



-- same idea with the "6,2" and autoincrementation and not nulls
-- unit option here again incase user changes their mind
-- isDeleted auto set to false and allows for undoDeletion
-- runs associated with userID will be deleted if the userID is deleted
-- distance is >0
CREATE TABLE runsappb (
    runID INT PRIMARY KEY AUTO_INCREMENT,
    userID INT NOT NULL,
    runDate DATE NOT NUusersappbLL,
    runDistance DECIMAL(6,2) NOT NULL CHECK (runDistance > 0),
    runDuration TIME NOT NULL,
    runSpeed DECIMAL(5,2),
    unit ENUM('km', 'miles'),
    additionalDetails TEXT,
    isDeleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (userID) REFERENCES usersappb(userID) ON DELETE CASCADE
);

-- all runGoals associated with runID's will be deleted if the runID is deleted
-- this is useful since the progress won't be kept for a goal if a run that contributed to the total is delted. 
-- same with goalID 
CREATE TABLE rungoalsappb (
    runGoalID INT PRIMARY KEY AUTO_INCREMENT,
    runID INT NOT NULL,
    goalID INT NOT NULL,
    contributionQuantity DECIMAL(6,2) CHECK (contributionQuantity > 0),
    FOREIGN KEY (runID) REFERENCES runsappb(runID) ON DELETE CASCADE,
    FOREIGN KEY (goalID) REFERENCES goalsappb(goalID) ON DELETE CASCADE
);

-- lets data be reached much quicker
CREATE INDEX idx_user_run ON runsappb(userID, runDate);
CREATE INDEX idx_goal_user ON goalsappb(userID);
CREATE INDEX idx_run_goal ON rungoalsappb(runID, goalID);