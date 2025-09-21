import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Form, Button, Spinner, Toast, Row, Col } from "react-bootstrap";
import HelpTooltip from "../components/HelpTooltip";
import ConfirmModal from "../components/ConfirmModal";
import { BsArrowLeft } from "react-icons/bs";

/**
 * this class lets the user edit an existing goal
 * it fetches data, displays it and allows the user to update it
 */

export default function EditGoal() {
	const { goalId } = useParams();
	const navigate = useNavigate();

	const [form, setForm] = useState({
		goalName: "",
		goalDistance: "",
		goalFrequency: "",
		targetDate: "",
		unit: "km",
	});

	const [loading, setLoading] = useState(false); // loading spinner
	const [toastMsg, setToastMsg] = useState(""); // shows feedback messages
	const [showConfirm, setShowConfirm] = useState(false); // confirmation popup
	const [submitting, setSubmitting] = useState(false); // disables form while submitting

	const user = JSON.parse(localStorage.getItem("user"));

	// gets goal details when component loads
	useEffect(() => {
		setLoading(true);
		axios
			.get(`/api/goals/${goalId}`)
			.then((res) => {
				const goal = res.data?.data;
				if (goal) {
					setForm({
						goalName: goal.goalName,
						goalDistance: goal.goalDistance ?? "",
						goalFrequency: goal.goalFrequency ?? "",
						targetDate: goal.targetDate ?? "",
						unit: goal.unit || "km",
					});
				} else {
					setToastMsg("Goal not found.");
				}
			})
			.catch(() => setToastMsg("Failed to load goal details."))
			.finally(() => setLoading(false));
	}, [goalId]);

	// updates form when user types
	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	// validates and submits updated data
	const handleSubmit = async () => {
		setShowConfirm(false);
		setSubmitting(true);
		setToastMsg("Updating goal...");

		if (!form.goalName) {
			setToastMsg("Goal name is required.");
			setSubmitting(false);
			return;
		}

		if (!form.goalDistance && !form.goalFrequency) {
			setToastMsg("At least one of distance or frequency is required.");
			setSubmitting(false);
			return;
		}

		const payload = {
			goalID: parseInt(goalId),
			userID: user?.userID,
			goalName: form.goalName,
			goalDistance: form.goalDistance ? parseFloat(form.goalDistance) : null,
			goalFrequency: form.goalFrequency || null,
			targetDate: form.targetDate || null,
			unit: form.unit,
		};

		try {
			await axios.put(`/api/goals/${goalId}`, payload);
			setToastMsg("Goal updated successfully!");
			setTimeout(() => {
				navigate("/goals");
			}, 3000);
		} catch (err) {
			console.error("Update failed:", err);
			setToastMsg("Failed to update goal.");
			setSubmitting(false);
		}
	};

	return (
		<Container className="mt-4">
			<h2 className="mb-3">
				Edit Goal
				<HelpTooltip message="Update your goal details and click Edit Goal." />
			</h2>

			{/* feedback toast message */}
			<Toast
				show={!!toastMsg}
				onClose={() => setToastMsg("")}
				delay={submitting ? null : 3000}
				autohide={!submitting}
				bg="success"
				className="mb-3"
			>
				<Toast.Body className="text-white">{toastMsg}</Toast.Body>
			</Toast>

			{/* loading or submitting spinner */}
			{(loading || submitting) ? (
				<div className="text-center my-4">
					<Spinner animation="border" />
				</div>
			) : (
				<Form>
					<Row>
						<Col xs={12} md={6}>
							<Form.Group className="mb-3">
								<Form.Label>Goal Name</Form.Label>
								<Form.Control
									type="text"
									name="goalName"
									value={form.goalName}
									onChange={handleChange}
								/>
							</Form.Group>
						</Col>

						<Col xs={12} md={6}>
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
					</Row>

					<Row>
						<Col xs={12} md={6}>
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

						<Col xs={12} md={6}>
							<Form.Group className="mb-3">
								<Form.Label>Target Date</Form.Label>
								<Form.Control
									type="date"
									name="targetDate"
									value={form.targetDate}
									onChange={handleChange}
								/>
							</Form.Group>
						</Col>
					</Row>

					<Form.Group className="mb-4">
						<Form.Label>Unit</Form.Label>
						<Form.Select name="unit" value={form.unit} onChange={handleChange}>
							<option value="km">Kilometers</option>
							<option value="miles">Miles</option>
						</Form.Select>
					</Form.Group>

					{/* update and back buttons */}
					<div className="d-flex flex-column flex-md-row gap-3">
						<Button type="button" variant="primary" onClick={() => setShowConfirm(true)}>
							Edit Goal
						</Button>

						<Button
							variant="outline-dark"
							onClick={() => navigate("/goals")}
							className="d-flex align-items-center gap-2"
							aria-label="Back to Goals"
						>
							<BsArrowLeft /> Back to Goals
						</Button>
					</div>
				</Form>
			)}

			{/* confirm before submitting */}
			<ConfirmModal
				show={showConfirm}
				onHide={() => setShowConfirm(false)}
				onConfirm={handleSubmit}
				message="Are you sure you want to update this goal?"
			/>
		</Container>
	);
}
