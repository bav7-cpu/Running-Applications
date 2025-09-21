import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api";
import { Container, Row, Col } from "react-bootstrap";

function Login({ onLogin }) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleLogin = async (e) => {
		e.preventDefault();
		setError("");

		if (!username || !password) {
			setError("Unable to progress");
			return;
		}

		try {
			const res = await loginUser({ username, password });
			if (res.data?.success && res.data?.data?.userID) {
				onLogin(res.data.data);
				navigate("/");
			} else {
				setError("Unable to progress");
			}
		} catch {
			setError("Unable to progress");
		}
	};

	return (
		<Container className="mt-5">
			<Row className="justify-content-center">
				<Col xs={12} sm={10} md={8} lg={6}>
					<h2 className="text-center">Welcome To RunTracker!</h2>
					<form onSubmit={handleLogin}>
						<input
							type="text"
							className="form-control mb-2"
							placeholder="Username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
						/>
						<input
							type="password"
							className="form-control mb-2"
							placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
						{error && <div className="text-danger mb-2">{error}</div>}
						<button type="submit" className="btn btn-primary w-100 mb-2">Login</button>
					</form>
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