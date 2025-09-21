import React, { useState } from "react";
import { createRun, updateRun } from "../api";

// Basic form component for both adding and editing runs without heuristic-enhancing features
function RunForm({ run, user, onSave, onCancel }) {
	const [form, setForm] = useState({
		runDate: run?.runDate || "",
		runDistance: run?.runDistance || "",
		runDuration: run?.runDuration || "",
		runSpeed: run?.runSpeed || "",
		unit: user?.unitPreference || "km",
		additionalDetails: run?.additionalDetails || "",
	});

	// Handle input field updates
	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm(prev => ({ ...prev, [name]: value }));
	};

	// Form submission handler (no alerts, no proactive validation)
	const handleSubmit = (e) => {
		e.preventDefault();

		const save = run
			? updateRun(run.runID, { ...form, userID: user.id })
			: createRun({ ...form, userID: user.id });

		save.then(onSave).catch(err => {
			console.error("Run save error:", err);
			// Silent failure (minimal feedback)
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
						<label className="form-label">Duration</label>
						<input
							type="text"
							name="runDuration"
							className="form-control form-control-sm"
							value={form.runDuration}
							onChange={handleChange}
							required
						/>
					</div>

					<div className="mb-2">
						<label className="form-label">Speed</label>
						<input
							type="text"
							name="runSpeed"
							className="form-control form-control-sm"
							value={form.runSpeed}
							onChange={handleChange}
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