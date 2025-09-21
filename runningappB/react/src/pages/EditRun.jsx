import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRunById, updateRun } from "../api";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";

/**
 * edit form for existing run
 * updates data for a selected run based on userID
 */

function EditRun() {
	const { runID } = useParams();
	const navigate = useNavigate();

	const [runData, setRunData] = useState({});
	const [form, setForm] = useState({
		runDistance: "",
		runDuration: "",
		runDate: "",
		unit: "km",
		additionalDetails: ""
	});
	const [error, setError] = useState("");

	// Fetch the existing run details
	useEffect(() => {
		getRunById(runID)
			.then((res) => {
				setRunData(res.data.data);
				setForm({
					runDistance: res.data.data.runDistance || "",
					runDuration: res.data.data.runDuration || "",
					runDate: res.data.data.runDate || "",
					unit: res.data.data.unit || "km",
					additionalDetails: res.data.data.additionalDetails || "",
				});
			})
			.catch((err) => {
				console.error("Run not found:", err);
				setError("Failed to load run data.");
			});
	}, [runID]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		const durationRegex = /^\d{2}:\d{2}:\d{2}$/;
		if (!durationRegex.test(form.runDuration)) {
			setError("Duration must be in HH:mm:ss format.");
			return;
		}

		if (!form.runDistance || !form.runDate || !form.runDuration) {
			setError("Please fill in all required fields: Distance, Duration, and Date.");
			return;
		}

		const updatedRun = {
			runID: parseInt(runID),
			userID: runData.userID,
			runDate: form.runDate,
			runDistance: parseFloat(form.runDistance),
			runDuration: form.runDuration,
			runSpeed: runData.runSpeed || 0, // Optional or server-calculated
			unit: form.unit || "km",
			additionalDetails: form.additionalDetails || "",
			isDeleted: false,
		};

		try {
			const res = await updateRun(runID, updatedRun);
			if (res.data.success) {
				navigate("/runs");
			} else {
				setError("Unable to update run.");
			}
		} catch (err) {
			console.error("Run update failed:", err);
			setError("Unable to update run.");
		}
	};

	return (
		<Container className="mt-4">
			<Row className="justify-content-center">
				<Col xs={12} md={8} lg={6}>
					<h2 className="mb-4 text-center">Edit Run</h2>
					{error && <Alert variant="danger">{error}</Alert>}

					<Form onSubmit={handleSubmit}>
						<Form.Group className="mb-3">
							<Form.Label>Distance</Form.Label>
							<Form.Control
								type="number"
								step="any"
								name="runDistance"
								value={form.runDistance}
								onChange={handleChange}
								required
							/>
						</Form.Group>

						<Form.Group className="mb-3">
							<Form.Label>Duration (HH:mm:ss)</Form.Label>
							<Form.Control
								type="text"
								name="runDuration"
								value={form.runDuration}
								onChange={handleChange}
								required
							/>
						</Form.Group>

						<Form.Group className="mb-3">
							<Form.Label>Date</Form.Label>
							<Form.Control
								type="date"
								name="runDate"
								value={form.runDate}
								onChange={handleChange}
								required
							/>
						</Form.Group>

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

						<Form.Group className="mb-4">
							<Form.Label>Additional Details</Form.Label>
							<Form.Control
								type="text"
								name="additionalDetails"
								value={form.additionalDetails}
								onChange={handleChange}
							/>
						</Form.Group>

						<Button type="submit" className="w-100 btn btn-primary">
							Save Changes
						</Button>
					</Form>
				</Col>
			</Row>
		</Container>
	);
}

export default EditRun;