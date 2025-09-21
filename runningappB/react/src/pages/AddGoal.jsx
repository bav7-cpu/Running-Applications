import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createGoal } from "../api";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";

/**
 * this class lets users create a new goal
 */

function AddGoal() {
	const navigate = useNavigate();
	const [form, setForm] = useState({
		goalName: "",
		goalDistance: "",
		goalFrequency: "",
		targetDate: "",
		unit: "km",
	});

	const [error, setError] = useState("");

	// This method updates the form when any input changes
	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	// This method is triggered when the user submits the form
	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		const user = JSON.parse(localStorage.getItem("user"));
		if (!user || !user.userID) {
			setError("Unable to progress");
			return;
		}

		if (!form.goalName || !form.targetDate || (!form.goalDistance && !form.goalFrequency)) {
			setError("Unable to progress");
			return;
		}

		const payload = {
			goalName: form.goalName,
			goalDistance: form.goalDistance ? parseFloat(form.goalDistance) : null,
			goalFrequency: form.goalFrequency || null,
			targetDate: form.targetDate,
			unit: form.unit,
			userID: user.userID,
		};

		try {
			const res = await createGoal(payload);
			if (res.data.success) {
				navigate("/goals");
			} else {
				setError("Unable to progress");
			}
		} catch {
			setError("Unable to progress");
		}
	};

	return (
		<Container className="mt-4">
			<h2 className="mb-4 text-center">Add New Goal</h2>

			<Row className="justify-content-center">
				<Col xs={12} md={8} lg={8}>
					<Form onSubmit={handleSubmit}>
						{error && <Alert variant="danger">{error}</Alert>}

						<Form.Group className="mb-3">
							<Form.Label>Goal Name</Form.Label>
							<Form.Control
								type="text"
								name="goalName"
								value={form.goalName}
								onChange={handleChange}
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
									/>
								</Form.Group>
							</Col>
						</Row>

						<Form.Group className="mb-4">
							<Form.Label>Target Date</Form.Label>
							<Form.Control
								type="date"
								name="targetDate"
								value={form.targetDate}
								onChange={handleChange}
							/>
						</Form.Group>

						<Button type="submit" variant="primary" className="w-100">
							Add Goal
						</Button>
					</Form>

					<div className="d-flex justify-content-center mt-4">
						<button
							type="button"
							onClick={() => navigate("/goals")}
							style={{
								backgroundColor: "navy",
								color: "white",
								padding: "10px 20px",
								border: "none",
								borderRadius: "4px",
								cursor: "pointer",
							}}
						>
							View Existing Goals
						</button>
					</div>
				</Col>
			</Row>
		</Container>
	);
}

export default AddGoal;