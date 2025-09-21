import React, { useEffect, useState } from "react";
import {
	Container,
	Card,
	Dropdown,
	ProgressBar,
	Row,
	Col,
} from "react-bootstrap";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import axios from "axios";

// Displays homepage with recent runs chart and goal progress
export default function Homepage() {
	const [chartOptions, setChartOptions] = useState({});
	const [recentRuns, setRecentRuns] = useState([]);
	const [unitFilter, setUnitFilter] = useState("both");
	const [goals, setGoals] = useState([]);
	const [selectedGoal, setSelectedGoal] = useState(null);

	const user = JSON.parse(localStorage.getItem("user"));

	useEffect(() => {
		if (!user?.userID) return;

		axios
			.get(`/api/runs/recent/${user.userID}`)
			.then((res) => {
				const runs = Array.isArray(res.data.data) ? res.data.data : [];
				const sortedRuns = runs.sort(
					(a, b) => new Date(a.runDate) - new Date(b.runDate)
				);
				setRecentRuns(sortedRuns);
			})
			.catch((err) => {
				console.error("Failed to load recent runs:", err);
			});

		axios
			.get(`/api/goals/user/${user.userID}`)
			.then((res) => {
				const allGoals = Array.isArray(res.data.data) ? res.data.data : [];
				setGoals(allGoals);
				setSelectedGoal(allGoals.length > 0 ? allGoals[0] : null);
			})
			.catch((err) => {
				console.error("Failed to load goals:", err);
			});
	}, [user?.userID]);

	useEffect(() => {
		if (recentRuns.length === 0) return;

		let filtered = recentRuns;
		if (unitFilter === "km") {
			filtered = recentRuns.filter((run) => run.unit === "km");
		} else if (unitFilter === "miles") {
			filtered = recentRuns.filter((run) => run.unit === "miles");
		}

		const categories = filtered.map((run) =>
			new Date(run.runDate).toLocaleDateString("en-GB", {
				weekday: "short",
				day: "numeric",
				month: "short",
			})
		);
		const data = filtered.map((run) => parseFloat(run.runDistance));
		const unitLabel =
			unitFilter === "both"
				? ""
				: filtered[0]?.unit
				? ` (${filtered[0].unit})`
				: "";

		const options = {
			accessibility: { enabled: false },
			chart: { type: "column" },
			title: { text: "Your Runs in the Last 7 Days" },
			xAxis: { categories, title: { text: "Date" } },
			yAxis: {
				title: { text: unitFilter === "both" ? "Distance" : `Distance${unitLabel}` },
				allowDecimals: true,
			},
			series: [
				{
					name: unitFilter === "both" ? "Distance" : `Distance${unitLabel}`,
					data,
					color: "#001f3f",
				},
			],
		};

		setChartOptions(options);
	}, [recentRuns, unitFilter]);

	const calculateProgress = () => {
		if (!selectedGoal || !selectedGoal.goalDistance || !selectedGoal.unit) return null;

		const totalDistance = recentRuns
			.filter((run) => run.unit === selectedGoal.unit)
			.reduce((sum, run) => sum + parseFloat(run.runDistance), 0);

		const percentage = Math.min(
			Math.round((totalDistance / selectedGoal.goalDistance) * 100),
			100
		);

		return {
			percentage,
			totalDistance: totalDistance.toFixed(2),
		};
	};

	const progress = calculateProgress();

	return (
		<Container className="mt-4">
			<h2 className="text-center mb-4">Welcome to RunTracker</h2>

			<Row>
				<Col md={8}>
					<Card className="p-4 shadow-sm mb-3">
						<div className="d-flex justify-content-between align-items-center mb-3">
							<h5 className="mb-0">Recent Run Summary</h5>
							<Dropdown>
								<Dropdown.Toggle
									variant="primary"
									size="sm"
									id="unit-filter"
								>
									{unitFilter === "km"
										? "Kilometers"
										: unitFilter === "miles"
										? "Miles"
										: "Filter Chart"}
								</Dropdown.Toggle>
								<Dropdown.Menu>
									<Dropdown.Item onClick={() => setUnitFilter("both")}>All (km + miles)</Dropdown.Item>
									<Dropdown.Item onClick={() => setUnitFilter("km")}>Kilometers Only</Dropdown.Item>
									<Dropdown.Item onClick={() => setUnitFilter("miles")}>Miles Only</Dropdown.Item>
								</Dropdown.Menu>
							</Dropdown>
						</div>

						{recentRuns.length > 0 ? (
							<HighchartsReact highcharts={Highcharts} options={chartOptions} />
						) : (
							<p className="text-muted">No runs recorded in the last 7 days.</p>
						)}
					</Card>
				</Col>

				<Col md={4}>
					{goals.length > 0 && (
						<Card className="p-3 shadow-sm mb-3">
							<div className="d-flex justify-content-between align-items-center mb-2">
								<h6 className="mb-0">Goal Progress</h6>
								<Dropdown>
									<Dropdown.Toggle
										variant="primary"
										size="sm"
										id="goal-filter"
									>
										{selectedGoal?.goalName || "Select Goal"}
									</Dropdown.Toggle>
									<Dropdown.Menu>
										{goals.map((goal) => (
											<Dropdown.Item
												key={goal.goalID}
												onClick={() => setSelectedGoal(goal)}
											>
												{goal.goalName}
											</Dropdown.Item>
										))}
									</Dropdown.Menu>
								</Dropdown>
							</div>

							{selectedGoal && selectedGoal.goalDistance && selectedGoal.unit && progress ? (
								<>
									<p className="mb-1" style={{ fontSize: "0.9rem" }}>{selectedGoal.goalName}</p>
									<p className="mb-2" style={{ fontSize: "0.85rem" }}>
										{progress.totalDistance} / {selectedGoal.goalDistance} {selectedGoal.unit}
									</p>
									<ProgressBar now={progress.percentage} label={`${progress.percentage}%`} />
								</>
							) : (
								selectedGoal && (
									<p className="text-muted mb-0" style={{ fontSize: "0.85rem" }}>
										This goal has no distance or unit set.
									</p>
								)
							)}
						</Card>
					)}
				</Col>
			</Row>
		</Container>
	);
}