import React, { useEffect, useState } from "react";
import { createRun, updateRun } from "../api";

/**
 * reused form, for both the add and edit run
 * Realised middway through the edit run I can just reuse the add run
 * so created a helper class for it
 */

function RunForm({ run, user, onSave, onCancel }) {
	const [form, setForm] = useState({
		runDate: run?.runDate || "",
		runDistance: run?.runDistance || "",
		runDuration: run?.runDuration || "",
		runSpeed: run?.runSpeed || "",
		unit: user?.unitPreference || "km",
		additionalDetails: run?.additionalDetails || "",
	});

	useEffect(() => {
		// Automatically calculate speed

		//firstly the distance and duration are entered, matching hh:mm:ss format
		if (form.runDistance && form.runDuration.match(/^\d{2}:\d{2}:\d{2}$/)) {
			// each string is converted into a number so 00:30:00
			// becomes 0,30,0
			const [hh, mm, ss] = form.runDuration.split(":").map(Number);
			// total duration is converted into hours
			const durationHours = hh + mm / 60 + ss / 3600;
			// distance / time gives speed .toFixed method rounds it to 2 decimal places
			const speed = durationHours > 0 ? (form.runDistance / durationHours).toFixed(2) : "";
			// adds the runSpeed to the form, again keeping the user involved (giving feedback) and not guessing
			setForm(prev => ({ ...prev, runSpeed: speed }));
		}
	}, [form.runDistance, form.runDuration]);

	// form is updated as the user types thanks to this form
	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm(prev => ({ ...prev, [name]: value }));
	};

	// method handles form submissions 
	const handleSubmit = (e) => {
		e.preventDefault();

		if (!form.runDuration.match(/^\d{2}:\d{2}:\d{2}$/)) {
			alert("Duration must be in format HH:MM:SS");
			return;
		}
		// if updating or creating a run
		const save = run
			? updateRun(run.runID, { ...form, userID: user.id })
			: createRun({ ...form, userID: user.id });

		// run is saved is successful (onSave) and error messages are displayed if not
		save.then(onSave).catch(err => {
			console.error("Run save error:", err);
			alert("Failed to save run.");
		});
	};

	return (
		<div className="card mt-4">
			<div className="card-body">
				<h5>{run ? "Edit Run" : "Add Run"}</h5>
				<form onSubmit={handleSubmit}>
					<div className="mb-2">
						<label className="form-label">Date</label>
						<input
							type="date"
							name="runDate"
							className="form-control form-control-sm"
							value={form.runDate}
							onChange={handleChange}
							required
						/>
					</div>

					<div className="mb-2">
						<label className="form-label">Distance ({user?.unitPreference || "km"})</label>
						<input
							type="number"
							name="runDistance"
							className="form-control form-control-sm"
							value={form.runDistance}
							onChange={handleChange}
							step="0.01"
							required
						/>
					</div>

					<div className="mb-2">
						<label className="form-label">Duration (HH:MM:SS)</label>
						<input
							type="text"
							name="runDuration"
							className="form-control form-control-sm"
							value={form.runDuration}
							onChange={handleChange}
							placeholder="e.g. 00:30:00"
							required
						/>
					</div>

					<div className="mb-2">
						<label className="form-label">Speed (auto-calculated)</label>
						<input
							type="text"
							name="runSpeed"
							className="form-control form-control-sm"
							value={form.runSpeed}
							readOnly
						/>
					</div>

					<div className="mb-3">
						<label className="form-label">Additional Details</label>
						<input
							type="text"
							name="additionalDetails"
							className="form-control form-control-sm"
							value={form.additionalDetails}
							onChange={handleChange}
							placeholder="Any details you want to give about this run (optional)"
						/>
					</div>

					<div className="d-flex flex-column flex-md-row gap-2">
						<button type="submit" className="btn btn-primary w-100 w-md-auto">
							Save
						</button>
						<button type="button" className="btn btn-secondary w-100 w-md-auto" onClick={onCancel}>
							Cancel
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default RunForm;
