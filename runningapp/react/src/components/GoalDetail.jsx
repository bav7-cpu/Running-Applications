// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { deleteGoal, getGoalById, updateGoal, restoreGoal } from '../api';
// import ConfirmModal from './ConfirmModal';
// import Spinner from './Spinner';
// import HelpTooltip from './HelpTooltip';
// import { Button, Form, Alert, Toast } from 'react-bootstrap';

// const GoalDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [goal, setGoal] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [deleting, setDeleting] = useState(false);
//   const [showConfirmSave, setShowConfirmSave] = useState(false);
//   const [showConfirmDelete, setShowConfirmDelete] = useState(false);
//   const [message, setMessage] = useState('');
//   const [undoTimeout, setUndoTimeout] = useState(null);

//   useEffect(() => {
//     getGoalById(id)
//       .then(res => {
//         setGoal(res.data.data);
//         setLoading(false);
//       })
//       .catch(() => {
//         setMessage('Goal not found.');
//         setLoading(false);
//       });
//   }, [id]);

//   const handleChange = (e) => {
//     setGoal({ ...goal, [e.target.name]: e.target.value });
//   };

//   const handleSave = () => {
//     setShowConfirmSave(false);
//     setSaving(true);
//     setMessage('Updating goal...');
//     updateGoal(goal.goalID, goal)
//       .then(() => {
//         setMessage('Goal updated successfully.');
//         setTimeout(() => navigate('/goals'), 1500);
//       })
//       .catch(() => setMessage('Error updating goal.'))
//       .finally(() => setSaving(false));
//   };

//   const handleDelete = () => {
//     setShowConfirmDelete(false);
//     setDeleting(true);
//     deleteGoal(goal.goalID)
//       .then(() => {
//         setMessage('Goal deleted. You can undo this action.');
//         const timeout = setTimeout(() => {
//           setUndoTimeout(null);
//           navigate('/goals');
//         }, 10000);
//         setUndoTimeout(timeout);
//       })
//       .catch(() => setMessage('Error deleting goal.'))
//       .finally(() => setDeleting(false));
//   };

//   const handleUndo = () => {
//     restoreGoal(goal.goalID)
//       .then(() => setMessage('Goal restored.'))
//       .catch(() => setMessage('Error restoring goal.'));
//     if (undoTimeout) {
//       clearTimeout(undoTimeout);
//       setUndoTimeout(null);
//     }
//   };

//   if (loading) return <Spinner />;

//   return (
//     <div className="container mt-4">
//       <h3>
//         Edit Goal
//         <HelpTooltip message="Update your goal, or delete if no longer needed." />
//       </h3>

//       {message && <Alert variant="info">{message}</Alert>}

//       {goal && (
//         <Form className="text-start">
//           <Form.Group className="mb-3">
//             <Form.Label>Goal Name</Form.Label>
//             <Form.Control
//               type="text"
//               name="goalName"
//               value={goal.goalName}
//               onChange={handleChange}
//               placeholder="Enter goal name"
//             />
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label>Goal Distance</Form.Label>
//             <Form.Control
//               type="number"
//               name="goalDistance"
//               value={goal.goalDistance || ''}
//               onChange={handleChange}
//               placeholder="e.g. 10"
//             />
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label>Goal Frequency</Form.Label>
//             <Form.Control
//               type="text"
//               name="goalFrequency"
//               value={goal.goalFrequency || ''}
//               onChange={handleChange}
//               placeholder="e.g. weekly"
//             />
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label>Target Date</Form.Label>
//             <Form.Control
//               type="date"
//               name="targetDate"
//               value={goal.targetDate || ''}
//               onChange={handleChange}
//             />
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label>Unit</Form.Label>
//             <Form.Select
//               name="unit"
//               value={goal.unit}
//               onChange={handleChange}
//             >
//               <option value="km">Kilometers</option>
//               <option value="miles">Miles</option>
//             </Form.Select>
//           </Form.Group>

//           <div className="mt-3">
//             <Button
//               variant="primary"
//               onClick={() => setShowConfirmSave(true)}
//               disabled={saving}
//             >
//               {saving ? 'Saving...' : 'Save'}
//             </Button>{' '}
//             <Button
//               variant="danger"
//               onClick={() => setShowConfirmDelete(true)}
//               disabled={deleting}
//             >
//               {deleting ? 'Deleting...' : 'Delete'}
//             </Button>{' '}
//             {undoTimeout && (
//               <Button variant="warning" onClick={handleUndo}>
//                 Undo Delete
//               </Button>
//             )}
//           </div>
//         </Form>
//       )}

//       <ConfirmModal
//         show={showConfirmSave}
//         onHide={() => setShowConfirmSave(false)}
//         onConfirm={handleSave}
//         message="Are you sure you want to update this goal?"
//       />

//       <ConfirmModal
//         show={showConfirmDelete}
//         onHide={() => setShowConfirmDelete(false)}
//         onConfirm={handleDelete}
//         message="Are you sure you want to delete this goal?"
//       />

//       <Toast
//         show={!!message}
//         onClose={() => setMessage("")}
//         delay={undoTimeout ? null : 3000}
//         autohide={!undoTimeout}
//         bg="info"
//         className="mt-3"
//       >
//         <Toast.Body className="text-white">{message}</Toast.Body>
//       </Toast>
//     </div>
//   );
// };

// export default GoalDetail;
