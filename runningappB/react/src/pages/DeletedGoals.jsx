import React, { useEffect, useState } from "react";
import { getDeletedGoals, restoreGoal } from "../api";
import { Container, Row, Col, Button, Card } from "react-bootstrap";

/**
 * Displays user's deleted goals with option to restore them.
 */
function DeletedGoals() {
	const [deletedGoals, setDeletedGoals] = useState([]);
	const user = JSON.parse(localStorage.getItem("user"));

	useEffect(() => {
		if (user?.userID) {
			getDeletedGoals(user.userID)
				.then((res) => setDeletedGoals(res.data?.data || []))
				.catch((err) => console.error("Error loading deleted goals:", err));
		}
	}, [user?.userID]);

	const handleRestore = async (goalID) => {
		try {
			await restoreGoal(goalID);
			setDeletedGoals((prev) => prev.filter((g) => g.goalID !== goalID));
		} catch (err) {
			console.error("Restore error:", err);
		}
	};

	return (
		<Container className="mt-4">
			<Row className="justify-content-center">
				<Col xs={12} md={10} lg={8}>
					<h2 className="mb-4 text-center">Deleted Goals</h2>
					{deletedGoals.length === 0 ? (
						<p className="text-center">No deleted goals found.</p>
					) : (
						deletedGoals.map((goal) => (
							<Card key={goal.goalID} className="mb-3">
								<Card.Body>
									<Card.Title>{goal.goalName}</Card.Title>
									<Card.Text>{goal.goalDescription}</Card.Text>
									<Button
										variant="outline-success"
										onClick={() => handleRestore(goal.goalID)}
									>
										Restore
									</Button>
								</Card.Body>
							</Card>
						))
					)}
				</Col>
			</Row>
		</Container>
	);
}

export default DeletedGoals;
