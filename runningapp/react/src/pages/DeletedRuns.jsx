import React, { useState, useEffect } from "react";
import { Container, Button, Toast } from "react-bootstrap";
import { BsArrowCounterclockwise } from "react-icons/bs";
import axios from "axios";
import BackButton from "../components/BackButton";
import HelpTooltip from "../components/HelpTooltip";  // import your reusable tooltip

/**
 * this class shows deleted runs and lets user restore them
 * 
 */

export default function DeletedRuns() {
	const [deletedRuns, setDeletedRuns] = useState([]);
	const [toastMsg, setToastMsg] = useState("");

	const [user] = useState(() => JSON.parse(localStorage.getItem("user")));

	// this useEffect loads deleted runs when the page is loaded
	useEffect(() => {
		if (!user?.userID) {
			setToastMsg("User not found.");
			return;
		}

		axios
			.get(`/api/runs/deleted/${user.userID}`)
			.then((res) => {
				const data = Array.isArray(res.data?.data) ? res.data.data : [];
				setDeletedRuns(data);
			})
			.catch(() => setToastMsg("Could not load deleted runs."));
	}, [user?.userID]);

	/**
	 * this method is active when user clicks the restore button
	 */
	const handleRestore = async (runId) => {
		try {
			await axios.put(`/api/runs/${runId}/restore`);
			setDeletedRuns((prev) => prev.filter((r) => r.runID !== runId));
			setToastMsg("Run restored successfully.");
		} catch {
			setToastMsg("Failed to restore run.");
		}
	};

	return (
			<Container className="mt-4">
				<div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 gap-2">
					<h2>
						Deleted Runs{" "}
						<HelpTooltip message="Runs not restored within 30 days will be permanently deleted automatically." />
					</h2>
					<BackButton to="/calendar" label="Back to Calendar" />
				</div>

				{/* shows message if nothing has been deleted */}
				{deletedRuns.length === 0 ? (
					<p>No deleted runs found.</p>
				) : (
					<div className="bg-light p-3 rounded shadow-sm">
						{deletedRuns.map((run) => (
							<div
								key={run.runID}
								className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center border-bottom py-2 gap-2"
							>
								<div>
									<strong>{new Date(run.runDate).toDateString()}</strong> –{" "}
									{run.runDistance} {run.unit || "km"}
								</div>
								<div className="d-flex gap-2">
									<Button
										size="sm"
										variant="outline-success"
										onClick={() => handleRestore(run.runID)}
										aria-label={`Restore run on ${new Date(run.runDate).toDateString()}`}
									>
										<BsArrowCounterclockwise /> Restore
									</Button>
								</div>
							</div>
						))}
					</div>
				)}

				{/* toast message is shown for feedback */}
				<Toast
					show={!!toastMsg}
					onClose={() => setToastMsg("")}
					delay={3000}
					autohide
					bg="success"
					className="mt-3"
				>
					<Toast.Body className="text-white">{toastMsg}</Toast.Body>
				</Toast>
			</Container>
		);
	}