import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";

// Allows users to update their profile information
function EditProfile() {
	const navigate = useNavigate();
	const storedUser = JSON.parse(localStorage.getItem("user"));

	const [form, setForm] = useState({
		name: "",
		username: "",
		unitPreference: "km",
		currentPassword: "",
		newPassword: "",
		confirmNewPassword: ""
	});

	const [error, setError] = useState("");

	// Load current user data
	useEffect(() => {
		axios
			.get(`/api/users/${storedUser?.userID}`)
			.then((res) => {
				const data = res.data?.data;
				setForm((prev) => ({
					...prev,
					name: data.name || "",
					username: data.username || "",
					unitPreference: data.unitPreference || "km"
				}));
			})
			.catch(() => setError("Failed to load user info."));
	}, [storedUser?.userID]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		if (!form.currentPassword) {
			setError("Current password is required.");
			return;
		}

		if (form.newPassword && form.newPassword !== form.confirmNewPassword) {
			setError("New passwords do not match.");
			return;
		}

		const payload = {
			name: form.name,
			username: form.username,
			unitPreference: form.unitPreference,
			password: form.newPassword || form.currentPassword
		};

		try {
			await axios.put(`/api/users/${storedUser.userID}`, payload);
			navigate("/profile");
		} catch {
			setError("Failed to update profile.");
		}
	};

	return (
		<Container className="mt-4">
			<h2 className="mb-3 text-center">Edit Profile</h2>

			<Form onSubmit={handleSubmit}>
				{error && <Alert variant="danger">{error}</Alert>}

				<Row>
					<Col md={6}>
						<Form.Group className="mb-3">
							<Form.Label>Username</Form.Label>
							<Form.Control
								type="text"
								name="username"
								value={form.username}
								onChange={handleChange}
								required
							/>
						</Form.Group>
					</Col>

					<Col md={6}>
						<Form.Group className="mb-3">
							<Form.Label>Full Name</Form.Label>
							<Form.Control
								type="text"
								name="name"
								value={form.name}
								onChange={handleChange}
								required
							/>
						</Form.Group>
					</Col>
				</Row>

				<Form.Group className="mb-3">
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

				<Form.Group className="mb-3">
					<Form.Label>Current Password <span className="text-danger">*</span></Form.Label>
					<Form.Control
						type="password"
						name="currentPassword"
						value={form.currentPassword}
						onChange={handleChange}
						required
					/>
				</Form.Group>

				<Row>
					<Col md={6}>
						<Form.Group className="mb-3">
							<Form.Label>New Password (optional)</Form.Label>
							<Form.Control
								type="password"
								name="newPassword"
								value={form.newPassword}
								onChange={handleChange}
							/>
						</Form.Group>
					</Col>

					<Col md={6}>
						<Form.Group className="mb-3">
							<Form.Label>Confirm New Password</Form.Label>
							<Form.Control
								type="password"
								name="confirmNewPassword"
								value={form.confirmNewPassword}
								onChange={handleChange}
							/>
						</Form.Group>
					</Col>
				</Row>

				<Button type="submit" className="btn btn-primary w-100">
					Save Changes
				</Button>
			</Form>
		</Container>
	);
}

export default EditProfile;