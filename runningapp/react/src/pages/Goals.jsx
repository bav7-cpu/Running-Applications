import React, { useEffect, useState } from "react";
import axios from "axios";
import {Table,Button,Spinner,Container,Toast,OverlayTrigger,Tooltip,Row, Col} from "react-bootstrap";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";

/**
 * displays the list of current goals with edit and delete options
 * improves usability by adjusting layout for mobile devices
 */

function Goals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGoals = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.userID) return;

      try {
        const res = await axios.get(`/api/goals/user/${user.userID}`);
        setGoals(res.data.data || []);
      } catch (err) {
        console.error("Error fetching goals:", err);
        setToastMsg("Failed to load goals.");
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/goals/${id}`);
      setGoals((prev) => prev.filter((goal) => goal.goalID !== id));
      setToastMsg("Goal deleted successfully.");
    } catch (err) {
      console.error("Delete failed:", err);
      setToastMsg("Failed to delete goal.");
    }
  };

  return (
      <Container className="mt-4">
        {/* Tooltip at the top */}
		<h2 className="mb-3 d-inline-flex align-items-center gap-2">
		  Current Goals{" "}
		  <OverlayTrigger
		    overlay={<Tooltip id="goals-tooltip">View, edit, or delete your active goals.</Tooltip>}
		    placement="right"
		  >
		    <span
		      className="text-info"
		      style={{ cursor: "pointer" }}
		      tabIndex={0}
		      role="button"
		      aria-label="Help: About goals"
		    >
		      ?
		    </span>
		  </OverlayTrigger>
		</h2>


        <Row className="align-items-center mb-3 mt-2">
          <Col xs={12} md="auto" className="ms-auto">
            <Button
              variant="dark"
              onClick={() => navigate("/deleted-goals")}
              className="w-100 w-md-auto"
            >
              <BsTrash className="me-2" /> Deleted Goals
            </Button>
          </Col>
        </Row>

        {loading ? (
          <Spinner animation="border" />
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
                  <th className="text-center">Actions</th>
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
                      <div className="d-flex gap-2 justify-content-center flex-wrap">
                        <OverlayTrigger placement="top" overlay={<Tooltip>Update</Tooltip>}>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => navigate(`/editgoal/${goal.goalID}`)}
                          >
                            <BsPencilSquare />
                          </Button>
                        </OverlayTrigger>

                        <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(goal.goalID)}
                          >
                            <BsTrash />
                          </Button>
                        </OverlayTrigger>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}

        <div className="d-flex justify-content-center justify-content-md-end mt-3">
          <div style={{ minWidth: "200px" }}>
            <BackButton to="/addgoal" label="Go back to Add Goal" />
          </div>
        </div>

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

  export default Goals;