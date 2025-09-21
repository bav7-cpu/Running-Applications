import React, { useEffect, useState } from "react";
import { Container, Button, Spinner, Alert, Toast, Row, Col, } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import HelpTooltip from "../components/HelpTooltip";
import ConfirmModal from "../components/ConfirmModal";



function Profile({ onLogout }) {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
	const [toastMsg, setToastMsg] = useState("");
	const [toastVisible, setToastVisible] = useState(false);
	const navigate = useNavigate();
	const storedUser = JSON.parse(localStorage.getItem("user"));

	// unit values to easily readable labels, so no possibility of complications for the user
	const unitMap = {
		km: "Kilometers",
		miles: "Miles",
	};

	useEffect(() => {
		// fetches the logged-in user's profile info from the backend
		axios
			.get(`/api/users/${storedUser?.userID}`)
			.then((res) => {
				const data = res.data?.data;
				setUser(data);
			})
			.catch(() => setError("Unable to load profile."))
			.finally(() => setLoading(false));
	}, [storedUser?.userID]);

	//  shows the confirmation modal before logging out
	const handleLogoutConfirm = () => {
		setShowLogoutConfirm(true);
	};

	// logs the user out, shows toast, and redirects to login
	const handleLogout = () => {
		setShowLogoutConfirm(false);
		onLogout();
		setToastMsg("Logged out successfully");
		setToastVisible(true);
		setTimeout(() => {
			setToastVisible(false);
			navigate("/login");
		}, 2000);
	};

	// loading spinner is shown whilst the data is being fetched (system status heuristic)
	if (loading) return <Spinner animation="border" className="mt-4" />;

	  return (
	    <Container className="mt-4">
	      <h2 className="mb-3">
	        Profile{" "}
	        <HelpTooltip message="View your username, name, and preferred unit. Click logout to exit your account." />
	      </h2>

		  {/* Displays error if profile fails to load */}
	      {error && <Alert variant="danger">{error}</Alert>}

		  {/* Displays error if profile fails to load */}
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
	              <strong>Preferred Unit:</strong>{" "}
	              {unitMap[user.unitPreference] || "-"}
	            </Col>
	          </Row>
			  
			  {/*  buttons to edit profile or logout */}
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
	                onClick={handleLogoutConfirm}
	                className="w-100 w-md-auto"
	              >
	                Logout
	              </Button>
	            </Col>
	          </Row>
	        </div>
	      )}

	      <ConfirmModal
	        show={showLogoutConfirm}
	        onHide={() => setShowLogoutConfirm(false)}
	        onConfirm={handleLogout}
	        message="Are you sure you want to logout?"
	      />

		  {/* Toast message shown after successful logout */}
	      <Toast
	        show={toastVisible}
	        onClose={() => setToastVisible(false)}
	        delay={3000}
	        autohide
	        bg="success"
	        style={{ position: "fixed", top: 20, right: 20, zIndex: 1055 }}
	      >
	        <Toast.Body className="text-white">{toastMsg}</Toast.Body>
	      </Toast>
	    </Container>
	  );
	}

	export default Profile;
