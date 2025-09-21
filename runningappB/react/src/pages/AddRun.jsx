import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createRun } from "../api";
import { Container, Form, Button, Row, Col, Alert } from "react-bootstrap";

/**
 * Form for adding a new run. Takes date, distance, duration and unit as input.
 */
function AddRun() {
	const [runDate, setRunDate] = useState("");
	const [runDistance, setRunDistance] = useState("");
	const [runDuration, setRunDuration] = useState(""); // format: HH:mm:ss
	const [unit, setUnit] = useState("km");
	const [additionalDetails, setAdditionalDetails] = useState("");
	const [speed, setSpeed] = useState(null);
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const user = JSON.parse(localStorage.getItem("user"));

	// Calculate speed from distance and HH:mm:ss duration
	useEffect(() => {
		const parts = runDuration.split(":").map(Number);
		if (parts.length === 3) {
			const [h, m, s] = parts;
			const timeInHours = h + m / 60 + s / 3600;
			const dist = parseFloat(runDistance);
			if (timeInHours > 0 && dist > 0) {
				setSpeed((dist / timeInHours).toFixed(2));
				return;
			}
		}
		setSpeed(null);
	}, [runDistance, runDuration]);

	// Handles the submission of the new run form
	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!runDate || !runDistance || !runDuration) {
			setError("Unable to progress.");
			return;
		}

		const durationParts = runDuration.split(":");
		if (durationParts.length !== 3 || durationParts.some((part) => isNaN(part))) {
			setError("Duration must be in HH:mm:ss format.");
			return;
		}

		try {
			const newRun = {
				runDate,
				runDistance: parseFloat(runDistance),
				runDuration, // store as HH:mm:ss string
				unit,
				speed: speed ? parseFloat(speed) : null,
				additionalDetails,
				userID: user.userID,
			};

			await createRun(newRun);
			navigate("/calendar");
		} catch (err) {
			console.error("Run creation error:", err);
			setError("Failed to add run. Please try again.");
		}
	};

	return (
		<Container className="mt-4">
			<h2 className="mb-4 text-center">Add New Run</h2>

			{error && <Alert variant="danger">{error}</Alert>}

			<Form onSubmit={handleSubmit}>
				<Row className="mb-3">
					<Col>
						<Form.Label>Date</Form.Label>
						<Form.Control
							type="date"
							value={runDate}
							onChange={(e) => setRunDate(e.target.value)}
						/>
					</Col>
				</Row>

				<Row className="mb-3">
					<Col>
						<Form.Label>Distance</Form.Label>
						<Form.Control
							type="number"
							value={runDistance}
							onChange={(e) => setRunDistance(e.target.value)}
							min="0"
							step="any"
						/>
					</Col>
					<Col>
						<Form.Label>Unit</Form.Label>
						<Form.Select value={unit} onChange={(e) => setUnit(e.target.value)}>
							<option value="km">Kilometers</option>
							<option value="miles">Miles</option>
						</Form.Select>
					</Col>
				</Row>

				<Row className="mb-3">
					<Col>
						<Form.Label>Duration (HH:mm:ss)</Form.Label>
						<Form.Control
							type="text"
							value={runDuration}
							onChange={(e) => setRunDuration(e.target.value)}
						/>
					</Col>
					<Col>
						<Form.Label>Speed ({unit}/h) (autocalculated)</Form.Label>
						<Form.Control
							type="text"
							value={speed || ""}
							disabled
						/>
					</Col>
				</Row>

				<Row className="mb-3">
					<Col>
						<Form.Label>Additional Details (optional)</Form.Label>
						<Form.Control
							as="textarea"
							rows={3}
							value={additionalDetails}
							onChange={(e) => setAdditionalDetails(e.target.value)}
						/>
					</Col>
				</Row>

				<Button type="submit" variant="primary" className="mt-3">
					Submit Run
				</Button>
			</Form>
		</Container>
	);
}

export default AddRun;
