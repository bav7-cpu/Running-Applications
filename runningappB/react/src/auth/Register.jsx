import React, { useState } from "react";
import { registerUser } from "../api";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

function Register() {
	const [form, setForm] = useState({
		username: "",
		name: "",
		password: "",
		confirmPassword: "",
		unitPreference: "km",
	});

	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		if (!form.name || !form.username || !form.password || !form.confirmPassword) {
			setError("Unable to create account.");
			return;
		}

		if (form.password !== form.confirmPassword) {
			setError("Passwords do not match.");
			return;
		}

		try {
			const res = await registerUser(form);
			if (res.data.success) {
				navigate("/login");
			} else {
				setError(res.data.message || "Registration failed.");
			}
		} catch (err) {
			if (err.response?.status === 400) {
				setError("Username already exists. Please choose a different one.");
			} else {
				setError("Something went wrong. Please try again later.");
			}
		}
	};

	return (
		<Container className="mt-5">
			<Row className="justify-content-center">
				<Col xs={12} sm={10} md={8} lg={6}>
					<h2 className="text-center mb-4">Create Account</h2>
					<form onSubmit={handleSubmit}>
						{error && <div className="alert alert-danger">{error}</div>}
						<Form.Group className="mb-3">
							<Form.Label>Full Name</Form.Label>
							<Form.Control
								type="text"
								name="name"
								placeholder="First and Last Name"
								value={form.name}
								onChange={handleChange}
							/>
						</Form.Group>

						<Form.Group className="mb-3">
							<Form.Label>Username</Form.Label>
							<Form.Control
								type="text"
								name="username"
								placeholder="Username"
								value={form.username}
								onChange={handleChange}
							/>
						</Form.Group>

						<Form.Group className="mb-3">
							<Form.Label>Password</Form.Label>
							<Form.Control
								type="password"
								name="password"
								placeholder="Password"
								value={form.password}
								onChange={handleChange}
							/>
						</Form.Group>

						<Form.Group className="mb-3">
							<Form.Label>Confirm Password</Form.Label>
							<Form.Control
								type="password"
								name="confirmPassword"
								placeholder="Confirm Password"
								value={form.confirmPassword}
								onChange={handleChange}
							/>
						</Form.Group>

						<Form.Group className="mb-4">
							<Form.Label>Preferred Unit</Form.Label>
							<Form.Select
								name="unitPreference"
								value={form.unitPreference}
								onChange={handleChange}
							>
								<option value="km">Kilometers</option>
								<option value="miles">Miles</option>
							</Form.Select>
						</Form.Group>

						<Button type="submit" className="btn btn-primary w-100">
							Create Account
						</Button>

						<div className="text-center mt-3">
							<Button
								variant="outline-dark"
								onClick={() => navigate("/login")}
								className="w-100"
							>
								Back to Login
							</Button>
						</div>
					</form>
				</Col>
			</Row>
		</Container>
	);
}

export default Register;
