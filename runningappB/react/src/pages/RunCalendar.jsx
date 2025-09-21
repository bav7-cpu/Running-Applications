import React, { useState, useEffect, useRef } from "react";
import {Container,Button,Overlay,Popover,Row,Col,} from "react-bootstrap";
import { BsTrash, BsPencilSquare } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function RunCalendar() {
	const [runs, setRuns] = useState([]);
	const [currentMonth, setCurrentMonth] = useState(new Date());
	const [setSelectedRunId] = useState(null);
	const [showSelector, setShowSelector] = useState(false);
	const [yearSelectMode, setYearSelectMode] = useState(true);
	const [tempYear, setTempYear] = useState(currentMonth.getFullYear());
	const selectorTarget = useRef(null);
	const [user] = useState(() => JSON.parse(localStorage.getItem("user")));
	const navigate = useNavigate();

	useEffect(() => {
		if (!user?.userID) return;
		axios
			.get(`/api/runs/user/${user.userID}`)
			.then((res) => {
				const data = Array.isArray(res.data) ? res.data : res.data?.data;
				setRuns(data.filter((r) => !r.isDeleted));
			})
			.catch(() => {
				console.error("Failed to load runs.");
			});
	}, [user?.userID]);

	const getDaysInMonth = (date) => {
		const year = date.getFullYear();
		const month = date.getMonth();
		return new Date(year, month + 1, 0).getDate();
	};

	

	const generateCalendarGrid = () => {
		const year = currentMonth.getFullYear();
		const month = currentMonth.getMonth();
		const firstDayOfWeek = new Date(year, month, 1).getDay();
		const totalDays = getDaysInMonth(currentMonth);
		const cells = [];

		for (let i = 0; i < firstDayOfWeek; i++) {
			cells.push(<div key={`empty-${i}`} className="calendar-cell empty" />);
		}

		for (let day = 1; day <= totalDays; day++) {
			const thisDate = new Date(year, month, day);
			const run = runs.find(
				(r) => new Date(r.runDate).toDateString() === thisDate.toDateString()
			);

			cells.push(
				<div key={day} className="calendar-cell filled">
					<strong>{day}</strong>
					{run && (
						<>
							<div style={{ fontSize: "0.8rem" }}>
								{run.runDistance} {run.unit || "km"}
							</div>
							<div className="d-flex gap-2 mt-1">
								<Button
									size="sm"
									variant="outline-primary"
									onClick={() => navigate(`/editrun/${run.runID}`)}
								>
									<BsPencilSquare />
								</Button>
								<Button
									size="sm"
									variant="outline-danger"
									onClick={async () => {
									  setSelectedRunId(run.runID);
									  try {
									    await axios.delete(`/api/runs/${run.runID}`);
									    setRuns((prev) => prev.filter((r) => r.runID !== run.runID));
									  } catch {
									    console.error("Failed to delete run.");
									  }
									}}

								>
									<BsTrash />
								</Button>
							</div>
						</>
					)}
				</div>
			);
		}

		return cells;
	};

	const handleYearClick = (year) => {
		setTempYear(year);
		setYearSelectMode(false);
	};

	const handleMonthClick = (month) => {
		const updated = new Date();
		updated.setFullYear(tempYear);
		updated.setMonth(month);
		setCurrentMonth(updated);
		setShowSelector(false);
		setYearSelectMode(true);
	};

	return (
		<Container className="mt-4">
			<Row className="align-items-center mb-3">
				<Col xs={12} md={6} className="mb-2 mb-md-0">
					<h2>Run Calendar</h2>
				</Col>
				<Col xs={12} md={6} className="text-md-end">
					<Button
						style={{ backgroundColor: "navy", borderColor: "navy" }}
						onClick={() => navigate("/deleted-runs")}
					>
						<BsTrash className="me-1" /> Deleted Runs
					</Button>
				</Col>
			</Row>

			<div className="d-flex justify-content-between align-items-center mb-3">
				<Button
					variant="outline-primary"
					onClick={() =>
						setCurrentMonth(
							new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
						)
					}
				>
					◀ Prev
				</Button>

				<div>
					<Button
						ref={selectorTarget}
						variant="secondary"
						onClick={() => setShowSelector(!showSelector)}
					>
						{currentMonth.toLocaleString("default", { month: "long", year: "numeric" })}
					</Button>
					<Overlay target={selectorTarget.current} show={showSelector} placement="bottom">
						<Popover id="month-year-selector" style={{ minWidth: "200px" }}>
							<Popover.Header as="h3">
								{yearSelectMode ? "Select Year" : `Select Month (${tempYear})`}
							</Popover.Header>
							<Popover.Body style={{ maxHeight: "250px", overflowY: "auto" }}>
								{yearSelectMode
									? Array.from({ length: 11 }, (_, i) => {
										const year = new Date().getFullYear() - 5 + i;
										return (
											<div key={year} style={{ cursor: "pointer", padding: "4px 8px" }} onClick={() => handleYearClick(year)}>
												{year}
											</div>
										);
									})
									: Array.from({ length: 12 }, (_, i) => (
										<div key={i} style={{ cursor: "pointer", padding: "4px 8px" }} onClick={() => handleMonthClick(i)}>
											{new Date(tempYear, i).toLocaleString("default", { month: "long" })}
										</div>
									))}
							</Popover.Body>
						</Popover>
					</Overlay>
				</div>

				<Button
					variant="outline-primary"
					onClick={() =>
						setCurrentMonth(
							new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
						)
					}
				>
					Next ▶
				</Button>
			</div>

			<div className="calendar-grid mb-3">
				{days.map((d) => (
					<div key={d} className="calendar-cell header fw-bold">
						{d}
					</div>
				))}
				{generateCalendarGrid()}
			</div>

			<style>{`
				.calendar-grid {
					display: grid;
					grid-template-columns: repeat(7, 1fr);
					gap: 8px;
				}
				.calendar-cell {
					border: 1px solid #ccc;
					min-height: 80px;
					padding: 6px;
					text-align: left;
					border-radius: 5px;
					background-color: white;
				}
				.calendar-cell.filled {
					background-color: #f8f9fa;
				}
				.calendar-cell.empty {
					background-color: transparent;
					border: none;
				}
				.calendar-cell.header {
					background-color: #e9ecef;
					text-align: center;
				}
				.popover-item:hover {
					background-color: #f0f0f0;
				}
			`}</style>
		</Container>
	);
}