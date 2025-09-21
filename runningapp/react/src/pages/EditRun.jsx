import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {Container,Form, Button, Spinner, Toast, Row, Col, OverlayTrigger,Tooltip,} from "react-bootstrap";
import ConfirmModal from "../components/ConfirmModal";
import BackButton from "../components/BackButton";

/**
 * this class allows the user to edit an existing run entry
 */

export default function EditRun() {
	const { runId } = useParams();
	const navigate = useNavigate();

	const [form, setForm] = useState({
		date: "",
		distance: "",
		unit: "km",
		duration: "",
		notes: "",
	});

	const [speed, setSpeed] = useState(null); // calculated speed based on duration and distance
	const [loading, setLoading] = useState(false); // loading spinner
	const [submitting, setSubmitting] = useState(false); // submitting state
	const [toastMsg, setToastMsg] = useState(""); // toast messages
	const [showConfirm, setShowConfirm] = useState(false); // confirm modal toggle
	const [errors, setErrors] = useState({}); // validation errors
	const user = JSON.parse(localStorage.getItem("user"));

	// loads the selected run's data
	useEffect(() => {
		setLoading(true);
		axios
			.get(`/api/runs/${runId}`)
			.then((res) => {
				const run = res.data?.data || res.data;
				if (run) {
					setForm({
						date: run.runDate.split("T")[0],
						distance: run.runDistance,
						unit: run.unit || "km",
						duration: run.runDuration,
						notes: run.additionalDetails || "",
					});
				} else {
					setToastMsg("Run not found.");
				}
			})
			.catch(() => setToastMsg("Failed to load run details."))
			.finally(() => setLoading(false));
	}, [runId]);

	// calculates the speed based on distance and duration
	useEffect(() => {
		const parts = form.duration.split(":").map(Number);
		if (parts.length === 3) {
			const [h, m, s] = parts;
			const timeInHours = h + m / 60 + s / 3600;
			const dist = parseFloat(form.distance);
			if (timeInHours > 0 && dist > 0) {
				setSpeed((dist / timeInHours).toFixed(2));
				return;
			}
		}
		setSpeed(null);
	}, [form.distance, form.duration]);

	// updates form values on input change
	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	// checks if duration is in correct format
	const isValidDurationFormat = (value) => {
		const parts = value.split(":");
		return parts.length === 3 && parts.every((p) => /^\d+$/.test(p));
	};

	// validates required fields
	const validateFields = () => {
		const newErrors = {};
		if (!form.date) newErrors.date = "Date is required.";
		if (!form.distance) newErrors.distance = "No distance given.";
		if (!form.duration) {
			newErrors.duration = "Duration is required.";
		} else if (!isValidDurationFormat(form.duration)) {
			newErrors.duration = "Duration must be in HH:MM:SS format.";
		}
		return newErrors;
	};

	// submits updated run data to backend
	const handleSubmit = async () => {
		setShowConfirm(false);
		setSubmitting(true);
		setErrors({});
		const validationErrors = validateFields();
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			setToastMsg("Please fix the errors in the form.");
			setSubmitting(false);
			return;
		}

		const payload = {
			userID: user?.userID,
			runDate: form.date,
			runDistance: parseFloat(form.distance),
			runDuration: form.duration,
			runSpeed: parseFloat(speed),
			unit: form.unit,
			additionalDetails: form.notes,
		};

		try {
			await axios.put(`/api/runs/${runId}`, payload);
			setToastMsg("Run updated successfully!");
			setTimeout(() => navigate("/calendar"), 1500);
		} catch {
			setToastMsg("Failed to update run.");
			setSubmitting(false);
		}
	};

	return (
			<Container className="mt-4">
				<h2 className="mb-3">
					Edit Run{" "}
					<OverlayTrigger overlay={<Tooltip>Edit the run selected.</Tooltip>}>
						<span className="text-info" style={{ cursor: "pointer" }}>?</span>
					</OverlayTrigger>
				</h2>

				{/* toast to show messages */}
				<Toast
					show={!!toastMsg}
					onClose={() => setToastMsg("")}
					delay={submitting ? null : 2000}
					autohide={!submitting}
					bg="success"
					className="mb-2"
				>
					<Toast.Body className="text-white">{toastMsg}</Toast.Body>
				</Toast>

				{/* show spinner if loading or submitting */}
				{(loading || submitting) ? (
					<div className="text-center my-4">
						<Spinner animation="border" />
					</div>
				) : (
					<Form>
						<Row>
							<Col md={4} className="mb-3">
								<Form.Group>
									<Form.Label>Date</Form.Label>
									<Form.Control
										type="date"
										name="date"
										value={form.date}
										onChange={handleChange}
										isInvalid={!!errors.date}
									/>
									<Form.Control.Feedback type="invalid">
										{errors.date}
									</Form.Control.Feedback>
								</Form.Group>
							</Col>

							<Col md={4} className="mb-3">
								<Form.Group>
									<Form.Label>Distance</Form.Label>
									<Form.Control
										type="number"
										name="distance"
										value={form.distance}
										onChange={handleChange}
										isInvalid={!!errors.distance}
									/>
									<Form.Control.Feedback type="invalid">
										{errors.distance}
									</Form.Control.Feedback>
								</Form.Group>
							</Col>

							<Col md={4} className="mb-3">
								<Form.Group>
									<Form.Label>Unit</Form.Label>
									<Form.Select name="unit" value={form.unit} onChange={handleChange}>
										<option value="km">Kilometers</option>
										<option value="miles">Miles</option>
									</Form.Select>
								</Form.Group>
							</Col>
						</Row>

						<Row>
							<Col md={6} className="mb-3">
								<Form.Group>
									<Form.Label>Duration (HH:MM:SS)</Form.Label>
									<Form.Control
										type="text"
										name="duration"
										value={form.duration}
										onChange={handleChange}
										isInvalid={!!errors.duration}
									/>
									<Form.Control.Feedback type="invalid">
										{errors.duration}
									</Form.Control.Feedback>
								</Form.Group>
							</Col>

							<Col md={6} className="mb-3">
								<Form.Group>
									<Form.Label>Speed ({form.unit}/h)</Form.Label>
									<Form.Control
										value={speed ? `${speed} ${form.unit}/h` : "N/A"}
										readOnly
									/>
								</Form.Group>
							</Col>
						</Row>

						<Form.Group className="mb-3">
							<Form.Label>Additional Notes (optional)</Form.Label>
							<Form.Control
								as="textarea"
								rows={2}
								name="notes"
								value={form.notes}
								onChange={handleChange}
							/>
						</Form.Group>

						<div className="d-flex flex-column flex-md-row justify-content-between gap-2">
							<Button type="button" variant="primary" onClick={() => setShowConfirm(true)}>
								Edit Run
							</Button>
							<BackButton to="/calendar" label="Back to Calendar" />
						</div>
					</Form>
				)}

				{/* confirm modal before submitting */}
				<ConfirmModal
					show={showConfirm}
					onHide={() => setShowConfirm(false)}
					onConfirm={handleSubmit}
					message="Are you sure you want to update this run?"
				/>
			</Container>
		);
	}