import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api";
import { Spinner, OverlayTrigger, Tooltip, Container, Row, Col,Form, Button, } from "react-bootstrap";

/**
 * Login authorisation page
 * the class handles login access with username and password validation
 */
function Login({ onLogin }) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	/**
	 * This method handles the login form submission
	 * performs the loginAPI request
	 * Also uses the localStorage to store the user in.
	 */

	const handleLogin = async (e) => {
		e.preventDefault();
		setError("");


		if (!username || !password) {
			setError("Username and password are required");
			return;
		}

		try {
			setLoading(true);
			const res = await loginUser({ username, password });
			// proceeds if the response is successful
			if (res.data?.success && res.data?.data?.userID) {
				const user = res.data.data;
				localStorage.setItem("user", JSON.stringify(user));
				// I decided to use the "setTimeout" for heuristic implementation
				setTimeout(() => {
					onLogin(user);	// onLogin is the function given by app.jsx parent component (line 40 has the child component), the "user" is the user data 
					navigate("/");	//navigates to the home
				}, 1500);
			} else {
				setError(res.data?.message || "Login failed.");
				setLoading(false);
			}
		} catch (err) {
			console.error("Login request failed:", err);
			setError("Invalid credentials. Please check your username and password.");
			setLoading(false);
		}
	};

	return (
			<Container className="mt-5">
				<Row className="justify-content-center">
					<Col xs={12} sm={10} md={8} lg={6}>
						<h2 className="text-center">
							Welcome To RunTracker!{" "}
							<OverlayTrigger
								placement="right"
								overlay={<Tooltip>Enter your username and password to login. Or register by clicking "Create Account"</Tooltip>}
							>
								{/* Tooltip provides the heuristic of "help" */}
								<span
									className="text-info"
									style={{ cursor: "pointer" }}
									tabIndex="0"
									role="button"
									aria-label="Login help tooltip"
								>
									?
								</span>
							</OverlayTrigger>
						</h2>

						{/* Rendering including the spinner animation to give user feedback (another heuristic) */}
						{loading ? (
							<div className="text-center my-4">
								<Spinner animation="border" />
							</div>
						) : (
							<form onSubmit={handleLogin}>
								<input
									type="text"
									className={`form-control mb-2 ${!username && error ? "is-invalid" : ""}`}
									placeholder="Username"
									value={username}
									onChange={(e) => setUsername(e.target.value)}
								/>
								<input
									type="password"
									className={`form-control mb-2 ${!password && error ? "is-invalid" : ""}`}
									placeholder="Password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
								{/* Error message, so the user isnt kept guessing with why they cant login, user feedback heuristic */}
								{error && <div className="text-danger mb-2">{error}</div>}
								<button type="submit" className="btn btn-primary w-100 mb-2">Login</button>
							</form>
						)}

						{/* Redirect button that follows the wcag non-functional requirement of colour contrast */}
						<div className="d-flex justify-content-start mt-2">
							<button
								className="btn"
								style={{ backgroundColor: "navy", color: "white", borderColor: "navy" }}
								onClick={() => navigate("/register")}
							>
								Create Account
							</button>
						</div>
					</Col>
				</Row>
			</Container>
		);
	}

export default Login;
