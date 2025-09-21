import React, { useEffect, useState } from "react";
import { Container, Button, Alert, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Basic profile display with logout
function Profile({ onLogout }) {
	const [user, setUser] = useState(null);
	const [error, setError] = useState("");
	const navigate = useNavigate();
	const storedUser = JSON.parse(localStorage.getItem("user"));

	const unitMap = {
		km: "Kilometers",
		miles: "Miles",
	};

	// Fetches user profile
	useEffect(() => {
		axios
			.get(`/api/users/${storedUser?.userID}`)
			.then((res) => {
				const data = res.data?.data;
				setUser(data);
			})
			.catch(() => setError("Unable to load profile."));
	}, [storedUser?.userID]);

	// Logs out and redirects
	const handleLogout = () => {
		onLogout();
		navigate("/login");
	};

	return (
		<Container className="mt-4">
			<h2 className="mb-3">Profile</h2>

			{error && <Alert variant="danger">{error}</Alert>}

			{user && (
				<div className="mt-3">
					<Row className="mb-2">
						<Col xs={12} md={6}>
							<strong>Username:</strong> {user.username}
						</Col>
						<Col xs={12} md={6}>
							<strong>Name:</strong> {user.name}
						</Col>
					</Row>

					<Row>
						<Col xs={12} md={6}>
							<strong>Preferred Unit:</strong> {unitMap[user.unitPreference] || "-"}
						</Col>
					</Row>

					<Row className="mt-3">
						<Col xs={12} md="auto" className="mb-2 mb-md-0">
							<Button
								variant="primary"
								onClick={() => navigate("/profile/edit")}
								className="w-100 w-md-auto"
							>
								Edit Profile
							</Button>
						</Col>
						<Col xs={12} md="auto">
							<Button
								variant="outline-danger"
								onClick={handleLogout}
								className="w-100 w-md-auto"
							>
								Logout
							</Button>
						</Col>
					</Row>
				</div>
			)}
		</Container>
	);
}

export default Profile;