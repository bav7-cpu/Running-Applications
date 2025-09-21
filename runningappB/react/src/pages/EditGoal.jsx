import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";

// Form to edit an existing goal
function EditGoal() {
	const { goalId } = useParams();
	const navigate = useNavigate();

	const [form, setForm] = useState({
		goalName: "",
		goalDistance: "",
		goalFrequency: "",
		targetDate: "",
		unit: "km",
	});
	const [error, setError] = useState("");

	// Load goal data on mount
	useEffect(() => {
		axios.get(`/api/goals/${goalId}`)
			.then((res) => {
				const goal = res.data?.data;
				if (goal) {
					setForm({
						goalName: goal.goalName || "",
						goalDistance: goal.goalDistance || "",
						goalFrequency: goal.goalFrequency || "",
						targetDate: goal.targetDate || "",
						unit: goal.unit || "km",
					});
				}
			})
			.catch(() => setError("Unable to load goal."));
	}, [goalId]);

	// Handle input changes
	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	// Submit form
	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!form.goalName || !form.targetDate || (!form.goalDistance && !form.goalFrequency)) {
			setError("Unable to progress");
			return;
		}

		try {
			await axios.put(`/api/goals/${goalId}`, form);
			navigate("/goals");
		} catch {
			setError("Unable to progress");
		}
	};

	return (
		<Container className="mt-4">
			<Row className="justify-content-center">
				<Col xs={12} md={8} lg={8}>
					<h2 className="text-center mb-4">Edit Goal</h2>
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
									<Form.Select
										name="unit"
										value={form.unit}
										onChange={handleChange}
									>
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

						<Button type="submit" className="btn btn-primary w-100">
							Save Changes
						</Button>
					</Form>
				</Col>
			</Row>
		</Container>
	);
}

export default EditGoal;