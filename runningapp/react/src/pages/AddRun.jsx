import React, { useState, useEffect } from "react";
import axios from "axios";
import {Form,Button,Container,Row,Col,Spinner,Toast,OverlayTrigger,Tooltip,} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal";
/**
 * this class lets users add a new run
 *
 * 
 */

function AddRun() {
	const [form, setForm] = useState({
		date: "",
		distance: "",
		unit: "km",
		duration: "",
		notes: "",
	});

	const [errors, setErrors] = useState({});
	const [speed, setSpeed] = useState(null);
	const [loading, setLoading] = useState(false); // spinner is shown when waiting
	const [toastMsg, setToastMsg] = useState(""); // toast messages are shown
	const [showConfirm, setShowConfirm] = useState(false); // confirm modal is shown
	const navigate = useNavigate();

	// this useEffect calculates the speed automatically when distance or duration changes
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

	/**
	 * this method updates the form as the user types
	 */
	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	// this checks if the time format is correct (HH:MM:SS)
	const isValidDurationFormat = (value) => {
		const parts = value.split(":");
		return parts.length === 3 && parts.every(p => /^\d+$/.test(p));
	};

	// this method checks for validation errors
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

	/**
	 * this method runs when the user confirms saving the run
	 * it validates the input and sends the data to the backend
	 */
	const handleSubmit = async () => {
		setShowConfirm(false);
		setErrors({});
		const validationErrors = validateFields();
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			setToastMsg("Please fix the errors in the form.");
			return;
		}

		setLoading(true);
		setToastMsg("Saving run...");

		const user = JSON.parse(localStorage.getItem("user"));
		if (!user?.userID) {
			setToastMsg("User not found.");
			setLoading(false);
			return;
		}

		// data is prepared before being sent to backend
		const payload = {
			runDate: form.date,
			runDistance: parseFloat(form.distance),
			runDuration: form.duration,
			unit: form.unit,
			notes: form.notes,
			speed: speed,
			userID: user.userID,
		};

		try {
			await axios.post("/api/runs", payload);
			setToastMsg("Run saved successfully!");
			setTimeout(() => navigate("/calendar"), 1500);
		} catch (err) {
			console.error("Error saving run:", err);
			setToastMsg("Error saving run.");
			setLoading(false);
		}
	};

	return (
			<Container className="mt-4">
				<h2 className="mb-3">
					Add a Run{" "}
					<OverlayTrigger
						overlay={<Tooltip>Fill in date, distance, and time. Ensure time is in HH:MM:SS format.</Tooltip>}
					>
						<span
							className="text-info"
							style={{ cursor: "pointer" }}
							role="button"
							tabIndex="0"
						>
							?
						</span>
					</OverlayTrigger>
				</h2>

				{/* toast messages shown to user */}
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

				{/* show spinner if loading */}
				{loading ? (
					<div className="text-center my-4">
						<Spinner animation="border" />
					</div>
				) : (
					<Form>
						<Row>
							<Col xs={12} md={4}>
								<Form.Group className="mb-3">
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

							<Col xs={12} md={4}>
								<Form.Group className="mb-3">
									<Form.Label>Distance</Form.Label>
									<Form.Control
										type="number"
										name="distance"
										value={form.distance}
										onChange={handleChange}
										placeholder="e.g. 5.0"
										isInvalid={!!errors.distance}
									/>
									<Form.Control.Feedback type="invalid">
										{errors.distance}
									</Form.Control.Feedback>
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
						</Row>

						<Row>
							<Col xs={12} md={6}>
								<Form.Group className="mb-3">
									<Form.Label>Duration (HH:MM:SS)</Form.Label>
									<Form.Control
										type="text"
										name="duration"
										value={form.duration}
										onChange={handleChange}
										placeholder="e.g. 00:30:00"
										isInvalid={!!errors.duration}
									/>
									<Form.Control.Feedback type="invalid">
										{errors.duration}
									</Form.Control.Feedback>
								</Form.Group>
							</Col>

							<Col xs={12} md={6}>
								<Form.Group className="mb-3">
									<Form.Label>Calculated Speed ({form.unit}/hour)</Form.Label>
									<Form.Control
										value={speed ? `${speed} ${form.unit}/hour` : "N/A"}
										readOnly
									/>
								</Form.Group>
							</Col>
						</Row>

						<Form.Group className="mb-4">
							<Form.Label>Additional Notes (Optional)</Form.Label>
							<Form.Control
								as="textarea"
								name="notes"
								rows={3}
								value={form.notes}
								onChange={handleChange}
								placeholder="Any extra details you want to add..."
							/>
						</Form.Group>

						{/* button that triggers confirm modal */}
						<div className="d-flex justify-content-center">
							<Button
								variant="primary"
								type="button"
								onClick={() => setShowConfirm(true)}
								className="w-100 w-md-auto"
							>
								Add Run
							</Button>
						</div>
					</Form>
				)}

				{/* confirm modal appears before saving */}
				<ConfirmModal
					show={showConfirm}
					onHide={() => setShowConfirm(false)}
					onConfirm={handleSubmit}
					message="Are you sure you want to save this run?"
				/>
			</Container>
		);
	}

export default AddRun;