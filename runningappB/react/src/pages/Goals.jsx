import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

// List of current goals (minimal version)
function Goals() {
	const [goals, setGoals] = useState([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	// Load goals on mount
	useEffect(() => {
		const fetchGoals = async () => {
			const user = JSON.parse(localStorage.getItem("user"));
			if (!user || !user.userID) return;

			try {
				const res = await axios.get(`/api/goals/user/${user.userID}`);
				setGoals(res.data.data || []);
			} catch (err) {
				console.error("Error fetching goals:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchGoals();
	}, []);

	// Delete goal by ID
	const handleDelete = async (id) => {
		try {
			await axios.delete(`/api/goals/${id}`);
			setGoals((prev) => prev.filter((goal) => goal.goalID !== id));
		} catch (err) {
			console.error("Delete failed:", err);
		}
	};

	return (
		<Container className="mt-4">
			<h2 className="mb-3">Current Goals</h2>

			<Row className="align-items-center mb-3">
				<Col xs={12} md="auto" className="ms-auto">
					<Button
						variant="secondary"
						onClick={() => navigate("/deleted-goals")}
						className="w-100 w-md-auto"
					>
						Deleted Goals
					</Button>
				</Col>
			</Row>

			{loading ? (
				<p>Loading...</p>
			) : goals.length === 0 ? (
				<p>No goals found.</p>
			) : (
				<div className="table-responsive">
					<Table striped bordered hover>
						<thead>
							<tr>
								<th>Name</th>
								<th>Distance</th>
								<th>Frequency</th>
								<th>Target Date</th>
								<th>Unit</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{goals.map((goal) => (
								<tr key={goal.goalID}>
									<td>{goal.goalName}</td>
									<td>{goal.goalDistance ?? "-"}</td>
									<td>{goal.goalFrequency || "-"}</td>
									<td>{goal.targetDate || "-"}</td>
									<td>{goal.unit}</td>
									<td>
										<div className="d-flex gap-2 flex-wrap">
											<Button
												variant="outline-primary"
												size="sm"
												onClick={() => navigate(`/editgoal/${goal.goalID}`)}
											>
												Edit
											</Button>
											<Button
												variant="outline-danger"
												size="sm"
												onClick={() => handleDelete(goal.goalID)}
											>
												Delete
											</Button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</Table>
				</div>
			)}

			<div className="d-flex justify-content-center justify-content-md-end mt-3">
				<Button variant="secondary" onClick={() => navigate("/addgoal")}>Add Goal</Button>
			</div>
		</Container>
	);
}

export default Goals;