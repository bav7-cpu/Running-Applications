import React, { useState, useEffect } from "react";
import { Container, Button, Toast } from "react-bootstrap";
import { BsArrowCounterclockwise } from "react-icons/bs";
import axios from "axios";
import BackButton from "../components/BackButton";
import HelpTooltip from "../components/HelpTooltip";
/**
 * this class shows deleted goals and lets user restore them
 * 
 */

export default function DeletedGoals() {
	const [deletedGoals, setDeletedGoals] = useState([]);
	const [toastMsg, setToastMsg] = useState("");

	const [user] = useState(() => JSON.parse(localStorage.getItem("user")));

	// this loads deleted goals from the backend when the page loads
	useEffect(() => {
		if (!user?.userID) {
			setToastMsg("User not found.");
			return;
		}

		axios
			.get(`/api/goals/deleted/${user.userID}`)
			.then((res) => {
				const data = Array.isArray(res.data?.data) ? res.data.data : [];
				setDeletedGoals(data);
			})
			.catch(() => setToastMsg("Could not load deleted goals."));
	}, [user?.userID]);

	/**
	 * this method restores a goal when user clicks the restore button
	 */
	const handleRestore = async (goalId) => {
		try {
			await axios.put(`/api/goals/${goalId}/restore`);
			setDeletedGoals((prev) => prev.filter((g) => g.goalID !== goalId));
			setToastMsg("Goal restored successfully.");
		} catch {
			setToastMsg("Failed to restore goal.");
		}
	};

	return (
			<Container className="mt-4">
				<div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 gap-2">
					<h2>
						Deleted Goals{" "}
						<HelpTooltip message="Goals not restored within 30 days will be permanently deleted automatically." />
					</h2>
					<BackButton to="/goals" label="Back to Goals" />
				</div>

				{/* shows fallback message if nothing to restore */}
				{deletedGoals.length === 0 ? (
					<p>No deleted goals found.</p>
				) : (
					<div className="bg-light p-3 rounded shadow-sm">
						{deletedGoals.map((goal) => (
							<div
								key={goal.goalID}
								className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center border-bottom py-2 gap-2"
							>
								<div>
									<strong>{goal.goalName}</strong> –{" "}
									{goal.goalDistance ? `${goal.goalDistance} ${goal.unit}` : ""}{" "}
									{goal.goalFrequency ? `(${goal.goalFrequency})` : ""}
								</div>
								<div className="d-flex gap-2">
									<Button
										size="sm"
										variant="outline-success"
										onClick={() => handleRestore(goal.goalID)}
										aria-label={`Restore goal ${goal.goalName}`}
									>
										<BsArrowCounterclockwise /> Restore
									</Button>
								</div>
							</div>
						))}
					</div>
				)}

				{/* toast message shows feedback to user */}
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
