import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Container, Row, Col, Spinner, Toast, } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { BsBullseye } from "react-icons/bs";
import HelpTooltip from "../components/HelpTooltip";
import ConfirmModal from "../components/ConfirmModal";

/**
 *this class lets users create a new goal
 *
 *  
 */

function AddGoal() {
	const [form, setForm] = useState({
		goalName: "",
		goalDistance: "",
		goalFrequency: "",
		targetDate: "",
		unit: "km",
	});

	const [loading, setLoading] = useState(false); // spinner is shown when waiting
	const [toastMsg, setToastMsg] = useState(""); // toast messages are shown
	const [showConfirm, setShowConfirm] = useState(false); // 

	const navigate = useNavigate();

	/**
	 * this method is where the form is updated 
	 */
	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	/**
	 * method validates input fields and runs when user confirms the creation of the goal 
	 */
	const handleSubmit = async () => {
		setShowConfirm(false);
		setLoading(true);
		setToastMsg("Creating goal...");

		const user = JSON.parse(localStorage.getItem("user"));
		if (!user || !user.userID) {
			setToastMsg("User not found.");
			setLoading(false);
			return;
		}

		if (!form.goalName) {
			setToastMsg("Goal name is required.");
			setLoading(false);
			return;
		}

		if (!form.goalDistance && !form.goalFrequency) {
			setToastMsg("At least one of distance or frequency must be provided.");
			setLoading(false);
			return;
		}

		// data is prepared before being sent to backend
		const payload = {
			goalName: form.goalName, 
			// if the distance field is left blank then a null is sent through
			goalDistance: form.goalDistance ? parseFloat(form.goalDistance) : null, 
			goalFrequency: form.goalFrequency || null,
			targetDate: form.targetDate || null,
			unit: form.unit,
			userID: user.userID,
		};

		try {
			await axios.post("/api/goals", payload);
			setToastMsg("Goal created successfully!");
			setTimeout(() => navigate("/goals"), 1500);
		} catch (err) {
			const message = err.response?.data?.message || "Error saving goal.";
			setToastMsg(message);
			setLoading(false);
		}
	};

	return (
			<Container className="mt-4">
				<h2 className="mb-3">
					Add a Goal
					<HelpTooltip message="Enter your goal details and click Add Goal to save it." />
				</h2>

				{/* Toast to show messages (feedback heuristic) */}
				<Toast
					show={!!toastMsg}
					onClose={() => setToastMsg("")}
					delay={loading ? null : 3000}
					autohide={!loading}
					bg="success"
					className="mb-3"
				>
					<Toast.Body className="text-white">{toastMsg}</Toast.Body>
				</Toast>

				{loading ? (
					<div className="text-center my-4">
						<Spinner animation="border" />
					</div>
				) : (
					<Form>
						<Form.Group className="mb-3">
							<Form.Label>Goal Name</Form.Label>
							<Form.Control
								type="text"
								name="goalName"
								value={form.goalName}
								onChange={handleChange}
								placeholder="e.g. Run 100km in a month"
							/>
						</Form.Group>

						<Row>
							<Col xs={12} md={4}>
								<Form.Group className="mb-3">
									<Form.Label>Distance</Form.Label>
									<Form.Control
										type="number"
										name="goalDistance"
										value={form.goalDistance}
										onChange={handleChange}
										placeholder="e.g. 100"
									/>
								</Form.Group>
							</Col>

							<Col xs={12} md={4}>
								<Form.Group className="mb-3">
									<Form.Label>Unit</Form.Label>
									<Form.Select name="unit" value={form.unit} onChange={handleChange}>
										<option value="km">Kilometers</option>
										<option value="miles">Miles</option>
									</Form.Select>
								</Form.Group>
							</Col>

							<Col xs={12} md={4}>
								<Form.Group className="mb-3">
									<Form.Label>Frequency</Form.Label>
									<Form.Control
										type="text"
										name="goalFrequency"
										value={form.goalFrequency}
										onChange={handleChange}
										placeholder="e.g. 3 times/week"
									/>
								</Form.Group>
							</Col>
						</Row>

						<Form.Group className="mb-4">
							<Form.Label>Target Date (Optional)</Form.Label>
							<Form.Control
								type="date"
								name="targetDate"
								value={form.targetDate}
								onChange={handleChange}
							/>
						</Form.Group>

						<Button variant="primary" type="button" onClick={() => setShowConfirm(true)} className="w-100 w-md-auto">
							Add Goal
						</Button>
					</Form>
				)}

				{/* Moved to bottom and centered */}
				<div className="d-flex justify-content-center mt-4">
					<Button
						variant="primary"
						style={{ backgroundColor: "navy", borderColor: "navy" }}
						onClick={() => navigate("/goals")}
						className="d-flex justify-content-center align-items-center gap-2 w-100 w-md-auto"
					>
						<BsBullseye />
						View Existing Goals
					</Button>
				</div>


				<ConfirmModal
					show={showConfirm}
					onHide={() => setShowConfirm(false)}
					onConfirm={handleSubmit}
					message="Are you sure you want to create this goal?"
				/>
			</Container>
		);
	}


export default AddGoal;
