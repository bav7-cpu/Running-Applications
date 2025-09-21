import React, { useEffect, useState } from "react";
import { Form, Button, Container, Spinner, Toast, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ConfirmModal from "../components/ConfirmModal";
import HelpTooltip from "../components/HelpTooltip";
import BackButton from "../components/BackButton";

/**
 * this class allows the user to edit their profile information
 */

function EditProfile() {
	const [form, setForm] = useState({
		name: "",
		username: "",
		unitPreference: "km",
		currentPassword: "",
		newPassword: "",
		confirmNewPassword: "",
	});

	const [loading, setLoading] = useState(true); // data is loading
	const [submitting, setSubmitting] = useState(false); // shows while submitting
	const [toastMsg, setToastMsg] = useState(""); // messages shown to the user
	const [showConfirm, setShowConfirm] = useState(false); // confirm modal visibility

	const navigate = useNavigate();
	const storedUser = JSON.parse(localStorage.getItem("user"));

	// gets the user’s current profile info when the page loads
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
			.catch(() => setToastMsg("Failed to load user info."))
			.finally(() => setLoading(false));
	}, [storedUser?.userID]);

	// updates the form whenever user types
	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	// handles form submission and sends update to backend
	const handleSubmit = async () => {
		setShowConfirm(false);
		setSubmitting(true);
		setToastMsg("Saving changes...");

		if (!form.currentPassword) {
			setToastMsg("Current password is required.");
			setSubmitting(false);
			return;
		}

		if (form.newPassword && form.newPassword !== form.confirmNewPassword) {
			setToastMsg("New passwords do not match.");
			setSubmitting(false);
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
			setToastMsg("Profile updated.");
			setTimeout(() => navigate("/profile"), 1500);
		} catch {
			setToastMsg("Failed to update profile.");
			setSubmitting(false);
		}
	};

	return (
		<Container className="mt-4">
			<h2 className="mb-3">
				Edit Profile{" "}
				<HelpTooltip message="Update your name, username, and unit preference. Your current password is required. You may set a new password too." />
			</h2>

			{/* toast for feedback messages */}
			<Toast
				show={!!toastMsg}
				onClose={() => setToastMsg("")}
				delay={submitting ? null : 3000}
				autohide={!submitting}
				bg="success"
				style={{ position: "fixed", top: 20, right: 20, zIndex: 1055 }}
			>
				<Toast.Body className="text-white">{toastMsg}</Toast.Body>
			</Toast>

			{/* show spinner while loading or submitting */}
			{(loading || submitting) ? (
				<div className="text-center my-4">
					<Spinner animation="border" />
				</div>
			) : (
				<Form>
					<Row>
						<Col xs={12} md={6}>
							<Form.Group className="mb-3">
								<Form.Label>Username</Form.Label>
								<Form.Control
									type="text"
									name="username"
									value={form.username}
									onChange={handleChange}
									placeholder="Enter your username"
									required
								/>
							</Form.Group>
						</Col>

						<Col xs={12} md={6}>
							<Form.Group className="mb-3">
								<Form.Label>Name</Form.Label>
								<Form.Control
									type="text"
									name="name"
									value={form.name}
									onChange={handleChange}
									placeholder="Enter your name"
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
						<Form.Label>
							Current Password <span className="text-danger">*</span>
						</Form.Label>
						<Form.Control
							type="password"
							name="currentPassword"
							value={form.currentPassword}
							onChange={handleChange}
							placeholder="Enter your current password to confirm changes"
							required
						/>
					</Form.Group>

					<Row>
						<Col xs={12} md={6}>
							<Form.Group className="mb-3">
								<Form.Label>New Password (optional)</Form.Label>
								<Form.Control
									type="password"
									name="newPassword"
									value={form.newPassword}
									onChange={handleChange}
									placeholder="Only needed if changing password"
								/>
							</Form.Group>
						</Col>

						<Col xs={12} md={6}>
							<Form.Group className="mb-4">
								<Form.Label>Confirm New Password</Form.Label>
								<Form.Control
									type="password"
									name="confirmNewPassword"
									value={form.confirmNewPassword}
									onChange={handleChange}
									placeholder="Confirm new password"
								/>
							</Form.Group>
						</Col>
					</Row>

					{/* update and back buttons */}
					<div className="d-flex flex-column flex-md-row gap-3">
						<Button variant="primary" type="button" onClick={() => setShowConfirm(true)}>
							Edit Profile
						</Button>
						<BackButton to="/profile" label="Back to Profile" />
					</div>
				</Form>
			)}

			{/* confirmation modal before submitting */}
			<ConfirmModal
				show={showConfirm}
				onHide={() => setShowConfirm(false)}
				onConfirm={handleSubmit}
				message="Are you sure you want to update your profile?"
			/>
		</Container>
	);
}

export default EditProfile;
