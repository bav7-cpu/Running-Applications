import React, { useState } from "react";
import { registerUser } from "../api";
import { useNavigate } from "react-router-dom";
import { Spinner, OverlayTrigger, Tooltip, Button, Toast, Container, Row, Col, Form, } from "react-bootstrap";
import { BsArrowLeft } from "react-icons/bs";

/**
 * Register authorisation page
 * the class handles creating a new user account by taking input fields,
 * validating them and sending to the backend for registration
 */

function Register() {
	const [form, setForm] = useState({
		username: "",
		name: "",
		password: "",
		confirmPassword: "",
		unitPreference: "km",
	});

	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [toastMsg, setToastMsg] = useState("");
	const [showToast, setShowToast] = useState(false);

	const navigate = useNavigate();

	/**
	   * this method updates the form  values as the user types
	   */
	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	/**
	   * this method handles form submission
	   * validates the input, sends the form data to the registerUser API
	   * shows success or error messages based on the result (heuristic for feedback)
	   */
	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		if (
			!form.name.trim() ||
			!form.username.trim() ||
			!form.password ||
			!form.confirmPassword
		) {
			setError("Please fill in all fields.");
			return;
		}

		if (form.password !== form.confirmPassword) {
			setError("Passwords do not match.");
			return;
		}

		try {
			setLoading(true);
			const res = await registerUser(form);
			if (res.data.success) {
				setToastMsg("Account created successfully!");
				setShowToast(true);
				setLoading(false);


				// the pause to allow for the message for the user to be sent (system status heuristic)
				setTimeout(() => {
					setShowToast(false);
					navigate("/login");
				}, 2000);
			} else {
				setError(res.data.message || "Registration failed.");
				setLoading(false);
			}
		} catch (err) {
			// specific error message, so user isnt kept guessing (links nicely to the heuristics)
			if (err.response?.data?.message) {
				setError(err.response.data.message);
			} else if (err.response?.status === 400) {
				setError("Username already exists. Please choose a different one.");
			} else {
				setError("Something went wrong. Please try again later.");
			}
			setLoading(false);
		}
	};

	return (
			<Container className="mt-5">
				<Row className="justify-content-center">
					<Col xs={12} sm={10} md={8} lg={6}>
						<h2 className="mb-4 text-center">
							Create Account{" "}
							<OverlayTrigger
								placement="right"
								overlay={<Tooltip>Fill out all fields to create your account.</Tooltip>}
							>
								{/* Tooltip provides help to the user (help heuristic) */}
								<span
									className="text-info"
									style={{ cursor: "pointer" }}
									tabIndex="0"
									role="button"
									aria-label="Registration help tooltip"
								>
									?
								</span>
							</OverlayTrigger>
						</h2>

						{/* Success toast shows confirmation of registration (feedback heuristic) */}
						<Toast
							show={showToast}
							onClose={() => setShowToast(false)}
							delay={2000}
							autohide
							bg="success" // i chose to keep the message with a forest green like backdrop with white writing
							// this links well with wcag guidelines
							style={{ position: "fixed", top: 20, right: 20, zIndex: 1055 }}
							className="mb-3"
						>
							<Toast.Body className="text-white">{toastMsg}</Toast.Body>
						</Toast>

						{/* Show spinner if loading (feedback heuristic) */}
						{loading ? (
							<div className="text-center my-4">
								<Spinner animation="border" />
							</div>
						) : (
							<form onSubmit={handleSubmit}>
								{/* Error message shown to user (user feedback heuristic) */}
								{error && <div className="alert alert-danger">{error}</div>}

								{/* The following areas are where the user has to input the relevant fields */}
								<Form.Group className="mb-3">
									<Form.Label>Full Name</Form.Label>
									<Form.Control
										type="text"
										name="name"
										placeholder="First and Last Name"
										value={form.name}
										onChange={handleChange}
										required
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
										required
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
										required
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
										required
									/>
								</Form.Group>

								<Form.Group className="mb-4">
									<Form.Label>Preferred Unit</Form.Label>
									<Form.Select
										name="unitPreference"
										value={form.unitPreference}
										onChange={handleChange}
										required
									>
										<option value="km">Kilometers</option>
										<option value="miles">Miles</option>
									</Form.Select>
								</Form.Group>

								<Button type="submit" className="btn btn-primary w-100">
									Create Account
								</Button>

								{/* Button to go back to login page 
								 (it has a colour scheme that links with wcag and a clear icon for heuristic consideration) */}
								<div className="text-center mt-3">
									<Button
										variant="outline-dark"
										onClick={() => navigate("/login")}
										className="d-flex align-items-center justify-content-center gap-2"
										aria-label="Back to Login"
									>
										<BsArrowLeft /> Back to Login
									</Button>
								</div>
							</form>
						)}
					</Col>
				</Row>
			</Container>
		);
	}

	export default Register;
