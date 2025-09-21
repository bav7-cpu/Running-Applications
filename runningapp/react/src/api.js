import axios from "axios";

// axios instance is initialized for api calls
const API = axios.create({
	baseURL: "/api",
});

// authorise user details
export const loginUser = (data) => API.post("/users/login", data);
export const registerUser = (data) => API.post("/users", data);
export const getUserProfile = (userId) => API.get(`/users/${userId}`);


// runs
// gets a specific users runs 
export const getRuns = (userID) => {
	if (!userID) {
		console.warn("getRuns called without a valid userID!");
		return Promise.reject("Missing user ID");
	}
	return API.get(`/runs/user/${userID}`);
};


export const createRun = (data) => API.post("/runs", data);
export const updateRun = (id, data) => API.put(`/runs/${id}`, data);
export const deleteRun = (id) => API.delete(`/runs/${id}`);
export const restoreRun = (id) => API.put(`/runs/restore/${id}`);

// goals
export const getGoals = (userId) => API.get(`/goals/user/${userId}`);
export const createGoal = (data) => API.post("/goals", data);
export const updateGoal = (id, data) => API.put(`/goals/${id}`, data);
export const deleteGoal = (id) => API.delete(`/goals/${id}`);
export const restoreGoal = (id) => API.put(`/goals/${id}/restore`);
export const getGoalById = (id) => API.get(`/goals/${id}`);