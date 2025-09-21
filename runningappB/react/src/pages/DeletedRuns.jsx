import React, { useEffect, useState } from "react";
import { getDeletedRuns, restoreRun } from "../api";
import { Container, Row, Col, Button, Card } from "react-bootstrap";

/**
 * Displays user's deleted runs with option to restore them.
 */
function DeletedRuns() {
	const [deletedRuns, setDeletedRuns] = useState([]);
	const user = JSON.parse(localStorage.getItem("user"));

	useEffect(() => {
		if (user?.userID) {
			getDeletedRuns(user.userID)
				.then((res) => setDeletedRuns(res.data?.data || []))
				.catch((err) => console.error("Error loading deleted runs:", err));
		}
	}, [user?.userID]);

	const handleRestore = async (runID) => {
		try {
			await restoreRun(runID);
			setDeletedRuns((prev) => prev.filter((r) => r.runID !== runID));
		} catch (err) {
			console.error("Restore error:", err);
		}
	};

	return (
		<Container className="mt-4">
			<Row className="justify-content-center">
				<Col xs={12} md={10} lg={8}>
					<h2 className="mb-4 text-center">Deleted Runs</h2>
					{deletedRuns.length === 0 ? (
						<p className="text-center">No deleted runs found.</p>
					) : (
						deletedRuns.map((run) => (
							<Card key={run.runID} className="mb-3">
								<Card.Body>
									<Card.Title>{run.title || "Untitled Run"}</Card.Title>
									<Card.Text>
										{run.runDate} | {run.runDistance} {run.unit || "km"} | {run.runDuration} mins
									</Card.Text>
									<Button
										variant="outline-success"
										onClick={() => handleRestore(run.runID)}
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

export default DeletedRuns;
