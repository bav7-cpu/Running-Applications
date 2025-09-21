import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AppNavbar from "./components/Navbar";
import Homepage from "./pages/Homepage";
import Calendar from "./pages/RunCalendar";
import DeletedRuns from "./pages/DeletedRuns";
import DeletedGoals from "./pages/DeletedGoals";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import AddRun from "./pages/AddRun";
import EditRun from "./pages/EditRun";
import AddGoal from "./pages/AddGoal";
import EditGoal from "./pages/EditGoal";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Goals from "./pages/Goals";
import { UserContext } from "./context/UserContext";

function App() {
	const [user, setUser] = useState(null);

// Function to handle login and store user info
	const handleLogin = (userData) => {
		setUser(userData);
		localStorage.setItem("user", JSON.stringify(userData));
	};

	// Clears user info and logs out
	const handleLogout = () => {
		setUser(null);
		localStorage.removeItem("user");
	};

	return (
		
		<UserContext.Provider value={user}>
		{/* Makes it so the navbar is only rendered when the user logs into the app */}
			{user && <AppNavbar onLogout={handleLogout} />}
			<Routes>
				{!user ? (
					<>
					{/* routes for non authenticated users */}
						<Route path="/login" element={<Login onLogin={handleLogin} />} />
						<Route path="/register" element={<Register onRegister={handleLogin} />} />
						<Route path="*" element={<Navigate to="/login" replace />} />
					</>
				) : (
					// Routes accessible only when user is authenticated
					<>
						<Route path="/home" element={<Homepage />} />
						<Route path="/calendar" element={<Calendar />} />
						<Route path="/deleted-runs" element={<DeletedRuns />} />
						<Route path="/deleted-goals" element={<DeletedGoals />} />
						<Route path="/addrun" element={<AddRun />} />
						<Route path="/editrun/:runId" element={<EditRun />} />
						<Route path="/goals" element={<Goals />} />
						<Route path="/addgoal" element={<AddGoal />} />
						<Route path="/editgoal/:goalId" element={<EditGoal />} />
						<Route path="/profile" element={<Profile onLogout={handleLogout} />} />
						<Route path="/profile/edit" element={<EditProfile onLogin={handleLogin} />} />
						<Route path="/" element={<Navigate to="/home" replace />} />
						<Route path="*" element={<Navigate to="/home" replace />} />
					</>
				)}
			</Routes>
		</UserContext.Provider>
	);
}

export default App;
